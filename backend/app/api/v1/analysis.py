from fastapi import APIRouter, UploadFile, File
from app.api.v1.websocket import manager 
import json

from app.schemas.analysis import AnalysisRequest, AnalysisResponse, FileAnalysisResponse
from app.services.analysis_service import perform_analysis, perform_file_analysis
from app.core.store import data_store

router = APIRouter()

@router.post("/analysis", response_model=AnalysisResponse)
def run_analysis(request: AnalysisRequest):
    """
    単純なデータ分析を実行する
    """
    result = perform_analysis(request)
    return result

@router.post("/upload-and-analyze", response_model=FileAnalysisResponse)
async def upload_and_analyze_file(file: UploadFile = File(...)):
    """
    ファイルを分析し、結果を保存・ブロードキャストする
    """
    result = perform_file_analysis(file)
    data_store.set_latest_analysis(result)

    broadcast_message = {
        "type": "analysis_result",
        "payload": result
    }
    
    await manager.broadcast(json.dumps(broadcast_message, ensure_ascii=False))

    return result