import {
    ModalyzeCloseRequestEvent,
    modalyzeCloseReason,
    ModalyzeModalInternalContext,
    ModalCloseHandler,
} from '../contexts/ModalyzeModalInternalContext';

import { ModalyzeModalContext } from '../contexts/ModalyzeModalContext';

import { ReactNode, useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useClickOutsideElement } from '../hooks/useClickOutsideElement';
import { useIsModalFocused } from '../hooks/useIsModalFocused';
import { useContainerBounds } from '../hooks/useContainerBounds';
import { ModalBehaviorConfig } from '../modalStore';
import { useModalyzeInternal } from '../hooks/useModalyzeInternal';
import { useModalyze } from '../hooks/useModalyze';

// Prevent bottom/right resizers from causing scrollbars when extending beyond container.
// Top/left overflow into negative space doesn't trigger scrollbars.
// TODO: This should be refactored so a buffer isn't required or extracted into utility or context
export const POSITION_EDGE_BUFFER = 2;

// Internal wrapper props (adds required fields)
interface ModalContextProps extends ModalBehaviorConfig {
    children: ReactNode;
    modalId: string;
}

const DEFAULT_MIN_SIZE = { width: 300, height: 200 };

export const ModalContextWrapper = ({
    children,
    modalId,
    closeOnEscape = true,
    closeOnOutsideClick = false,
    minSize = DEFAULT_MIN_SIZE,
    position,
}: ModalContextProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const hasInitialisedRef = useRef(false);
    const positionRef = useRef({ x: 0, y: 0 });

    const containerBounds = useContainerBounds();
    const { setModalCloseRequestHandler, frontModalId, setFocusedModal } = useModalyze();
    const { removeModal, getModalCloseHandler } = useModalyzeInternal();

    const isFocusedModal = useIsModalFocused(modalId);

    const isTopModal = useMemo(() => modalId === frontModalId, [modalId, frontModalId]);

    const setCloseRequestHandler = useCallback(
        (handler: ModalCloseHandler | null) => {
            setModalCloseRequestHandler(modalId, handler);
        },
        [modalId, setModalCloseRequestHandler]
    );

    const handleCloseRequest = useCallback(
        (closeEvent: ModalyzeCloseRequestEvent) => {
            const closeHandler = getModalCloseHandler(modalId);
            if (closeHandler) {
                if (closeHandler(closeEvent)) {
                    removeModal(modalId);
                }
            } else {
                removeModal(modalId);
            }
        },
        [getModalCloseHandler, modalId, removeModal]
    );

    const escapeCloseCallback = useCallback(
        (event: KeyboardEvent) => {
            if (!closeOnEscape || !isFocusedModal) return;

            const closeEvent: ModalyzeCloseRequestEvent = {
                reason: 'escape',
                nativeEvent: event,
                modalId,
                source: 'internal',
            };
            handleCloseRequest(closeEvent);
        },
        [handleCloseRequest, closeOnEscape, isFocusedModal, modalId]
    );

    useEscapeKey(escapeCloseCallback);

    const clickOutsideCallback = useCallback(
        (event: MouseEvent | TouchEvent) => {
            setFocusedModal();
            if (!closeOnOutsideClick) return;

            const closeEvent: ModalyzeCloseRequestEvent = {
                reason: modalyzeCloseReason.outside,
                nativeEvent: event,
                modalId,
                source: 'internal',
            };

            handleCloseRequest(closeEvent);
        },
        [handleCloseRequest, closeOnOutsideClick, modalId, setFocusedModal]
    );
    useClickOutsideElement(containerRef, clickOutsideCallback);

    const close = useCallback(() => {
        const closeEvent: ModalyzeCloseRequestEvent = {
            reason: 'manual',
            modalId,
            source: 'external',
        };
        handleCloseRequest(closeEvent);
    }, [handleCloseRequest, modalId]);

    const setSize = useCallback(
        (width: number, height: number) => {
            const element = modalRef.current;
            if (!element) return null;

            // Enforce minimum size
            const clampedWidth = Math.max(width, minSize.width);
            const clampedHeight = Math.max(height, minSize.height);

            element.style.width = `${clampedWidth}px`;
            element.style.height = `${clampedHeight}px`;

            return { width: clampedWidth, height: clampedHeight };
        },
        [minSize.height, minSize.width]
    );

    const getPositionLimits = useCallback(() => {
        const minX = containerBounds.left;
        const minY = containerBounds.top;

        const maxX =
            containerBounds.right - (modalRef.current?.offsetWidth ?? 0) - POSITION_EDGE_BUFFER;
        const maxY =
            containerBounds.bottom - (modalRef.current?.offsetHeight ?? 0) - POSITION_EDGE_BUFFER;
        return { minX, minY, maxX, maxY };
    }, [containerBounds]);

    const setPosition = useCallback(
        (x: number, y: number) => {
            const element = modalRef.current;
            if (!element) return null;

            const limits = getPositionLimits();
            const correctedX = Math.max(limits.minX, Math.min(x, limits.maxX));
            const correctedY = Math.max(limits.minY, Math.min(y, limits.maxY));

            positionRef.current = { x: correctedX, y: correctedY };
            element.style.transform = `translate(${correctedX}px, ${correctedY}px)`;

            return { x: correctedX, y: correctedY };
        },
        [getPositionLimits]
    );

    useLayoutEffect(() => {
        // On launch set modal to center of the screen
        if (modalRef.current && !hasInitialisedRef.current) {
            if (position) {
                setPosition(position.x, position.y);
            } else {
                const containerWidth = containerBounds.right - containerBounds.left;
                const containerHeight = containerBounds.bottom - containerBounds.top;
                const x =
                    containerBounds.left + containerWidth / 2 - modalRef.current.offsetWidth / 2;
                const y =
                    containerBounds.top + containerHeight / 2 - modalRef.current.offsetHeight / 2;
                setPosition(x, y);
            }
            hasInitialisedRef.current = true;
        }
    }, [setPosition, containerBounds, modalRef, position]);

    useEffect(() => {
        const { x, y } = positionRef.current;
        setPosition(x, y);
    }, [setPosition, containerBounds]);

    return (
        <ModalyzeModalInternalContext.Provider
            value={{
                containerRef,
                modalRef,
                minSize,
            }}
        >
            <ModalyzeModalContext.Provider
                value={{
                    close,
                    modalId,
                    isFocusedModal,
                    isTopModal,
                    setCloseRequestHandler,
                    setSize,
                    setPosition,
                }}
            >
                <div ref={containerRef}>{children}</div>
            </ModalyzeModalContext.Provider>
        </ModalyzeModalInternalContext.Provider>
    );
};
