from fastapi import APIRouter, UploadFile, File
from app.api.v1.websocket import manager 
import json
from typing import List # ★ Listをインポート

from app.schemas.analysis import AnalysisRequest, AnalysisResponse, FileAnalysisResponse
from app.services.analysis_service import perform_analysis, perform_file_analysis
from app.core.store import data_store

router = APIRouter()

# ... ( /analysis エンドポイントは変更なし)

@router.post("/upload-and-analyze") # ★ レスポンスモデルを一旦削除
async def upload_and_analyze_files(files: List[UploadFile] = File(...)): # ★ files: List[UploadFile] に変更
    """
    複数のCSVファイルをアップロードして、一つずつ分析を実行する
    """
    all_results = []
    for file in files:
        # 1. ファイルを一つずつ分析
        result = perform_file_analysis(file)
        all_results.append(result)

        # 2. 分析結果をデータストアに保存（最新の結果で上書き）
        data_store.set_latest_analysis(result)

        # 3. 結果をJSON形式のメッセージに整形
        broadcast_message = {
            "type": "analysis_result",
            "payload": result
        }
        
        # 4. 接続している全クライアントに分析結果を一つずつブロードキャスト
        await manager.broadcast(json.dumps(broadcast_message, ensure_ascii=False))
    
    # 5. アップロードした本人にHTTPレスポンスとして全結果を返す
    return all_results