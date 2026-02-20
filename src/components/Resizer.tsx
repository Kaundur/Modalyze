import { RefObject } from 'react';
import { ResizerBar } from './ResizerBar';

export const Resizer = ({ containerRef }: { containerRef: RefObject<HTMLElement | null> }) => {
    return (
        <>
            <ResizerBar containerRef={containerRef} left />
            <ResizerBar containerRef={containerRef} right />
            <ResizerBar containerRef={containerRef} top />
            <ResizerBar containerRef={containerRef} bottom />

            <ResizerBar containerRef={containerRef} top left />
            <ResizerBar containerRef={containerRef} top right />
            <ResizerBar containerRef={containerRef} bottom left />
            <ResizerBar containerRef={containerRef} bottom right />
        </>
    );
};
