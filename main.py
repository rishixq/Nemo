from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from pydantic import BaseModel
from typing import List
from app_state import reset_vector_store, get_vector_store

import os
import shutil

from assistant import Assistant
from roles import normalize_role
import uuid
import app_state




BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")


app = FastAPI(title="Role-Aware RAG API", version="1.0.0")
@app.on_event("startup")
def startup_event():
    print("✅ FastAPI started (no models loaded)")

app.mount("/data", StaticFiles(directory=DATA_DIR), name="data")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Models ----------
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    role: str = "user"
    history: List[ChatMessage] = []

# ---------- Health ----------
@app.get("/")
def health():
    return {"status": "Role-aware RAG backend running"}

# ---------- Upload Documents ----------
@app.post("/upload")
def upload_document(file: UploadFile = File(...)):
    try:
        os.makedirs(DATA_DIR, exist_ok=True)

        # 🔥 remove old documents
        for f in os.listdir(DATA_DIR):
            file_path = os.path.join(DATA_DIR, f)
            try:
                if os.path.isfile(file_path) and f != ".gitkeep":
                    os.remove(file_path)
            except PermissionError:
                print(f"⚠️ Skipping locked file: {file_path}")

        if not file.filename:
            raise HTTPException(status_code=400, detail="Uploaded file must have a name")

        filename = file.filename

        if not filename.lower().endswith((".pdf", ".txt", ".docx")):
            raise HTTPException(
                status_code=400,
                detail="Unsupported file type. Upload PDF, TXT, or DOCX only."
            )

        file_path = os.path.join(DATA_DIR, filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        file.file.close()
        

        reset_vector_store()

        app_state.CURRENT_NAMESPACE = f"doc-{uuid.uuid4()}"

        get_vector_store(namespace=app_state.CURRENT_NAMESPACE)

        return {
            "message": "Document uploaded successfully",
            "filename": filename
        }

    except Exception as e:
        print("🔥 UPLOAD ERROR:", repr(e))
        raise HTTPException(status_code=500, detail=str(e))

# ---------- Chat ----------
@app.post("/chat")
def chat(request: ChatRequest):
    try:
        role = normalize_role(request.role)

        message_history = [
            type("Msg", (), {"role": msg.role, "content": msg.content})
            for msg in request.history
        ]

        assistant = Assistant(
            role=role,
            message_history=message_history
        )

        reply = assistant.get_response(request.message)

        return {
            "reply": reply,
            "role": role,
            "source": assistant.last_source
        }

    except Exception as e:
        print("🔥 CHAT ERROR:", e)
        raise HTTPException(status_code=500, detail="Internal server error")

# ---------- ENTRY POINT ----------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8000)),
    )
