import { useEffect, useState } from 'react';

const getContainerBounds = () => ({
    left: 0,
    right: window.innerWidth,
    top: 0,
    bottom: window.innerHeight,
});

export const useContainerBounds = () => {
    const [containerBounds, setContainerBounds] = useState(getContainerBounds);

    useEffect(() => {
        const updateBounds = () => setContainerBounds(getContainerBounds());
        window.addEventListener('resize', updateBounds);
        return () => window.removeEventListener('resize', updateBounds);
    }, []);

    return containerBounds;
};
