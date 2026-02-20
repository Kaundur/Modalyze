import { createContext, RefObject, useContext } from 'react';

/**
 * Reasons why a modal close was requested.
 * Used in ModalyzeCloseRequestEvent to help handlers decide whether to allow closing.
 */
export const modalyzeCloseReason = {
    escape: 'escape',
    outside: 'outside',
    manual: 'manual',
} as const;

export type ModalyzeCloseRequestEventReason =
    (typeof modalyzeCloseReason)[keyof typeof modalyzeCloseReason];

/**
 * Event object passed to close request handlers when a modal is about to close.
 * Contains information about what triggered the close request, allowing handlers
 * to make informed decisions about whether to allow or prevent closing.
 *
 * @property reason - Why the close was requested (escape key, click outside, etc.)
 * @property nativeEvent - The browser event that triggered the close, if applicable
 * @property modalId - ID of the modal being closed
 * @property source - Whether close was initiated from inside the modal ('internal')
 *                    or outside ('external', e.g., via closeModal() or click outside)
 */
export interface ModalyzeCloseRequestEvent {
    reason: ModalyzeCloseRequestEventReason;
    nativeEvent?: MouseEvent | TouchEvent | KeyboardEvent;
    modalId: string;
    source: 'internal' | 'external';
}

/**
 * Handler function called when a modal is about to close.
 * Return `false` to prevent the modal from closing, or `true` to allow it.
 *
 * Useful for confirming unsaved changes, validating form state, or implementing
 * custom close logic based on how the close was triggered.
 *
 * @param event - Information about the close request (reason, source, native event)
 * @returns `true` to allow closing, `false` to prevent it
 */
export type ModalCloseHandler = (event: ModalyzeCloseRequestEvent) => boolean;

type ModalyzeModalInternalContextType = {
    containerRef: RefObject<HTMLDivElement | null>;
    modalRef: RefObject<HTMLDivElement | null>;
    minSize: { width: number; height: number };
};

export const ModalyzeModalInternalContext = createContext<ModalyzeModalInternalContextType | null>(
    null
);

export const useModalyzeModalInternal = () => {
    const ctx = useContext(ModalyzeModalInternalContext);
    if (!ctx) {
        throw new Error(
            '[Modalyze Internal Error] useModalyzeModalInternal called outside modal context. ' +
                'This is likely a bug in Modalyze.'
        );
    }
    return ctx;
};
