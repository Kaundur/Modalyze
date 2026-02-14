import { createContext, useContext } from 'react';
import { ModalCloseHandler } from './ModalyzeModalInternalContext';

/**
 * Context API available to components rendered inside modals.
 * Provides modal-specific utilities like close, resize, and focus state.
 *
 * @internal This context is created automatically by Modalyze. Components should
 * use the `useModalyzeModal()` hook instead of consuming this context directly.
 */
type ModalyzeModalContextType = {
    /** Closes this modal */
    close: () => void;

    /** Unique identifier for this modal */
    modalId: string;

    /** Whether this modal is currently focused */
    isFocusedModal: boolean;

    /** Whether this modal is the top of the modal stack*/
    isTopModal: boolean;

    /** Sets a close request handler for this modal */
    setCloseRequestHandler: (handler: ModalCloseHandler | null) => void;

    /** Resizes this modal to the specified dimensions, return the updated size */
    setSize: (width: number, height: number) => { width: number; height: number } | null;

    /** Moves this modal to the specified coordinates, return the updated position */
    setPosition: (x: number, y: number) => { x: number; y: number } | null;
};

export const ModalyzeModalContext = createContext<ModalyzeModalContextType | null>(null);

/**
 * Hook for accessing modal-specific APIs from within a modal component.
 * Provides utilities to control the modal that contains this component.
 *
 * Note: This hook can only be used inside components rendered within a modal.
 * Use `useModalyze()` for managing modals from outside.
 *
 * @returns Modal control API for the current modal
 * @returns close - Closes this modal
 * @returns modalId - Unique identifier for this modal
 * @returns isFocusedModal - Whether this modal is currently focused
 * @returns setCloseRequestHandler - Sets a handler to intercept close requests
 * @returns setSize - Resizes this modal
 * @returns setPosition - Moves this modal
 *
 * @throws Error if used outside a modal component
 */
export const useModalyzeModal = () => {
    const ctx = useContext(ModalyzeModalContext);
    if (!ctx) throw new Error('useModalyzeModal must be used within a Modalyze modal');
    return ctx;
};
