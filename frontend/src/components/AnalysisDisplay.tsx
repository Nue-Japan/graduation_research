'use client';

import { useAppStore } from '@/store/useAppStore';
import styles from './AnalysisDisplay.module.css';

export default function AnalysisDisplay() {
  const analysisResults = useAppStore((state) => state.analysisResults);

  if (!analysisResults || analysisResults.length === 0) {
    return (
      <div className={styles.container}>
        <h3>2. 分析結果</h3>
        <p>まだデータが分析されていません。ファイルをアップロードしてください。</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3>2. 分析結果</h3>
      {analysisResults.map((result, index) => (
        <div key={result.filename || index} style={{ marginBottom: '30px' }}>
          <h4>ファイル名: {result.filename}</h4>
          
          <h5>AIによる提案:</h5>
          <p className={styles.suggestion}>
            {result.suggestion}
          </p>
          
          <h5>統計サマリー:</h5>
          <pre className={styles.summary}>
            {JSON.stringify(result.summary, null, 2)}
          </pre>
        </div>
      ))}
    </div>
  );
}