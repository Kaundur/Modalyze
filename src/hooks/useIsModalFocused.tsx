import { useSyncExternalStore } from 'react';
import { getFocusedModalId, subscribeToModals } from '../modalStore';

export const useIsModalFocused = (modalId: string) => {
    const focusedModalId = useSyncExternalStore(subscribeToModals, getFocusedModalId);
    return focusedModalId === modalId;
};
