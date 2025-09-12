import { create } from 'zustand';

// 3Dオブジェクトのトランスフォーム情報の型
export interface Transform {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

// バックエンドから受け取る分析結果の具体的な「型」
export interface ColumnStats {
  count: number;
  mean: number;
  std: number;
  min: number;
  '25%': number;
  '50%': number;
  '75%': number;
  max: number;
}

export interface Summary {
  [key: string]: ColumnStats;
}

export interface AnalysisResult {
  filename: string;
  summary: Summary;
  suggestion: string;
}

// アプリケーションが持つ状態の型
interface AppState {
  isConnected: boolean;
  analysisResults: AnalysisResult[];
  objectTransform: Transform | null;
  actions: {
    setConnectionStatus: (status: boolean) => void;
    addAnalysisResult: (result: AnalysisResult) => void;
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
    // ★ --- 修正箇所 ---
    // 全てのアクションの引数に、具体的な型を明示的に指定します
    setConnectionStatus: (status: boolean) => set({ isConnected: status }),
    
    addAnalysisResult: (result: AnalysisResult) => set((state: AppState) => ({ 
      analysisResults: [...state.analysisResults, result] 
    })),
    
    clearAnalysisResults: () => set({ analysisResults: [] }),
    
    setObjectTransform: (transform: Transform) => set({ objectTransform: transform }),
    // ★ --- ここまで ---
  },
}));