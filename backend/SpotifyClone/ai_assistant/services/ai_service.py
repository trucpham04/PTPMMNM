import requests
import os

GEMINI_API_KEY = "AIzaSyAMltKo-U-DQtZekd4bkOB1_YT1GZwXnJs"  # An toàn hơn
MODEL_NAME = "gemini-2.0-flash"
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent"

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
        result = response.json()
        
        # ✅ Debug response nội dung
        print("=== Gemini raw response ===")
        print(result)

        return result
    except Exception as e:
        return {"error": str(e)}

