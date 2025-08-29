'use client';

import { useEffect } from 'react';
import { websocketService } from '@/services/websocketService';
import { useAppStore } from '@/store/useAppStore';

export default function WebSocketController() {
  const isConnected = useAppStore((state) => state.isConnected);
  
  useEffect(() => {
    const clientId = Math.floor(Math.random() * 1000);
    websocketService.connect(clientId);

    return () => {
      websocketService.disconnect();
    };
  }, []);

  return (
    <div>
      <p>サーバー接続状態: <strong>{isConnected ? '✅ 接続中' : '❌ 未接続'}</strong></p>
    </div>
  );
}