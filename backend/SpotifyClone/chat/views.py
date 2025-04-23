from django.shortcuts import render
from chat.models import Chat
from user.models import User
from music.models import Song, Artist, Album
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
import random

@api_view(['GET'])
def chat_history(request):
    if request.user.is_authenticated:
        chats = Chat.objects.filter(user=request.user).order_by('timestamp')
    else:
        chats = Chat.objects.all().order_by('timestamp')[:50]

    chat_data = []
    for chat in chats:
        # Tin nhắn từ người dùng
        chat_data.append({
            "sender": "user",
            "text": chat.message,
            "timestamp": chat.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
        })

        # Phản hồi từ AI nếu có
        if chat.response:
            chat_data.append({
                "sender": "bot",
                "text": chat.response,
                "timestamp": chat.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            })

    return Response({"chat_history": chat_data})
@csrf_exempt
@api_view(['POST'])
def chat(request):
    if request.method != "POST":
        return Response({"response": "Method not allowed"}, status=405)
    data = request.data
    message = data.get("message", "").lower()
    song_id = data.get("song_id", None)
    isPlaying = data.get("isPlaying", False)
    # Initialize user_id as None for anonymous users
    user_id = request.user.id if request.user.is_authenticated else None
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
        songs = Song.objects.filter(artist=artist).order_by("id")[:5]
        if not songs.exists():
            create_chat_record(f"Nghệ sĩ {artist_name} không có bài hát nào!")
            return Response({"response": f"Nghệ sĩ {artist_name} không có bài hát nào!"})
        song_list = [{
            "id": song.id,
            "title": song.title,
            "artist": song.artist.name,
            "album": song.album.title if song.album else None,
            "audio_file": song.audio_file.url,
            "video_file": song.video_file.url if song.video_file else None,
            "duration": str(song.duration),
            "lyrics": song.lyrics if song.lyrics else None,
        } for song in songs]
        create_chat_record(f"Đang phát các bài hát của {artist_name}!")
        return Response({
            "response": f"Đang phát các bài hát của {artist_name}!",
            "song": song_list,
        })
    # What song is currently playing?
    elif message.startswith("bài đang phát là bài gì"):
        if not (song_id or song_id == 0):
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
        
        album = Album.objects.filter(
            Q(title__icontains=album_title) & Q(artist=artist)
        ).first()
        
        if not album:
            create_chat_record(f"Không tìm thấy album {album_title} của nghệ sĩ {artist_name}")
            return Response({"response": f"Không tìm thấy album {album_title} của nghệ sĩ {artist_name}"})
        
        songs = Song.objects.filter(album=album).order_by("id")[:5]
        if not songs.exists():
            create_chat_record(f"Không tìm thấy bài hát nào trong album {album_title}!")
            return Response({"response": f"Không tìm thấy bài hát nào trong album {album_title}!"})
        
        song_list = [{
            "id": song.id,
            "title": song.title,
            "artist": song.artist.name,
            "album": song.album.title if song.album else None,
            "audio_file": song.audio_file.url,
            "video_file": song.video_file.url if song.video_file else None,
            "duration": str(song.duration),
            "lyrics": song.lyrics if song.lyrics else None,
        } for song in songs]
        
        create_chat_record(f"Đang phát các bài hát trong album {album_title} của {artist_name}!")
        return Response({
            "response": f"Đang phát các bài hát trong album {album_title} của {artist_name}!",
            "song": song_list,
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
        ).first()
        
        if not song:
            create_chat_record("Không tìm thấy bài hát này của nghệ sĩ!")
            return Response({"response": "Không tìm thấy bài hát này của nghệ sĩ!"})
        
        create_chat_record(f"Đang phát: {song.title} - {song.artist.name}")
        return Response({
            "response": f"Đang phát: {song.title} - {song.artist.name}",
            "song": {
                "id": song.id,
                "title": song.title,
                "artist": song.artist.name,
                "album": song.album.title if song.album else None,
                "audio_file": song.audio_file.url,
                "video_file": song.video_file.url if song.video_file else None,
                "duration": str(song.duration),
                "lyrics": song.lyrics if song.lyrics else None,
            }
        })

    # Skip to next song
    elif message == "chuyển bài hát tiếp theo":
        if not (song_id or song_id == 0):
            next_song = random.choice(Song.objects.all())
        else:
            song_id = int(song_id)
            next_song = Song.objects.filter(id__icontains=song_id).order_by("id").first()
        
        if not next_song:
            create_chat_record("Không thể chuyển bài!")
            return Response({"response": "Không thể chuyển bài!"}, status=400)
        
        create_chat_record(f"Đã chuyển sang bài hát tiếp theo: {next_song.title} - {next_song.artist.name}")
        return Response({
            "response": f"Đã chuyển sang bài hát tiếp theo: {next_song.title} - {next_song.artist.name}",
            "song": {
                "id": next_song.id,
                "title": next_song.title,
                "artist": next_song.artist.name,
                "album": next_song.album.title if next_song.album else None,
                "audio_file": next_song.audio_file.url,
                "video_file": next_song.video_file.url if next_song.video_file else None,
                "duration": str(next_song.duration),
                "lyrics": next_song.lyrics if next_song.lyrics else None,
            },
        })

    # Go to previous song
    elif message == "quay lại bài trước":
        if not (song_id or song_id == 0):
            prev_song = random.choice(Song.objects.all())
        else:
            song_id = int(song_id)
            prev_song = Song.objects.filter(id__icontains=song_id).order_by("id").first()
        
        if not prev_song:
            create_chat_record("Không thể quay lại bài trước!")
            return Response({"response": "Không thể quay lại bài trước!"}, status=400)
        
        create_chat_record(f"Đã chuyển về bài hát trước: {prev_song.title} - {prev_song.artist.name}")
        return Response({
            "response": f"Đã chuyển về bài hát trước: {prev_song.title} - {prev_song.artist.name}",
            "song": {
                "id": prev_song.id,
                "title": prev_song.title,
                "artist": prev_song.artist.name,
                "album": prev_song.album.title if prev_song.album else None,
                "audio_file": prev_song.audio_file.url,
                "video_file": prev_song.video_file.url if prev_song.video_file else None,
                "duration": str(prev_song.duration),
                "lyrics": prev_song.lyrics if prev_song.lyrics else None,
            },
        })

    # Resume playback
    elif message == "tiếp tục phát":
        if not (song_id or song_id == 0):
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
        if not song_id:
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