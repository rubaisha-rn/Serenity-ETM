from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import requests

# App setup
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class EmailItem(BaseModel):
    id: str
    content: str
    context: Optional[List[str]] = None # retrieved similar past emails, if any

class BatchEmailRequest(BaseModel):
    emails: List[EmailItem]

class EmbedItem(BaseModel):
    id: str
    content: str

class BatchEmbedRequest(BaseModel):
    emails: List[EmbedItem]


# Batch summarisation endpoint (RAG-aware)
@app.post("/summarise-batch")
def summarise_batch(req: BatchEmailRequest):

    if not req.emails:
        return {"results": []}

    # Build prompt 
    # RAG will add optional 'related past content' line under any email that has it so that the model can use it without it being forced into every entry
    prompt = (
        "Summarise each email in ONE short sentence. No prefix, just the sentence. Some emails include "
        "relevant context from earlier related emails - use it only if it "
        "genuinely clarifies the summary, don't force a connection if it "
        "doesn't fit.\n\n"
    )

    for i, email in enumerate(req.emails):
        prompt += f"{i+1}. New email: {email.content}\n"
        if email.context:
            context_str = " | ".join(email.context)
            prompt += f"   Related past context: {context_str}\n"

    prompt += "\nReturn ONLY the numbered summaries, one per email, matching the numbering above."

    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "phi3", 
                "prompt": prompt,
                "stream": False,
                "options": {
                    "num_predict": 80,
                    "temperature": 0.2
                }
            },
            timeout=30
        )

        data = response.json()
        raw_text = data.get("response", "").strip()

        print("RAW BATCH OUTPUT:\n", raw_text)

        # Split lines safely
        lines = [
            line.strip()
            for line in raw_text.split("\n")
            if line.strip()
        ]

        results = []

        for i, email in enumerate(req.emails):
            summary = lines[i] if i < len(lines) else ""

            results.append({
                "id": email.id,
                "summary": summary
            })

        return {"results": results}

    except Exception as e:
        print("Batch error:", e)
        return {"results": []}


# Batch embedding endpoint - used to embed emails before they can be retrieved as RAG context. Separate from summarisation on purpose: an email needs an embedding once, ever, but gets summarised only when the user is stressed. No reason to couple those two lifecycles.
@app.post("/embed-batch")
def embed_batch(req: BatchEmbedRequest):

    if not req.emails:
        return {"results": []}

    results = []

    for item in req.emails:
        try:
            response = requests.post(
                "http://localhost:11434/api/embeddings",
                json={
                    "model": "nomic-embed-text",
                    "prompt": item.content
                },
                timeout=30
            )
            data = response.json()
            embedding = data.get("embedding")

            results.append({
                "id": item.id,
                "embedding": embedding
            })

        except Exception as e:
            print("Embed error:", e)
            results.append({
                "id": item.id,
                "embedding": None
            })

    return {"results": results}


# Status check
@app.get("/health")
def health():
    return {"status": "ok"}