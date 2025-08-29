import { create } from 'zustand';

// objectTransformが持つデータ構造の「型」を定義します
export interface Transform {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

// アプリケーションが持つ状態の型を定義します
interface AppState {
  isConnected: boolean;
  analysisResults: any[];
  objectTransform: Transform | null;
  actions: {
    setConnectionStatus: (status: boolean) => void;
    addAnalysisResult: (result: any) => void;
    clearAnalysisResults: () => void;
    setObjectTransform: (transform: Transform) => void;
  };
}

// ストアを作成します
export const useAppStore = create<AppState>((set) => ({
  isConnected: false,
  analysisResults: [],
  objectTransform: null,
  actions: {
    setConnectionStatus: (status) => set({ isConnected: status }),
    // 新しい結果を既存のリストの末尾に追加する
    addAnalysisResult: (result) => set((state: AppState) => ({ 
      analysisResults: [...state.analysisResults, result] 
    })),
    // 結果をすべてクリアする
    clearAnalysisResults: () => set({ analysisResults: [] }),
    setObjectTransform: (transform) => set({ objectTransform: transform }),
  },
}));