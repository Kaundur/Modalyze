import React, { useState } from 'react';
import { CounterContext } from './CounterContext';

export const CounterProvider = ({ children }: { children: React.ReactNode }) => {
    const [count, setCount] = useState<number>(0);

    const increment = () => setCount((c) => c + 1);

    return (
        <CounterContext.Provider value={{ count, increment }}>{children}</CounterContext.Provider>
    );
};
