import { useAppStore } from '@/store/useAppStore';
// import { Transform } from '@/store/useAppStore';

const WS_URL = 'wss://graduation-research-backend.onrender.com/api/v1/ws/';

let socket: WebSocket | null = null;

export const websocketService = {
  connect: (clientId: number) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log('WebSocketはすでに接続されています。');
      return;
    }

    socket = new WebSocket(`${WS_URL}${clientId}`);
    const { setConnectionStatus, addAnalysisResult, clearAnalysisResults, setObjectTransform } = useAppStore.getState().actions;

    socket.onopen = () => {
      console.log('WebSocket connected ✅');
      setConnectionStatus(true);
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('メッセージを受信:', message);

      switch (message.type) {
        case 'initial_state':
          clearAnalysisResults();
          if (message.payload.analysis) {
            addAnalysisResult(message.payload.analysis);
          }
          setObjectTransform(message.payload.transform);
          break;
        case 'analysis_result':
          addAnalysisResult(message.payload);
          break;
        case 'object_transform':
          setObjectTransform(message.payload);
          break;
      }
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected ❌');
      setConnectionStatus(false);
    };

    socket.onerror = (error) => {
      console.error('WebSocketエラー:', error);
      setConnectionStatus(false);
    };
  },

  disconnect: () => {
    if (socket) {
      socket.close();
    }
  },

  sendMessage: (message: object) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected.');
    }
  },
};