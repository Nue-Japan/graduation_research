from typing import Dict, Any, Optional

# デフォルトのトランスフォーム情報を定義
DEFAULT_TRANSFORM = {
    "position": {"x": 0, "y": 0, "z": 0},
    "rotation": {"x": 0, "y": 0, "z": 0},
    "scale": {"x": 1, "y": 1, "z": 1},
}

class DataStore:
    _instance = None
    _analysis_result: Optional[Dict[str, Any]] = None
    _object_transform: Dict[str, Any]

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DataStore, cls).__new__(cls)
            # 初期値を設定
            cls._analysis_result = None
            cls._object_transform = DEFAULT_TRANSFORM.copy()
        return cls._instance

    def get_latest_analysis(self) -> Optional[Dict[str, Any]]:
        return self._analysis_result

    def set_latest_analysis(self, result: Dict[str, Any]):
        self._analysis_result = result
        # 新しい分析が始まったらトランスフォーム情報をリセットする
        self._object_transform = DEFAULT_TRANSFORM.copy()

    def get_object_transform(self) -> Dict[str, Any]:
        """
        現在のオブジェクトのトランスフォーム情報を取得する
        """
        return self._object_transform

    def set_object_transform(self, transform_data: Dict[str, Any]):
        """
        オブジェクトのトランスフォーム情報を更新する
        """
        self._object_transform.update(transform_data)

# アプリケーション全体で共有されるインスタンスを作成
data_store = DataStore()