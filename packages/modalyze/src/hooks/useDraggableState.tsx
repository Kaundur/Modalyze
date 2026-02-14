import { useRef, useState, useCallback } from 'react';

export function useDraggableState() {
    const ref = useRef(false);
    const [state, setState] = useState(false);

    const setDragging = useCallback((value: boolean) => {
        ref.current = value;
        setState(value);
    }, []);

    return {
        isDragging: state,
        isDraggingRef: ref,
        setDragging,
    };
}
