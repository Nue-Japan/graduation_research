from fastapi import APIRouter
from schemas.analysis import AnalysisRequest, AnalysisResponse
from services.analysis_service import perform_analysis

router = APIRouter()

@router.post("/analysis", response_model=AnalysisResponse)
def run_analysis(request: AnalysisRequest):
    """
    データ分析を実行するエンドポイント
    """
    # ビジネスロジックの呼び出し
    result = perform_analysis(request)
    return result