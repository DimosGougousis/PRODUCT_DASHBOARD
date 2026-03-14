import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PRD, Stakeholder } from '@/types/prd';
import { mockPRDs, mockStakeholders, createDefaultSections } from '@/data/mockData';

interface PRDContextType {
  prds: PRD[];
  stakeholders: Stakeholder[];
  addPRD: (prd: Omit<PRD, 'id' | 'createdAt' | 'updatedAt' | 'sections'>) => void;
  updatePRD: (id: string, updates: Partial<PRD>) => void;
  deletePRD: (id: string) => void;
  isLoading: boolean;
}

const PRDContext = createContext<PRDContextType | undefined>(undefined);

const STORAGE_KEY = 'prd-agent-data-v2';

// Helper to check if we're in browser
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

export const PRDProvider = ({ children }: { children: ReactNode }) => {
  const [prds, setPRDs] = useState<PRD[]>([]);
  const [stakeholders] = useState<Stakeholder[]>(mockStakeholders);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    console.log("PRDContext: Loading data...");
    
    if (!isBrowser) {
      console.log("PRDContext: Not in browser, using mock data");
      setPRDs(mockPRDs);
      setIsLoading(false);
      return;
    }
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        console.log("PRDContext: Found stored data, length:", stored.length);
        const parsed = JSON.parse(stored);
        console.log("PRDContext: Parsed data type:", typeof parsed, Array.isArray(parsed));
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log("PRDContext: Using stored data, count:", parsed.length);
          setPRDs(parsed);
        } else {
          console.log("PRDContext: Parsed data is empty or not an array, using mock data");
          setPRDs(mockPRDs);
        }
      } else {
        console.log("PRDContext: No stored data, using mock data");
        setPRDs(mockPRDs);
      }
    } catch (error) {
      console.error("PRDContext: Error loading from localStorage:", error);
      // Clear corrupted data
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error("PRDContext: Could not clear localStorage:", e);
      }
      setPRDs(mockPRDs);
    }
    setIsLoading(false);
    console.log("PRDContext: Loading complete");
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prds));
    }
  }, [prds, isLoading]);

  const addPRD = (prdData: Omit<PRD, 'id' | 'createdAt' | 'updatedAt' | 'sections'>) => {
    const id = crypto.randomUUID();
    const newPRD: PRD = {
      ...prdData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: createDefaultSections(id),
    };
    setPRDs((prev) => [newPRD, ...prev]);
  };

  const updatePRD = (id: string, updates: Partial<PRD>) => {
    setPRDs((prev) =>
      prev.map((prd) =>
        prd.id === id
          ? { ...prd, ...updates, updatedAt: new Date().toISOString() }
          : prd
      )
    );
  };

  const deletePRD = (id: string) => {
    setPRDs((prev) => prev.filter((prd) => prd.id !== id));
  };

  return (
    <PRDContext.Provider value={{ prds, stakeholders, addPRD, updatePRD, deletePRD, isLoading }}>
      {children}
    </PRDContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePRDs = () => {
  const context = useContext(PRDContext);
  if (!context) {
    throw new Error('usePRDs must be used within a PRDProvider');
  }
  return context;
};
