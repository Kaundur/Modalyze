import { RefObject, useEffect } from 'react';

export const useClickOutsideElement = (
    ref: RefObject<HTMLElement | null>,
    clickOutsideCallback: (event: MouseEvent | TouchEvent) => void
) => {
    useEffect(() => {
        function handleOutside(event: MouseEvent | TouchEvent) {
            if (!ref.current) return;
            const target = event.target as Node;
            if (!ref.current.contains(target)) {
                clickOutsideCallback(event);
            }
        }

        document.addEventListener('mousedown', handleOutside);
        document.addEventListener('touchstart', handleOutside);

        return () => {
            document.removeEventListener('mousedown', handleOutside);
            document.removeEventListener('touchstart', handleOutside);
        };
    }, [clickOutsideCallback, ref]);
};
