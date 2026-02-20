import { useSyncExternalStore } from 'react';
import { subscribeToModals, getStackSnapshot, getFocusSnapshot } from '../modalStore';

export const useModalyzeBase = () => {
    const modalStack = useSyncExternalStore(subscribeToModals, getStackSnapshot);
    const focusedModalId = useSyncExternalStore(subscribeToModals, getFocusSnapshot);

    return { modalStack, focusedModalId };
};
