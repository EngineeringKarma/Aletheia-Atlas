from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import google.generativeai as genai
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/aletheia", tags=["aletheia"])

# Gemini API setup
GEMINI_API_KEY = settings.gemini_api_key

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel(settings.ai_model)
    logger.info("Gemini API configured successfully")
else:
    logger.warning("GEMINI_API_KEY not found, AI features will use fallback responses")

class ChatRequest(BaseModel):
    message: str
    chat_mode: Optional[str] = "free"

@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        message = request.message
        
        if not message:
            return {"response": "Please provide a message", "status": "error"}
        
        # Use Gemini API if available
        if GEMINI_API_KEY:
            try:
                system_prompt = (
                    "You are Aletheia AI, an advanced student productivity assistant. "
                    "You specialize in creating high-performance study plans, analyzing academic productivity, "
                    "and providing motivational advice. Use emojis, bold text for emphasis, and bullet points. "
                    "Keep responses professional yet encouraging."
                )
                response = model.generate_content(
                    f"{system_prompt}\n\nUser: {message}\n\nAssistant:"
                )
                return {"content": response.text, "status": "success"}
            except Exception as e:
                logger.error(f"Gemini API error: {e}")
                return {
                    "content": f"I received your message: '{message}'. I'm here to help with productivity, study plans, and goals. (Gemini API error: {str(e)})",
                    "status": "error"
                }
        else:
            # Fallback response
            return {
                "content": f"I received your message: '{message}'. I'm here to help with productivity, study plans, and goals. Please add GEMINI_API_KEY to your .env file for AI-powered responses.",
                "status": "success"
            }
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        return {"response": f"Error: {str(e)}", "status": "error"}

@router.get("/health")
async def health():
    return {"status": "healthy", "gemini_configured": bool(GEMINI_API_KEY)}