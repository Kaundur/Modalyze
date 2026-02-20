import { useEffect } from 'react';

export function useEscapeKey(onEscape: (event: KeyboardEvent) => void) {
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape' && !event.repeat) {
                event.stopPropagation();
                onEscape(event);
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onEscape]);
}
