from app.core.config import settings
import google.generativeai as genai

# APIキーを設定
genai.configure(api_key=settings.GEMINI_API_KEY)

def get_analysis_suggestion(result: float) -> str:
    """
    分析結果(数値)に基づいて、AIから提案を取得する
    """
    prompt = f"データの平均値は {result:.2f} でした。この結果から何が推測できますか？簡単な提案をしてください。"
    return _generate_content_from_prompt(prompt)


def get_analysis_suggestion_from_text(text: str) -> str:
    """
    分析結果(テキスト)に基づいて、AIから提案を取得する
    """
    return _generate_content_from_prompt(text)


def _generate_content_from_prompt(prompt: str) -> str:
    """
    指定されたプロンプトでAIからコンテンツを生成する共通関数
    """
    try:
        # ★★★ 修正箇所 ★★★
        # 使用するモデルを 'gemini-pro' に変更
        model = genai.GenerativeModel('gemini-1.5-flash')
        # ★★★ ここまで ★★★
        
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error communicating with Google AI: {e}"