import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TonConnect } from '@tonconnect/ui-react';
import { useTonConnect } from '../../hooks/useTonConnect';

interface ScoreContextType {
  scores: number;
  increaseScore: (points: number) => void;
  resetScore: () => void;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

interface ScoreProviderProps {
  children: ReactNode;
}

export const ScoreProvider: React.FC<ScoreProviderProps> = ({ children }) => {
  const [scores, setScore] = useState<number>(0);
  const {wallet} = useTonConnect();

  useEffect(() => {
    const savedScore = localStorage.getItem(`userScore_${wallet}`);
    if (savedScore) {
      setScore(Number(savedScore));
    }
  }, [wallet]);

  useEffect(() => {
    localStorage.setItem(`userScore_${wallet}`, String(scores));
  }, [scores, wallet]);


  const increaseScore = (points: number) => {
    setScore((prevScore) => prevScore + points);
  };

  const resetScore = () => {
    setScore(0);
  };

  return (
    <ScoreContext.Provider value={{ scores, increaseScore, resetScore }}>
      {children}
    </ScoreContext.Provider>
  );
};


export const useScore = (): ScoreContextType => {
  const context = useContext(ScoreContext);
  if (!context) {
    throw new Error('useScore must be used within a ScoreProvider');
  }
  return context;
};
