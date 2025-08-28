from pydantic import BaseModel

# 分析リクエストとして受け取るデータの形式を定義
class AnalysisRequest(BaseModel):
    user_id: str
    data_points: list[float]

# 分析結果として返すデータの形式を定義
class AnalysisResponse(BaseModel):
    user_id: str
    result: float
    message: str