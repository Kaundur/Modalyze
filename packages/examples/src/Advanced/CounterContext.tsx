import { createContext } from 'react';

type CounterContextType = {
    count: number;
    increment: () => void;
};

export const CounterContext = createContext<CounterContextType | null>(null);
