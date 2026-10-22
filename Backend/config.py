import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL")

if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY is missing in .env")

if not GEMINI_MODEL:
    raise ValueError("GEMINI_MODEL is missing in .env")
