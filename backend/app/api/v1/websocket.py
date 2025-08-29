from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict, Any
import json
from app.core.store import data_store

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[Dict[str, Any]] = []

    async def connect(self, websocket: WebSocket, client_id: int):
        await websocket.accept()
        self.active_connections.append({"client_id": client_id, "ws": websocket})

    def disconnect(self, websocket: WebSocket):
        self.active_connections = [conn for conn in self.active_connections if conn["ws"] != websocket]

    async def _send_message(self, websocket: WebSocket, message: str):
        """メッセージ送信を安全に行うためのヘルパーメソッド"""
        try:
            await websocket.send_text(message)
        except RuntimeError as e:
            # 接続がすでに閉じられている場合のエラーを無視する
            print(f"Failed to send message to a closed connection: {e}")

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await self._send_message(connection["ws"], message)
    
    async def broadcast_to_others(self, message: str, sender_id: int):
        for connection in self.active_connections:
            if connection["client_id"] != sender_id:
                await self._send_message(connection["ws"], message)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await self._send_message(websocket, message)

manager = ConnectionManager()

@router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket, client_id)

    latest_analysis = data_store.get_latest_analysis()
    latest_transform = data_store.get_object_transform()
    
    initial_message = {
        "type": "initial_state",
        "payload": {
            "analysis": latest_analysis,
            "transform": latest_transform
        }
    }
    await manager.send_personal_message(json.dumps(initial_message, ensure_ascii=False), websocket)

    await manager.broadcast_to_others(json.dumps({
        "type": "user_join", "payload": {"client_id": client_id}
    }), sender_id=client_id)
    
    try:
        while True:
            data = await websocket.receive_text()
            
            if not data:
                continue
            
            message = json.loads(data)
            message_type = message.get("type")
            payload = message.get("payload", {})

            if message_type == "object_transform":
                data_store.set_object_transform(payload)
                await manager.broadcast_to_others(data, sender_id=client_id)
            
            elif message_type == "chat_message":
                chat_response = {
                    "type": "chat_message",
                    "payload": {"client_id": client_id, "message": payload.get("message")}
                }
                await manager.broadcast(json.dumps(chat_response))

    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(json.dumps({
            "type": "user_leave", "payload": {"client_id": client_id}
        }))