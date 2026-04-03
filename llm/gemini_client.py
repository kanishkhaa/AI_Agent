import google.generativeai as genai
from app.config import GEMINI_API_KEY

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash") if GEMINI_API_KEY else None

def ask_gemini(prompt):
    if model is None:
        raise RuntimeError("Gemini API key is not configured.")
    response = model.generate_content(prompt)
    return response.text
