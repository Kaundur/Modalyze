import {
    PointerEvent as ReactPointerEvent,
    RefObject,
    useCallback,
    useEffect,
    useRef,
} from 'react';
import { useDraggableState } from './useDraggableState';
import { useModalyzeModal } from '../contexts/ModalyzeModalContext';

export const useDraggable = (ref: RefObject<HTMLElement | null>) => {
    const { isDragging, isDraggingRef, setDragging } = useDraggableState();
    const { setPosition } = useModalyzeModal();

    const clickOffsetRef = useRef({ x: 0, y: 0 });

    const onPointerDown = useCallback(
        (event: ReactPointerEvent<HTMLDivElement>) => {
            event.preventDefault();
            setDragging(true);
            document.body.style.userSelect = 'none';
            event.currentTarget.setPointerCapture(event.pointerId);
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                clickOffsetRef.current = {
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top,
                };
            }
        },
        [ref, setDragging]
    );

    const onPointerUp = useCallback(() => {
        setDragging(false);
        document.body.style.userSelect = '';
    }, [setDragging]);

    const onPointerMove = useCallback(
        (event: PointerEvent) => {
            // Note: Passive listener, dont call preventDefault
            if (!isDraggingRef.current) return;

            setPosition(
                event.clientX - clickOffsetRef.current.x,
                event.clientY - clickOffsetRef.current.y
            );
        },
        [setPosition, isDraggingRef]
    );

    useEffect(() => {
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerup', onPointerUp);
        return () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        };
    }, [onPointerMove, onPointerUp]);

    return {
        isDragging,
        onPointerDown,
    };
};
