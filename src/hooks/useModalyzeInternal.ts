import { useMemo } from 'react';
import { useModalyzeBase } from './useModalyzeBase';
import { getModalCloseHandler, removeModal } from '../modalStore';

export const useModalyzeInternal = () => {
    const { modalStack } = useModalyzeBase();
    return useMemo(
        () => ({
            modalStack,
            removeModal,
            getModalCloseHandler,
        }),
        [modalStack]
    );
};
