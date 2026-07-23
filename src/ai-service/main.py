from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
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

class BatchEmailRequest(BaseModel):
    emails: List[EmailItem]


# Batch summarisation endpoint
@app.post("/summarise-batch")
def summarise_batch(req: BatchEmailRequest):

    if not req.emails:
        return {"results": []}

    # Build prompt
    prompt = "Summarize each email in ONE short sentence.\n\n"

    for i, email in enumerate(req.emails):
        prompt += f"{i+1}. {email.content}\n"

    prompt += "\nReturn ONLY the summaries as a numbered list."

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


# Status check
@app.get("/health")
def health():
    return {"status": "ok"}