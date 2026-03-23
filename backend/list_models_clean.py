import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("API_KEY_NOT_FOUND")
    exit(1)

genai.configure(api_key=api_key)

try:
    models = []
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            models.append(m.name)
    print("MODELS_BEGIN")
    for name in sorted(models):
        print(name)
    print("MODELS_END")
except Exception as e:
    print(f"ERROR: {e}")
