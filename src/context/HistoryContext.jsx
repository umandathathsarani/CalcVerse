import { createContext, useContext, useState, useEffect } from 'react';

const HistoryContext = createContext();

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('calcverse_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Failed to parse history from localStorage', e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('calcverse_history', JSON.stringify(history));
  }, [history]);

  const addHistoryEntry = (calculatorType, expression, result) => {
    const newEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      calculatorType,
      expression,
      result
    };
    
    setHistory(prev => {
      // Keep only the last 100 entries to prevent localStorage bloat
      const newHistory = [newEntry, ...prev];
      if (newHistory.length > 100) {
        return newHistory.slice(0, 100);
      }
      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const deleteHistoryEntry = (id) => {
    setHistory(prev => prev.filter(entry => entry.id !== id));
  };

  const value = {
    history,
    addHistoryEntry,
    clearHistory,
    deleteHistoryEntry
  };

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
}
