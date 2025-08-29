import pandas as pd
from io import StringIO
from fastapi import UploadFile

from app.schemas.analysis import AnalysisRequest
from app.services.llm_service import get_analysis_suggestion, get_analysis_suggestion_from_text

def perform_analysis(request: AnalysisRequest):
    """
    受け取ったデータポイントの
    平均値を計算する。
    """
    if not request.data_points:
        avg = 0
    else:
        avg = sum(request.data_points) / len(request.data_points)

    suggestion = get_analysis_suggestion(avg)

    return_data = {
        "user_id": request.user_id,
        "result": avg,
        "message": "分析成功",
        "suggestion": suggestion
    }
    return return_data

def perform_file_analysis(file: UploadFile):
    """
    アップロードされたCSVファイルを読み込み、
    基本的な統計分析とAIによる提案を行う。
    """
    try:
        contents = file.file.read().decode("utf-8")
        df = pd.read_csv(StringIO(contents))

        summary = df.describe().to_dict()
        summary_str = df.describe().to_string()
        suggestion_prompt = f"以下のデータ分析結果があります。\n\n{summary_str}\n\nこのデータから考えられる特徴や、次に行うべき分析のアクションを提案してください。"
        
        suggestion = get_analysis_suggestion_from_text(suggestion_prompt)

        return {
            "filename": file.filename,
            "summary": summary,
            "suggestion": suggestion
        }
    except Exception as e:
        return {
            "filename": file.filename,
            "summary": {},
            "suggestion": f"ファイルの処理中にエラーが発生しました: {e}"
        }