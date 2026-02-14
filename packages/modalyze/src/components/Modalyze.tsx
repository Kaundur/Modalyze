import {
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useReducer,
    useRef,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useModalyzeInternal } from '../hooks/useModalyzeInternal';
import { ModalyzeContext } from '../contexts/ModalyzeContext';

/**
 * Returns a function that triggers a re-render without managing state.
 * Useful for synchronization patterns where you need to notify components
 * to re-check conditions (like DOM elements being ready).
 */
function useForceUpdate() {
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    return forceUpdate;
}

let hasRootInstance = false;

export const Modalyze = ({ children }: { children?: ReactNode }) => {
    const parent = useContext(ModalyzeContext);
    const hasParent = parent !== null;
    useEffect(() => {
        if (!hasParent) {
            if (hasRootInstance) {
                console.warn(
                    'Multiple root <Modalyze> components detected. ' +
                        'Only mount one <Modalyze> at your app root.'
                );
            }
            hasRootInstance = true;

            return () => {
                hasRootInstance = false;
            };
        }
    }, [hasParent]);

    const isRoot = parent === null;
    const instanceId = useMemo(() => crypto.randomUUID(), []);

    const { modalStack } = useModalyzeInternal();
    const [container, setContainer] = useState<HTMLElement | null>(null);
    const modalContainerRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    const forceUpdate = useForceUpdate();

    useEffect(() => {
        if (!isRoot) return;

        const div = document.createElement('div');
        div.id = 'modalyze-root';
        document.body.appendChild(div);
        setContainer(div);

        return () => {
            document.body.removeChild(div);
        };
    }, [isRoot]);

    /**
     * Synchronization pattern:
     * This useLayoutEffect triggers a re-render of the Modalyze component
     * (not modal contents or children) after containers are mounted in DOM.
     *
     * This allows nested instances to successfully find and portal to their containers.
     */
    useLayoutEffect(() => {
        if (!isRoot) return;
        forceUpdate();
    }, [isRoot, modalStack.length, forceUpdate]);

    const rootContainer = isRoot ? container : parent.rootContainer;

    const levelModals = modalStack.filter(
        (m) => (isRoot && m.containerId == null) || m.containerId === instanceId
    );

    const getModalContainer = useCallback((modalId: string) => {
        return modalContainerRefs.current.get(modalId) ?? null;
    }, []);

    if (rootContainer == null) return null;

    const parentGetContainer = parent?.getModalContainer ?? getModalContainer;

    if (isRoot) {
        return (
            <ModalyzeContext.Provider
                value={{ instanceId, parent, rootContainer, getModalContainer }}
            >
                {createPortal(
                    <>
                        {modalStack.map((m) => (
                            <div
                                key={m.modalId}
                                ref={(el) => {
                                    if (el) {
                                        modalContainerRefs.current.set(m.modalId, el);
                                    } else {
                                        modalContainerRefs.current.delete(m.modalId);
                                    }
                                }}
                                data-modal-id={m.modalId}
                            />
                        ))}
                    </>,
                    rootContainer
                )}
                {levelModals.map((m) => {
                    const targetContainer = parentGetContainer(m.modalId);
                    return targetContainer && createPortal(m.element, targetContainer, m.modalId);
                })}
                {children}
            </ModalyzeContext.Provider>
        );
    }

    return (
        <ModalyzeContext.Provider
            value={{ instanceId, parent, rootContainer, getModalContainer: parentGetContainer }}
        >
            {levelModals.map((m) => {
                const targetContainer = parentGetContainer(m.modalId);
                return targetContainer && createPortal(m.element, targetContainer, m.modalId);
            })}
            {children}
        </ModalyzeContext.Provider>
    );
};
