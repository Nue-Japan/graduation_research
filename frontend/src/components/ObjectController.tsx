'use client';

import { useAppStore } from '@/store/useAppStore';
import { websocketService } from '@/services/websocketService';

export default function ObjectController() {
  const objectTransform = useAppStore((state) => state.objectTransform);

  const sendTransformUpdate = (axis: 'x' | 'y' | 'z', value: number) => {
    if (!objectTransform) return;

    const newPosition = { ...objectTransform.position, [axis]: value };
    const newTransform = { ...objectTransform, position: newPosition };

    websocketService.sendMessage({
      type: 'object_transform',
      payload: newTransform,
    });
  };

  if (!objectTransform) {
    return <p>分析データをアップロードすると、オブジェクトを操作できます。</p>;
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <h4>オブジェクト操作（シミュレーション）</h4>
      <p>スライダーを動かすと、3Dオブジェクトと他の参加者の画面にリアルタイムで反映されます。</p>
      <div>
        <label>Position X: {objectTransform.position.x.toFixed(2)}</label>
        <input
          type="range" min="-5" max="5" step="0.1"
          value={objectTransform.position.x}
          onChange={(e) => sendTransformUpdate('x', parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>
      <div>
        <label>Position Y: {objectTransform.position.y.toFixed(2)}</label>
        <input
          type="range" min="-5" max="5" step="0.1"
          value={objectTransform.position.y}
          onChange={(e) => sendTransformUpdate('y', parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}