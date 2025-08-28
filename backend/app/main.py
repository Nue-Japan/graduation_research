from fastapi import FastAPI
from api.v1 import analysis

app = FastAPI(title="Data Pratform API", version="1.0.0")

app.include_router(analysis.router, prefix="/api/v1")

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Data Platform API"}