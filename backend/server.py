"""Minimal backend for Conti di viaggio - the app runs fully on-device."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Conti di viaggio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health():
    return {"status": "ok", "app": "conti-di-viaggio"}


@app.get("/api/")
async def root():
    return {"message": "Conti di viaggio API"}
