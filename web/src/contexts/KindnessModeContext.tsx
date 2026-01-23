/**
 * Kindness Mode Context
 * 친절 모드 ON/OFF 상태 관리 및 용어 도움말 제공
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface KindnessModeContextType {
  isKindnessMode: boolean;
  toggleKindnessMode: () => void;
  setKindnessMode: (enabled: boolean) => void;
}

const KindnessModeContext = createContext<KindnessModeContextType | undefined>(undefined);

const STORAGE_KEY = 'neos-kindness-mode';

export function KindnessModeProvider({ children }: { children: ReactNode }) {
  const [isKindnessMode, setIsKindnessMode] = useState(() => {
    // 로컬 스토리지에서 초기값 로드 (기본값: true - 친절 모드 기본 활성화)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored !== null ? stored === 'true' : true;
    }
    return true;
  });

  // 상태 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isKindnessMode));
  }, [isKindnessMode]);

  const toggleKindnessMode = () => {
    setIsKindnessMode((prev) => !prev);
  };

  const setKindnessMode = (enabled: boolean) => {
    setIsKindnessMode(enabled);
  };

  return (
    <KindnessModeContext.Provider
      value={{
        isKindnessMode,
        toggleKindnessMode,
        setKindnessMode,
      }}
    >
      {children}
    </KindnessModeContext.Provider>
  );
}

export function useKindnessMode() {
  const context = useContext(KindnessModeContext);
  if (context === undefined) {
    throw new Error('useKindnessMode must be used within a KindnessModeProvider');
  }
  return context;
}

export default KindnessModeContext;
