import {
    PointerEvent as ReactPointerEvent,
    RefObject,
    useCallback,
    useEffect,
    useRef,
} from 'react';
import { useContainerBounds } from '../hooks/useContainerBounds';
import { useModalyzeModal } from '../contexts/ModalyzeModalContext';
import { POSITION_EDGE_BUFFER } from './ModalContextWrapper';

type HorizontalBar = { left: true; right?: never } | { right: true; left?: never };

type VerticalBar = { top: true; bottom?: never } | { bottom: true; top?: never };

type HorizontalBarOnly = HorizontalBar & { top?: never; bottom?: never };
type VerticalBarOnly = VerticalBar & { left?: never; right?: never };
type BothBars = HorizontalBar & VerticalBar;

type ResizerBarProps = {
    containerRef: RefObject<HTMLElement | null>;
} & (HorizontalBarOnly | VerticalBarOnly | BothBars);

const classMap: Record<string, string> = {
    left: 'modalyze-resizer-left',
    right: 'modalyze-resizer-right',
    top: 'modalyze-resizer-top',
    bottom: 'modalyze-resizer-bottom',
    'top-left': 'modalyze-resizer-top-left',
    'top-right': 'modalyze-resizer-top-right',
    'bottom-left': 'modalyze-resizer-bottom-left',
    'bottom-right': 'modalyze-resizer-bottom-right',
};

export const ResizerBar = ({ containerRef, left, right, top, bottom }: ResizerBarProps) => {
    const { setSize, setPosition } = useModalyzeModal();
    const containerBounds = useContainerBounds();
    const draggingRef = useRef(false);

    const onPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        draggingRef.current = true;
        document.body.style.userSelect = 'none';
    }, []);

    const onPointerUp = useCallback(() => {
        draggingRef.current = false;
        document.body.style.userSelect = '';
    }, []);

    const onPointerMove = useCallback(
        (event: PointerEvent) => {
            const element = containerRef.current;
            if (!draggingRef.current || !element) return;

            const { clientX, clientY } = event;

            const rect = element.getBoundingClientRect();

            // Round rect values immediately to avoid fractional accumulation
            const roundedX = Math.round(
                Math.min(
                    Math.max(clientX, containerBounds.left + POSITION_EDGE_BUFFER),
                    containerBounds.right - POSITION_EDGE_BUFFER
                )
            );
            const roundedY = Math.round(
                Math.min(
                    Math.max(clientY, containerBounds.top + POSITION_EDGE_BUFFER),
                    containerBounds.bottom - POSITION_EDGE_BUFFER
                )
            );

            const rectLeft = Math.round(rect.left);
            const rectRight = Math.round(rect.right);
            const rectTop = Math.round(rect.top);
            const rectBottom = Math.round(rect.bottom);

            let updatedWidth = Math.round(rect.width);
            let updatedHeight = Math.round(rect.height);
            let translateX = rectLeft;
            let translateY = rectTop;

            // Horizontal resizing
            if (right) {
                const maxWidth = containerBounds.right - rectLeft;
                updatedWidth = Math.min(roundedX - rectLeft, maxWidth);
            } else if (left) {
                const proposedX = roundedX;
                const containerLeft = containerBounds.left;
                const clampedX = Math.max(proposedX, containerLeft);
                const maxWidth = rectRight - containerLeft;

                updatedWidth = Math.min(rectRight - clampedX, maxWidth);
                translateX = clampedX;
            }

            // Vertical resizing
            if (bottom) {
                const maxHeight = containerBounds.bottom - rectTop;
                updatedHeight = Math.min(roundedY - rectTop, maxHeight);
            } else if (top) {
                const proposedY = roundedY;
                const containerTop = containerBounds.top;
                const clampedY = Math.max(proposedY, containerTop);
                const maxHeight = rectBottom - containerTop;

                updatedHeight = Math.min(rectBottom - clampedY, maxHeight);
                translateY = clampedY;
            }

            const actualSize = setSize(updatedWidth, updatedHeight);
            if (!actualSize) return;

            // Adjust position if size was clamped on left/top edges
            if (left && actualSize.width > updatedWidth) {
                // Hit minimum width, anchor right edge
                translateX = rectRight - actualSize.width;
            }
            if (top && actualSize.height > updatedHeight) {
                // Hit minimum height, anchor bottom edge
                translateY = rectBottom - actualSize.height;
            }

            setPosition(translateX, translateY);
        },
        [containerRef, right, left, bottom, top, setSize, setPosition, containerBounds]
    );
    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;
        const rect = element.getBoundingClientRect();

        const containerWidth = containerBounds.right - containerBounds.left;
        const containerHeight = containerBounds.bottom - containerBounds.top;

        let updatedWidth = rect.width;
        let updatedHeight = rect.height;

        // Note: Don't allow modals to shrink below minimum size
        if (updatedWidth > containerWidth) {
            updatedWidth = containerWidth;
        }
        if (updatedHeight > containerHeight) {
            updatedHeight = containerHeight;
        }

        // Only update if something changed
        if (updatedWidth !== rect.width || updatedHeight !== rect.height) {
            setSize(updatedWidth, updatedHeight);
        }
    }, [containerBounds, containerRef, setSize]);

    useEffect(() => {
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerup', onPointerUp);
        return () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        };
    }, [onPointerMove, onPointerUp]);

    const axis = [top && 'top', bottom && 'bottom', left && 'left', right && 'right']
        .filter(Boolean)
        .join('-');

    const className = classMap[axis];
    return <div className={className} onPointerDown={onPointerDown} />;
};
