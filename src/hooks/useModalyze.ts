import { useCallback, useContext, useMemo } from 'react';
import {
    closeModal,
    closeAllModals,
    createModalInContainer,
    setFocusedModal,
    setModalCloseRequestHandler,
    ModalComponent,
    bringModalToFront,
    ModalCreationOptions,
} from '../modalStore';
import { useModalyzeBase } from './useModalyzeBase';
import { ModalyzeContext } from '../contexts/ModalyzeContext';

/**
 * Public hook for managing modals from outside modal components.
 * Provides access to the modal stack state and imperative control methods.
 *
 * @returns Modal management API
 * @returns modalIds - Array of all open modal IDs in stack order (bottom to top)
 * @returns modalCount - Total number of open modals
 * @returns focusedModalId - ID of currently focused modal, or null if none focused
 * @returns frontModalId - ID of topmost modal in z-order, or null if no modals open
 * @returns createModal - Function to create a new modal imperatively
 * @returns closeModal - Function to close a specific modal by ID
 * @returns closeAllModals - Function to close all open modals
 * @returns setModalCloseRequestHandler - Function to set a close request handler for a modal
 * @returns setFocusedModal - Function to programmatically focus a modal
 * @returns bringModalToFront - Function to bring modal to the front of the modal stack
 */
export function useModalyze() {
    const context = useContext(ModalyzeContext);
    const instanceId = context?.instanceId;

    const { modalStack, focusedModalId } = useModalyzeBase();

    /**
     * Creates a modal imperatively while preserving React context and component scope.
     * The modal is rendered in the singleton container to maintain proper z-ordering.
     *
     * @param component - React component to render inside the modal
     * @param options - Modal configuration, with optional custom props P. All options are frozen
     *                  at creation time and won't update if the source object changes
     * @returns String modalId
     */
    const createModal = useCallback(
        <P extends object = Record<string, unknown>>(
            component: ModalComponent<P>,
            options?: ModalCreationOptions<P>
        ): string => {
            return createModalInContainer(component, options, instanceId);
        },
        [instanceId]
    );

    return useMemo(
        () => ({
            modalIds: modalStack.map((m) => m.modalId),
            modalCount: modalStack.length,
            focusedModalId,
            frontModalId: modalStack.at(-1)?.modalId ?? null,
            createModal,
            closeModal,
            closeAllModals,
            setModalCloseRequestHandler,
            setFocusedModal,
            bringModalToFront,
        }),
        [focusedModalId, modalStack, createModal]
    );
}
