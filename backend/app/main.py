from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import analysis, websocket

app = FastAPI(title="Data Platform API", version="1.0.0")

# --- CORS設定 ---
origins = [
    "http://localhost",
    "http://localhost:3000",
    "https://nue-japan.github.io",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis.router, prefix="/api/v1", tags=["Analysis"])
app.include_router(websocket.router, prefix="/api/v1", tags=["WebSocket"])

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Data Platform API"}