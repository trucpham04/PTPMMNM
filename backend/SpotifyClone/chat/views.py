from django.shortcuts import render
from chat.models import Chat
from user.models import User
from music.models import Song, Artist, Album
from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.response import Response
import random
from django.db.models import Min,Max
@api_view(['GET'])
def chat_history(request):
    user_id = request.GET.get('user_id')

    if user_id:
        try:
            user = User.objects.get(id=user_id)
            chats = Chat.objects.filter(user=user).order_by('timestamp')
        except User.DoesNotExist:
            return Response({"chat_history": []})
    else:
        chats = Chat.objects.all().order_by('timestamp')[:50]

    chat_data = []
    for chat in chats:
        chat_data.append({
            "sender": "user",
            "text": chat.message,
            "timestamp": chat.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
        })

        if chat.response:
            chat_data.append({
                "sender": "bot",
                "text": chat.response,
                "timestamp": chat.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            })

    return Response({"chat_history": chat_data})
def serialize_song(song):
    return {
        "id": song.id,
        "title": song.title,
        "artist": {
            "id": song.artist.id,
            "name": song.artist.name,
            "image": song.artist.image.url if song.artist.image else None,
            "bio": song.artist.bio,
            "slug": song.artist.slug,
            "genres": [genre.name for genre in song.artist.genres.all()] if hasattr(song.artist, 'genres') else [],
        },
        "album": {
            "id": song.album.id,
            "title": song.album.title,
            "cover_image": song.album.cover_image.url if song.album and song.album.cover_image else None,
        } if song.album else None,
        "genres": [genre.name for genre in song.genres.all()],
        "audio_file": song.audio_file.url,
        "video_file": song.video_file.url if song.video_file else None,
        "duration": song.duration,
        "lyrics": song.lyrics,
        "release_date": song.release_date,
        "price": str(song.price),
        "is_downloadable": song.is_downloadable,
        "is_premium": song.is_premium,
        "play_count": song.play_count,
        "featuring_artists": [{
            "id": fa.id,
            "name": fa.name
        } for fa in song.featuring_artists.all()],
        "composers": [{
            "id": composer.id,
            "name": composer.name
        } for composer in song.composers.all()],
    }

@api_view(['POST'])
def chat(request):
    if request.method != "POST":
        return Response({"response": "Method not allowed"}, status=405)
    data = request.data
    message = data.get("message", "").lower()
    song_id = data.get("song_id", None)
    isPlaying = data.get("isPlaying", False)
    user_id = data.get('user_id',None)
    firstSong = data.get('firstSong',None)
    songListLength=data.get('songListLength',0)
    def create_chat_record(response_text):
        return Chat.objects.create(
            user_id=user_id,
            message=message,
            response=response_text
        )
    # 🔎 Find songs by artist
    if "phát bài của " in message:
        artist_name = message.replace("phát bài của ", "").strip()
        artist = Artist.objects.filter(name__icontains=artist_name).first()
        
        if not artist:
            create_chat_record(f"Không tìm thấy nghệ sĩ: {artist_name}")
            return Response({"response": f"Không tìm thấy nghệ sĩ: {artist_name}"})
        songs = Song.objects.filter(artist=artist).select_related('album', 'artist').prefetch_related('genres', 'featuring_artists', 'composers').order_by("id")
        if not songs.exists():
            create_chat_record(f"Nghệ sĩ {artist_name} không có bài hát nào!")
            return Response({"response": f"Nghệ sĩ {artist_name} không có bài hát nào!"})
        song_list = [serialize_song(song) for song in songs]
        create_chat_record(f"Đang phát các bài hát của {artist_name}!")
        return Response({
            "response": f"Đang phát các bài hát của {artist_name}!",
            "song": song_list,
            "action": "play_list"
        })
    # What song is currently playing?
    elif message.startswith("bài đang phát là bài gì"):
        if not song_id or song_id == 0:
            create_chat_record("Không có bài hát nào đang phát!")
            return Response({"response": "Không có bài hát nào đang phát!"})
        
        song_id = int(song_id)
        song = Song.objects.filter(id=song_id).first()
        if not song:
            create_chat_record("Không tìm thấy bài hát nào!")
            return Response({"response": "Không tìm thấy bài hát nào!"})
        
        create_chat_record(f"Bài đang phát: {song.title} - {song.artist.name}")
        return Response({
            "response": f"Bài đang phát: {song.title} - {song.artist.name}"
        })

    # Play songs in artist's album
    elif message.startswith("phát bài trong album "):
        song_title = message.replace("phát bài trong album", "").strip()
        parts = song_title.split(" của ")
        album_title = parts[0].strip()
        artist_name = parts[1].strip() if len(parts) == 2 else ""
        
        if not artist_name:
            create_chat_record("Vui lòng chỉ định nghệ sĩ!")
            return Response({"response": "Vui lòng chỉ định nghệ sĩ!"})
        
        artist = Artist.objects.filter(name__icontains=artist_name).first()
        if not artist:
            create_chat_record(f"Không tìm thấy nghệ sĩ: {artist_name}")
            return Response({"response": f"Không tìm thấy nghệ sĩ: {artist_name}"})
        
        album = Album.objects.filter(Q(title__icontains=album_title), Q(artist=artist)).first()
        
        if not album:
            create_chat_record(f"Không tìm thấy album {album_title} của nghệ sĩ {artist_name}")
            return Response({"response": f"Không tìm thấy album {album_title} của nghệ sĩ {artist_name}"})
        
        songs =  songs = Song.objects.filter(album=album).select_related(
        'album', 'artist'
    ).prefetch_related(
        'genres',
        'featuring_artists',
        'composers',
        'artist__genres',
        'album__genres'
    ).order_by("id")
        if not songs.exists():
            create_chat_record(f"Không tìm thấy bài hát nào trong album {album_title}!")
            return Response({"response": f"Không tìm thấy bài hát nào trong album {album_title}!"})
        
        song_list = [serialize_song(song) for song in songs]
        
        create_chat_record(f"Đang phát các bài hát trong album {album_title} của {artist_name}!")
        return Response({
            "response": f"Đang phát các bài hát trong album {album_title} của {artist_name}!",
            "song": song_list,
            "action": "play_list"
        })

    # Play specific song by artist
    elif message.startswith("phát bài "):
        song_title = message.replace("phát bài", "").strip()
        parts = song_title.split(" của ")
        song_title = parts[0].strip()
        artist_name = parts[1].strip() if len(parts) == 2 else ""
        
        if not artist_name:
            create_chat_record("Vui lòng chỉ định nghệ sĩ!")
            return Response({"response": "Vui lòng chỉ định nghệ sĩ!"})
        
        artist = Artist.objects.filter(name__icontains=artist_name).first()
        if not artist:
            create_chat_record(f"Không tìm thấy nghệ sĩ: {artist_name}")
            return Response({"response": f"Không tìm thấy nghệ sĩ: {artist_name}"})
        
        song = Song.objects.filter(
        Q(title__icontains=song_title) & Q(artist=artist)
        ).select_related(
        'album', 'artist'
        ).prefetch_related(
        'genres',
        'featuring_artists',
        'composers',
        'artist__genres',
        'album__genres'
        ).first()
        
        if not song:
            create_chat_record("Không tìm thấy bài hát này của nghệ sĩ!")
            return Response({"response": "Không tìm thấy bài hát này của nghệ sĩ!"})
        
        create_chat_record(f"Đang phát: {song.title} - {song.artist.name}")
        return Response({
            "response": f"Đang phát: {song.title} - {song.artist.name}",
            "song":serialize_song(song) 
            
        })

    # Skip to next song
    elif message == "chuyển bài hát tiếp theo":
        if not song_id or song_id == 0 :
            next_song = random.choice(Song.objects.all().select_related(
            'album', 'artist'  
            ).prefetch_related(
            'genres', 
            'featuring_artists',
            'composers',
            'artist__genres',  
            'album__genres'  
            ))

        else:
            if(songListLength == 1):
                if song_id == Song.objects.aggregate(Max('id'))['id__max']:
                    next_song = random.choice(Song.objects.all().select_related(
            'album', 'artist'  
            ).prefetch_related(
            'genres', 
            'featuring_artists',
            'composers',
            'artist__genres',  
            'album__genres'  
            ))  
                else:
                    next_song = Song.objects.filter(id__gt=song_id).order_by('id').select_related(
            'album', 'artist'
            ).prefetch_related(
            'genres',
            'featuring_artists',
            'composers',
            'artist__genres',
            'album__genres'
            ).first()
            else:
                if song_id == Song.objects.aggregate(Max('id'))['id__max']:
                    next_song = random.choice(Song.objects.all().select_related(
            'album', 'artist'  
            ).prefetch_related(
            'genres', 
            'featuring_artists',
            'composers',
            'artist__genres',  
            'album__genres'  
            ))  
                else:
                    if Song.objects.filter(id=song_id+1).exists():
                        next_song = Song.objects.filter(id=song_id+1).order_by('id').select_related(
            'album', 'artist'
            ).prefetch_related(
            'genres',
            'featuring_artists',
            'composers',
            'artist__genres',
            'album__genres'
            ).first()
                    else:
                        if firstSong==1:
                            next_song = random.choice(Song.objects.all().select_related(
                            'album', 'artist'  
                            ).prefetch_related(
                            'genres', 
                            'featuring_artists',
                            'composers',
                            'artist__genres',  
                            'album__genres'  
                            ))      
                        else:
                            next_song = Song.objects.filter(id=song_id).order_by("id").select_related(
            'album', 'artist'
            ).prefetch_related(
            'genres',
            'featuring_artists',
            'composers',
            'artist__genres',
            'album__genres'
            ).first()
        if not next_song:
            create_chat_record("Không thể chuyển bài!")
            return Response({"response": "Không thể chuyển bài!"})
        
        create_chat_record(f"Đã chuyển sang bài hát tiếp theo: {next_song.title} - {next_song.artist.name}")
        return Response({
            "response": f"Đã chuyển sang bài hát tiếp theo: {next_song.title} - {next_song.artist.name}",
            "song":serialize_song(next_song) 
        })

    # Go to previous song
    elif message == "quay lại bài trước":
        if not song_id or song_id == 0 :
            prev_song = random.choice(Song.objects.all().select_related(
            'album', 'artist'  
            ).prefetch_related(
            'genres', 
            'featuring_artists',
            'composers',
            'artist__genres',  
            'album__genres'  
            ))
        else:
            if(songListLength == 1):
                if song_id == Song.objects.aggregate(Min('id'))['id__min']:
                    prev_song = random.choice(Song.objects.all().select_related(
            'album', 'artist'  
            ).prefetch_related(
            'genres', 
            'featuring_artists',
            'composers',
            'artist__genres',  
            'album__genres'  
            ))  
                else:
                    prev_song = Song.objects.filter(id__lt=song_id).order_by('-id').select_related(
            'album', 'artist'
            ).prefetch_related(
            'genres',
            'featuring_artists',
            'composers',
            'artist__genres',
            'album__genres'
            ).first()
            else:
                if song_id == Song.objects.aggregate(Min('id'))['id__min']:
                    prev_song = random.choice(Song.objects.all().select_related(
            'album', 'artist'  
            ).prefetch_related(
            'genres', 
            'featuring_artists',
            'composers',
            'artist__genres',  
            'album__genres'  
            ))  
                else:
                    if Song.objects.filter(id=song_id-1).exists():
                        prev_song = Song.objects.filter(id=song_id-1).order_by('id').select_related(
            'album', 'artist'
            ).prefetch_related(
            'genres',
            'featuring_artists',
            'composers',
            'artist__genres',
            'album__genres'
            ).first()
                    else:
                        if firstSong==1:
                            prev_song = random.choice(Song.objects.all().select_related(
                            'album', 'artist'  
                            ).prefetch_related(
                            'genres', 
                            'featuring_artists',
                            'composers',
                            'artist__genres',  
                            'album__genres'  
                            ))      
                        else:
                            prev_song = Song.objects.filter(id=song_id).order_by('id').select_related(
                            'album', 'artist'
                            ).prefetch_related(
            'genres',
            'featuring_artists',
            'composers',
            'artist__genres',
            'album__genres'
            ).first()
            
        if not prev_song:
            create_chat_record("Không thể quay lại bài trước!")
            return Response({"response": "Không thể quay lại bài trước!"})
        
        create_chat_record(f"Đã chuyển về bài hát trước: {prev_song.title} - {prev_song.artist.name}")
        return Response({
            "response": f"Đã chuyển về bài hát trước: {prev_song.title} - {prev_song.artist.name}",
            "song":serialize_song(prev_song) 
        })

    # Resume playback
    elif message == "tiếp tục phát":
        if not song_id or song_id == 0:
            create_chat_record("Không có bài hát nào đang phát để tiếp tục.")
            return Response({"response": "Không có bài hát nào đang phát để tiếp tục."})
        
        song = Song.objects.filter(id=song_id).first()
        if not song:
            create_chat_record("Không có bài hát nào đang phát để tiếp tục.")
            return Response({"response": "Không có bài hát nào đang phát để tiếp tục."})
        if(isPlaying == True):
            create_chat_record("Bài hát đã phát rồi!")
            return Response({"response": "Bài hát đã phát rồi!"})
        create_chat_record(f"Tiếp tục phát bài hát: {song.title} - {song.artist.name}")
        return Response({
            "response": f"Tiếp tục phát bài hát: {song.title} - {song.artist.name}",
            "action": "resume"
        })

    # Pause playback
    elif message == "tạm dừng phát":
        if not song_id or song_id == 0:
            create_chat_record("Không có bài hát nào đang phát để tạm dừng.")
            return Response({"response": "Không có bài hát nào đang phát để tạm dừng."})
        
        song = Song.objects.filter(id=song_id).first()
        if not song:
            create_chat_record("Không có bài hát nào đang phát để tạm dừng")
            return Response({"response": "Không có bài hát nào đang phát để tạm dừng"})
        if(isPlaying == False):
            create_chat_record("Bài hát đã tạm dừng rồi!")
            return Response({"response": "Bài hát đã tạm dừng rồi!"})
        create_chat_record(f"Đã tạm dừng bài hát: {song.title} - {song.artist.name}")
        return Response({
            "response": f"Đã tạm dừng bài hát: {song.title} - {song.artist.name}",
            "action": "pause"
        })

    create_chat_record("Xin lỗi, tôi không hiểu yêu cầu của bạn.")
    return Response({"response": "Xin lỗi, tôi không hiểu yêu cầu của bạn."})