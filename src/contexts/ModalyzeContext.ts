import { createContext } from 'react';

export type ModalyzeContextType = {
    instanceId: string;
    parent: ModalyzeContextType | null;
    rootContainer: HTMLElement | null;
    getModalContainer?: (modalId: string) => HTMLElement | null;
};

export const ModalyzeContext = createContext<ModalyzeContextType | null>(null);
