import WebSocketController from "@/components/WebSocketController";
import FileUpload from "@/components/FileUpload";
import AnalysisDisplay from "@/components/AnalysisDisplay";
import ObjectController from "@/components/ObjectController";
import Scene from "@/components/Scene";

export default function Home() {
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  };

  return (
    <main style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>AR Data Platform 📊</h1>
        <p>CSVファイルをアップロードして、データを3Dで可視化・分析します。</p>
      </div>

      <div style={cardStyle}>
        <WebSocketController />
      </div>
      
      <div style={cardStyle}>
        <FileUpload />
      </div>

      <div style={cardStyle}>
        <h3>3D可視化</h3>
        <Scene />
        <ObjectController />
      </div>
      
      <div style={cardStyle}>
        <AnalysisDisplay />
      </div>
    </main>
  );
}