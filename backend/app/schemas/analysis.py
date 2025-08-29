from pydantic import BaseModel
from typing import Dict, Any, List

# 分析リクエストとして受け取るデータの形式を定義
class AnalysisRequest(BaseModel):
    user_id: str
    data_points: List[float]

# 分析結果として返すデータの形式を定義
class AnalysisResponse(BaseModel):
    user_id: str
    result: float
    message: str
    suggestion: str

# ファイル分析結果として返すデータの形式を定義
class FileAnalysisResponse(BaseModel):
    filename: str
    summary: Dict[str, Any]
    suggestion: str