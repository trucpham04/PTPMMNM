from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from music.models import Song, Album, Artist, Genre
from music.serializers.song_serializer import SongSerializer
from music.serializers.album_serializer import AlbumSerializer
from music.serializers.artist_serializer import ArtistSerializer
from music.serializers.genre_serializer import GenreSerializer
import requests
import json
import re

GEMINI_API_KEY = "AIzaSyAMltKo-U-DQtZekd4bkOB1_YT1GZwXnJs"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

def gemini_chat(prompt: str):
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [
            {"parts": [{"text": prompt}]}
        ]
    }
    try:
        response = requests.post(GEMINI_URL, headers=headers, json=data)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": str(e)}

@api_view(["POST"])
def ai_chat_song(request):
    user_input = request.data.get("prompt")
    if not user_input:
        return Response({"error": "Prompt is required"}, status=400)

    intent_prompt = (
        f"Hãy phân tích mục đích của người dùng qua đoạn sau:\n\"{user_input}\"\n"
        f"Trả lời dưới dạng JSON với 2 trường: 'intent' (vd: title_search, artist_info, genre_info, album_info, ...) "
        f"và 'keywords' (danh sách từ khóa chính).\n"
        f"Ví dụ: {{\"intent\": \"artist_info\", \"keywords\": [\"Taylor Swift\"]}}"
    )

    ai_intent = gemini_chat(intent_prompt)

    if "error" in ai_intent:
        return Response({"error": f"Lỗi từ Gemini: {ai_intent['error']}"}, status=500)

    try:
        text = ai_intent["candidates"][0]["content"]["parts"][0]["text"]
        match = re.search(r'\{.*\}', text, re.DOTALL)
        parsed = json.loads(match.group())
        intent = parsed["intent"]
        keywords = parsed.get("keywords", [])
    except Exception as e:
        return Response({"error": f"Phân tích intent thất bại: {str(e)}"}, status=500)

    if not keywords:
        return Response({"error": "Không có từ khóa phù hợp."})

    kw = keywords[0]

    # Bước 2: Nếu là intent mô tả (ví dụ artist_info, genre_info, album_info) thì gọi lại Gemini để sinh đoạn văn
    if intent in ["artist_info", "genre_info", "album_info"]:
        info_prompt = f"Bạn hãy giới thiệu ngắn gọn về {kw} dưới dạng đoạn văn thân thiện với người dùng."
        info_response = gemini_chat(info_prompt)

        if "error" in info_response:
            return Response({"error": f"Lỗi khi gọi Gemini cho thông tin mô tả: {info_response['error']}"}, status=500)

        try:
            info_text = info_response["candidates"][0]["content"]["parts"][0]["text"]
            return Response({"type": "info", "text": info_text})
        except:
            return Response({"error": "Phân tích phản hồi mô tả thất bại."}, status=500)

    # Bước 3: Tìm album của nghệ sĩ
    if intent == "album_search":
        artist = Artist.objects.filter(name__icontains=kw).first()
        if artist:
            albums = Album.objects.filter(artist=artist)
            return Response({"type": "albums", "albums": AlbumSerializer(albums, many=True).data})
        return Response({"error": "Không tìm thấy nghệ sĩ."})

    # Bước 4: Tìm bài hát hoặc thể loại
    queryset = Song.objects.none()
    if intent == "title_search":
        queryset = Song.objects.filter(title__icontains=kw)
    elif intent == "lyrics_search":
        queryset = Song.objects.filter(lyrics__icontains=kw)
    elif intent == "mood_search":
        queryset = Song.objects.filter(
            Q(lyrics__icontains=kw) | Q(genres__name__icontains=kw)
        ).distinct()
    elif intent == "artist_search":
        queryset = Song.objects.filter(artist__name__icontains=kw)
    elif intent == "album_search":
        queryset = Song.objects.filter(album__title__icontains=kw)
    elif intent == "genre_search":
        queryset = Song.objects.filter(genres__name__icontains=kw).distinct()

    if queryset.exists():
        return Response({"type": "songs", "songs": SongSerializer(queryset, many=True).data})

    # Trả về thông tin về nghệ sĩ, album, thể loại
    if intent == "artist_info":
        artist = Artist.objects.filter(name__icontains=kw).first()
        if artist:
            return Response({"type": "artist", "artist": ArtistSerializer(artist).data})
        return Response({"error": "Không tìm thấy nghệ sĩ."})

    elif intent == "album_info":
        album = Album.objects.filter(title__icontains=kw).first()
        if album:
            return Response({"type": "album", "album": AlbumSerializer(album).data})
        return Response({"error": "Không tìm thấy album."})

    elif intent == "genre_info":
        genre = Genre.objects.filter(name__icontains=kw).first()
        if genre:
            return Response({"type": "genre", "genre": GenreSerializer(genre).data})
        return Response({"error": "Không tìm thấy thể loại."})

    return Response({"error": "Không thể xử lý yêu cầu."})
