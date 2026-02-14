import { CounterContext } from './CounterContext';
import { useContext } from 'react';

export const useCount = () => {
    const ctx = useContext(CounterContext);
    if (!ctx) throw new Error('useCounter must be used within CounterProvider');
    return ctx;
};
