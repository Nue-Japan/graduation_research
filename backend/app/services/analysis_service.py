# スキーマをインポート
from schemas.analysis import AnalysisRequest

def perform_analysis(request : AnalysisRequest):
    """
    受け取ったデータポイントの
    平均値を計算する。
    """
    if not request.data_points:
        avg = 0
    else:
        avg = sum(request.data_points) / len(request.data_points)
    return_data = {
        "user_id": request.user_id,
        "result": avg,
        "message": "分析成功"
    }
    return return_data