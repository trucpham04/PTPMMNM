from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from music.models import Song
from music.serializers.song_serializer import SongSerializer
import requests
import json
import re

# --- CONFIG ---
GEMINI_API_KEY = "AIzaSyAMltKo-U-DQtZekd4bkOB1_YT1GZwXnJs"  # Nên đưa vào biến môi trường
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

# --- FUNCTION ---
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

# --- VIEW ---
@api_view(["POST"])
def ai_chat_song(request):
    user_input = request.data.get("prompt")
    if not user_input:
        return Response({"error": "Prompt is required"}, status=400)

    # Bước 1: Phân tích mục đích
    intent_prompt = (
        f"Hãy phân tích mục đích của người dùng qua đoạn sau:\n\"{user_input}\"\n"
        f"Trả lời dưới dạng JSON với 2 trường: 'intent' (vd: title_search, artist_info, genre_info, ...) "
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

    # Bước 2: Nếu là intent mô tả (ví dụ artist_info) thì gọi lại Gemini để sinh đoạn văn
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

    # Bước 3: Nếu là intent tìm bài hát, truy vấn DB
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

    return Response({"type": "songs", "songs": SongSerializer(queryset, many=True).data})
