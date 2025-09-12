'use client';

import React, { useState } from 'react';
import axios from 'axios';
import styles from './FileUpload.module.css';
import { useAppStore } from '@/store/useAppStore';

const API_URL = 'https://graduation-research-backend.onrender.com/api/v1/upload-and-analyze';

export default function FileUpload() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const clearAnalysisResults = useAppStore((state) => state.actions.clearAnalysisResults);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setMessage('ファイルを選択してください。');
      return;
    }

    clearAnalysisResults();
    setIsLoading(true);
    setMessage('アップロード中...');

    const formData = new FormData();
    Array.from(selectedFiles).forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(`${response.data.length}個のファイルの分析リクエストを送信しました。`);
    } catch (error) {
      console.error('Upload Error:', error);
      setMessage('アップロード中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>1. データファイルをアップロード</h3>
      <div className={styles.inputGroup}>
        <input type="file" accept=".csv" onChange={handleFileChange} multiple />
        <button onClick={handleUpload} disabled={isLoading || !selectedFiles} className={styles.button}>
          {isLoading ? '分析中...' : '分析を実行'}
        </button>
      </div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}