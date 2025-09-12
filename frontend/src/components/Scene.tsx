'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Text } from '@react-three/drei';
import { useAppStore,AnalysisResult } from '@/store/useAppStore';

// 棒グラフ本体のコンポーネント
function Bar({ position, height, color }: { position: [number, number, number], height: number, color: string }) {
  return (
    <Box args={[0.5, 1, 0.5]} scale={[1, height, 1]} position={[position[0], height / 2, position[2]]}>
      <meshStandardMaterial color={color} />
    </Box>
  );
}

// 1つの分析結果を描画するためのコンポーネント
function AnalysisChart({ analysisResult, positionZ }: { analysisResult: AnalysisResult, positionZ: number }) {
  const barData = (analysisResult?.summary && typeof analysisResult.summary === 'object')
    ? Object.entries(analysisResult.summary).map(([key, stats], index) => {
        const meanValue = (stats && typeof stats === 'object' && 'mean' in stats && typeof stats.mean === 'number')
          ? stats.mean
          : 0;
        
        return {
          key,
          value: meanValue,
          position: [index * 1.5 - 1.5, 0, 0] as [number, number, number],
        };
      })
    : [];
  
  const maxValue = barData.length > 0 ? Math.max(...barData.map(d => d.value)) : 1;

  return (
    <group position={[0, 0, positionZ]}>
      {analysisResult?.filename && (
        <Text
          position={[2, 4.5, 0]}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {analysisResult.filename}
        </Text>
      )}

      {barData.map((data) => {
        const barHeight = (data.value / (maxValue || 1)) * 3;
        return (
          <group key={data.key}>
            <Bar
              position={data.position}
              height={barHeight} 
              color="royalblue"
            />
            <Text
              position={[data.position[0], barHeight + 0.3, 0]}
              fontSize={0.3}
              color="black"
              anchorX="center"
              anchorY="middle"
            >
              {data.value.toFixed(2)}
            </Text>
            <Text
              position={[data.position[0], -0.7, 0]}
              fontSize={0.3}
              color="black"
              anchorX="center"
              anchorY="middle"
            >
              {data.key}
            </Text>
          </group>
        );
      })}
      
      <Box args={[14, 0.01, 0.5]} position={[3, -0.05, 0]}>
         <meshStandardMaterial color="gray" />
      </Box>
    </group>
  );
}

export default function Scene() {
  const analysisResults = useAppStore((state) => state.analysisResults);
  const objectTransform = useAppStore((state) => state.objectTransform);

  if (!objectTransform) {
    return <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0e0e0', borderRadius: '5px' }}>分析データを待っています...</div>;
  }

  return (
    <div style={{ height: '400px', backgroundColor: '#e0e0e0', borderRadius: '5px' }}>
      <Canvas camera={{ position: [0, 2, 8] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        
        <group
          position={[
            objectTransform.position.x,
            objectTransform.position.y,
            0
          ]}
        >
          {analysisResults.map((result, index) => (
            <AnalysisChart key={result.filename || index} analysisResult={result} positionZ={-index * 5} />
          ))}
        </group>

        <OrbitControls />
      </Canvas>
    </div>
  );
}