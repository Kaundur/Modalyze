import { useDraggable } from '../hooks/useDraggable';
import { useModalyze } from '../hooks/useModalyze';
import {
    PointerEvent as ReactPointerEvent,
    PropsWithChildren,
    useCallback,
    useEffect,
} from 'react';
import { mergeClassNames } from '../Utils';
import { Resizer } from './Resizer';
import { useIsModalFocused } from '../hooks/useIsModalFocused';
import { ModalConfig } from '../modalStore';
import { useModalyzeModalInternal } from '../contexts/ModalyzeModalInternalContext';
import { useModalyzeModal } from '../contexts/ModalyzeModalContext';

const DEFAULT_MODAL_SIZE = { width: 500, height: 400 };

export const BaseModal = ({
    children,
    title,
    size = DEFAULT_MODAL_SIZE,
}: PropsWithChildren<ModalConfig>) => {
    const { modalRef, minSize } = useModalyzeModalInternal();
    const { modalId, close } = useModalyzeModal();
    const { setFocusedModal } = useModalyze();

    const { isDragging, onPointerDown } = useDraggable(modalRef);
    const isFocusedModal = useIsModalFocused(modalId);

    const clampedInitialWidth = Math.max(size.width, minSize.width);
    const clampedInitialHeight = Math.max(size.height, minSize.height);

    const onPointerDownHandler = useCallback(
        (event: ReactPointerEvent<HTMLDivElement>, should_drag: boolean) => {
            event.stopPropagation();
            if (!isFocusedModal) {
                event.preventDefault();
            }

            setFocusedModal(modalId);
            if (should_drag) {
                onPointerDown(event);
            }

            modalRef.current?.focus();
        },
        [isFocusedModal, modalId, modalRef, onPointerDown, setFocusedModal]
    );

    useEffect(() => {
        modalRef.current?.focus();
    }, [modalRef]);

    useEffect(() => {
        if (!isFocusedModal) return;

        const element = modalRef.current;
        if (!element) return;

        const handleTab = (e: KeyboardEvent) => {
            // Only trap if modal is focused
            if (e.key !== 'Tab') return;

            const focusableElements = element.querySelectorAll(
                'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );

            const focusableArray = Array.from(focusableElements) as HTMLElement[];

            if (focusableArray.length === 0) {
                e.preventDefault();
                return;
            }

            const firstElement = focusableArray[0];
            const lastElement = focusableArray[focusableArray.length - 1];

            // Shift tab on the first element, go to last
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
            // Tab on last element, go to first
            else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        };

        element.addEventListener('keydown', handleTab);
        return () => element.removeEventListener('keydown', handleTab);
    }, [isFocusedModal, modalRef]);

    return (
        <div
            className={mergeClassNames(
                'modalyze-modal',
                isFocusedModal && 'modalyze-modal-focused'
            )}
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            // aria-modal="false": This is a windowing system, not a blocking modal.
            // There can be multiple windows open, and users can navigate freely between them.
            aria-modal="false"
            aria-labelledby={title != null ? `modal-title-${modalId}` : undefined}
            aria-describedby={`modal-content-${modalId}`}
            onPointerDown={(e) => onPointerDownHandler(e, true)}
            style={{
                width: `${clampedInitialWidth}px`,
                height: `${clampedInitialHeight}px`,
            }}
        >
            <Resizer containerRef={modalRef} />
            <div className={'modalyze-modal-content'}>
                <div
                    className={mergeClassNames(
                        'modalyze-modal-header',
                        isDragging && 'modalyze-modal-header-dragging'
                    )}
                    onPointerDown={(e) => onPointerDownHandler(e, true)}
                >
                    <div
                        className={'modalyze-modal-header-title'}
                        id={title != null ? `modal-title-${modalId}` : undefined}
                    >
                        {title}
                    </div>
                    <button
                        type={'button'}
                        onClick={() => close()}
                        onPointerDown={(e) => e.stopPropagation()}
                        aria-label="Close modal"
                        className={'modalyze-modal-header-close-button'}
                    >
                        ×
                    </button>
                </div>
                <div
                    className={'modalyze-modal-body'}
                    id={`modal-content-${modalId}`}
                    onPointerDown={(e) => onPointerDownHandler(e, false)}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};
