import { type ComponentType, createElement, type ReactElement } from 'react';
import { BaseModal } from './components/BaseModal';
import { ModalContextWrapper } from './components/ModalContextWrapper';
import {
    ModalCloseHandler,
    ModalyzeCloseRequestEvent,
} from './contexts/ModalyzeModalInternalContext';

type ModalInstance = {
    modalId: string;
    element: ReactElement;
    closeHandler: ModalCloseHandler | null;
    containerId?: string;
};

let modalStack: ModalInstance[] = [];
const listeners = new Set<() => void>();

let focusedModalId: string | null = null;

export type ModalComponent<P = Record<string, unknown>> = ComponentType<P>;

const notifyListeners = () => {
    listeners.forEach((fn) => fn());
};

/**
 * Shared configuration options for modal behavior.
 * Controls dismissibility, size constraints, and positioning.
 */
export type ModalBehaviorConfig = {
    /** Optional stable ID for this modal. If a modal with this ID is already open, it will be
     *  focused instead of creating a new one. */
    id?: string;

    /** Close modal when escape is pressed and the modal is focused (default: true) */
    closeOnEscape?: boolean;

    /** Close modal when clicking outside the modal (default: false) */
    closeOnOutsideClick?: boolean;

    /** Minimum size constraints for the modal when resizing */
    minSize?: { width: number; height: number };

    /** Initial position of the modal in pixels from top-left of viewport */
    position?: { x: number; y: number };
};

/**
 * Configuration options for creating a modal.
 * Extends behavior config with display options like title and initial size.
 */
export type ModalConfig = ModalBehaviorConfig & {
    /** Title displayed in the modal's title bar */
    title?: string;

    /** Initial size of the modal in pixels. Modal is resizable unless disabled. */
    size?: { width: number; height: number };
};

/**
 * Complete configuration for creating a modal imperatively.
 * Extends ModalConfig with optional custom props to pass to the modal component.
 */
export type ModalCreationOptions<P = Record<string, unknown>> = ModalConfig & {
    props?: P;
};

export function createModalInContainer<P extends object = Record<string, unknown>>(
    component: ModalComponent<P>,
    options?: ModalCreationOptions<P>,
    containerId?: string
): string {
    const { id, title, size, props, ...behaviourConfig } = options ?? {};

    if (id != null) {
        const exists = modalStack.some((m) => m.modalId === id);

        if (exists) {
            setFocusedModal(id);
            return id;
        }
    }

    const modalId = id ?? crypto.randomUUID();

    const safeProps = props ?? ({} as P);

    const container = document.getElementById('modalyze-root');
    if (!container) {
        console.warn(
            'Modalyze: createModal called before <Modalyze> mounted. ' +
                'Ensure <Modalyze> is mounted before creating modals.'
        );
        return '';
    }

    const element = createElement(ModalContextWrapper, {
        modalId,
        ...behaviourConfig,
        children: createElement(BaseModal, { title, size }, createElement(component, safeProps)),
    });

    modalStack = [
        ...modalStack,
        { modalId: modalId, element: element, closeHandler: null, containerId: containerId },
    ];

    focusedModalId = modalId;
    notifyListeners();
    return modalId;
}

export const removeModal = (modalId: string) => {
    modalStack = modalStack.filter((m) => m.modalId !== modalId);

    if (focusedModalId === modalId) {
        focusedModalId = null;
    }

    notifyListeners();
};

export const getModalCloseHandler = (modalId: string) => {
    const modal = modalStack.find((m) => m.modalId === modalId);
    if (!modal) return null;
    return modal.closeHandler;
};

/**
 * Sets a close request handler for a modal. The handler is called whenever the modal
 * is about to close and can prevent closing by returning false.
 *
 * @param modalId - The ID of the modal
 * @param handler - Function called when close is requested. Return false to prevent
 *                  closing, true to allow. Pass null to remove an existing handler.
 *
 */
export function setModalCloseRequestHandler(modalId: string, handler: ModalCloseHandler | null) {
    const modal = modalStack.find((m) => m.modalId === modalId);
    if (modal) {
        modal.closeHandler = handler;
    }
}

/**
 * Closes a modal by ID. If the modal has a close request handler, it will be called
 * first and can prevent closing by returning false.
 *
 * @param modalId - The ID of the modal to close
 */
export const closeModal = (modalId: string) => {
    const modal = modalStack.find((m) => m.modalId === modalId);
    if (!modal) return;

    // Create close event
    const closeEvent: ModalyzeCloseRequestEvent = {
        reason: 'manual',
        source: 'external',
        modalId,
    };

    // Check handler if exists
    if (modal.closeHandler) {
        const shouldClose = modal.closeHandler(closeEvent);
        if (!shouldClose) return;
    }

    removeModal(modalId);
};

/**
 * Attempts to close all modals. Close request handlers are called for each modal
 * and can prevent individual modals from closing by returning false.
 * Removals are batched so listeners are only notified once.
 */
export const closeAllModals = () => {
    const closableIds: string[] = [];

    for (const modal of [...modalStack]) {
        const closeEvent: ModalyzeCloseRequestEvent = {
            reason: 'manual',
            source: 'external',
            modalId: modal.modalId,
        };

        if (modal.closeHandler) {
            const shouldClose = modal.closeHandler(closeEvent);
            if (!shouldClose) continue;
        }

        closableIds.push(modal.modalId);
    }

    if (closableIds.length === 0) return;

    const closableSet = new Set(closableIds);
    modalStack = modalStack.filter((m) => !closableSet.has(m.modalId));

    if (focusedModalId != null && closableSet.has(focusedModalId)) {
        focusedModalId = null;
    }

    notifyListeners();
};

export const bringModalToFront = (modalId: string) => {
    const index = modalStack.findIndex((m) => m.modalId === modalId);
    if (index === -1) return;

    const modal = modalStack[index];
    modalStack = [...modalStack.filter((_, i) => i !== index), modal];
    notifyListeners();
};

/**
 * Focuses a modal and brings it to the front of the stack. Pass no argument
 * or null/undefined to unfocus all modals.
 *
 * @param modalId - The ID of the modal to focus, or omit to unfocus all modals
 */
export const setFocusedModal = (modalId?: string) => {
    if (modalId == null) {
        focusedModalId = null;
    } else {
        bringModalToFront(modalId);
        focusedModalId = modalId;
    }
    notifyListeners();
};

export const getFocusedModalId = () => focusedModalId;

export const subscribeToModals = (callback: () => void) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
};

export const getStackSnapshot = () => modalStack;
export const getFocusSnapshot = () => focusedModalId;
