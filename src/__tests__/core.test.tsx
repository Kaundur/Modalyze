import { render, screen } from '@testing-library/react';
import { useState, createContext, useContext } from 'react';
import userEvent from '@testing-library/user-event';
import { Modalyze } from '../components/Modalyze';
import { useModalyze } from '../hooks/useModalyze';

test('modal can call functions from parent scope', async () => {
    function App() {
        const { createModal } = useModalyze();
        const [message, setMessage] = useState('');

        const openModal = () => {
            // Modal captures setMessage function
            function ModalContent() {
                return (
                    <button onClick={() => setMessage('Updated from modal!')}>Update Parent</button>
                );
            }
            createModal(ModalContent);
        };

        return (
            <Modalyze>
                <div>Message: {message}</div>
                <button onClick={openModal}>Open Modal</button>
            </Modalyze>
        );
    }

    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('Open Modal'));
    await user.click(screen.getByText('Update Parent'));

    expect(screen.getByText('Message: Updated from modal!')).toBeInTheDocument();
});

test('modal reads live context updates', async () => {
    const CountContext = createContext(0);

    function App() {
        const [count, setCount] = useState(0);
        const { createModal } = useModalyze();

        const openModal = () => {
            function ModalContent() {
                const contextCount = useContext(CountContext);
                return <div>Count in modal: {contextCount}</div>;
            }
            createModal(ModalContent);
        };

        return (
            <CountContext.Provider value={count}>
                <Modalyze>
                    <div>Count in parent: {count}</div>
                    <button onClick={() => setCount(count + 1)}>Increment</button>
                    <button onClick={openModal}>Open Modal</button>
                </Modalyze>
            </CountContext.Provider>
        );
    }

    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('Open Modal'));
    expect(screen.getByText('Count in modal: 0')).toBeInTheDocument();

    await user.click(screen.getByText('Increment'));
    expect(screen.getByText('Count in parent: 1')).toBeInTheDocument();
    expect(screen.getByText('Count in modal: 1')).toBeInTheDocument();
});

test('createModal returns modal ID and closeModal removes it', async () => {
    function App() {
        const { createModal, closeModal } = useModalyze();
        const [modalId, setModalId] = useState<string | null>(null);

        const openModal = () => {
            const id = createModal(() => <div>Test Modal</div>);
            setModalId(id);
        };

        const closeModalById = () => {
            if (modalId == null) {
                throw new Error('modalId is null');
            }
            closeModal(modalId);
        };

        return (
            <Modalyze>
                <button onClick={openModal}>Open Modal</button>
                {modalId != null && <button onClick={closeModalById}>Close Modal</button>}
            </Modalyze>
        );
    }

    const user = userEvent.setup();
    render(<App />);

    // Open modal
    await user.click(screen.getByText('Open Modal'));
    expect(screen.getByText('Test Modal')).toBeInTheDocument();

    // Close modal by ID
    await user.click(screen.getByText('Close Modal'));
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
});

test('multiple modals can be created simultaneously', async () => {
    function App() {
        const { createModal } = useModalyze();

        const openModal1 = () => {
            createModal(() => <div>Modal 1</div>);
        };

        const openModal2 = () => {
            createModal(() => <div>Modal 2</div>);
        };

        return (
            <Modalyze>
                <button onClick={openModal1}>Open Modal 1</button>
                <button onClick={openModal2}>Open Modal 2</button>
            </Modalyze>
        );
    }

    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('Open Modal 1'));
    expect(screen.getByText('Modal 1')).toBeInTheDocument();

    await user.click(screen.getByText('Open Modal 2'));
    expect(screen.getByText('Modal 1')).toBeInTheDocument();
    expect(screen.getByText('Modal 2')).toBeInTheDocument();
});

test('modal accepts props via second argument', async () => {
    interface ModalProps {
        name: string;
        count: number;
    }

    function App() {
        const { createModal } = useModalyze();

        const openModal = () => {
            const ModalContent = ({ name, count }: ModalProps) => (
                <div>
                    <span>Name: {name}</span>
                    <span>Count: {count}</span>
                </div>
            );

            createModal(ModalContent, { props: { name: 'Test User', count: 42 } });
        };

        return (
            <Modalyze>
                <button onClick={openModal}>Open Modal</button>
            </Modalyze>
        );
    }

    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('Open Modal'));

    expect(screen.getByText('Name: Test User')).toBeInTheDocument();
    expect(screen.getByText('Count: 42')).toBeInTheDocument();
});

test('modal with no props works correctly', async () => {
    function App() {
        const { createModal } = useModalyze();

        const openModal = () => {
            createModal(() => <div>Simple Modal</div>);
        };

        return (
            <Modalyze>
                <button onClick={openModal}>Open Modal</button>
            </Modalyze>
        );
    }

    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('Open Modal'));
    expect(screen.getByText('Simple Modal')).toBeInTheDocument();
});

test('createModal with custom id returns that exact id', async () => {
    let returnedId: string | null = null;

    function App() {
        const { createModal } = useModalyze();

        const openModal = () => {
            returnedId = createModal(() => <div>ID Modal</div>, { id: 'my-custom-id' });
        };

        return (
            <Modalyze>
                <button onClick={openModal}>Open Modal</button>
            </Modalyze>
        );
    }

    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('Open Modal'));
    expect(returnedId).toBe('my-custom-id');
});

test('createModal with duplicate id does not create a second modal', async () => {
    function App() {
        const { createModal, modalCount } = useModalyze();

        const openModal = () => {
            createModal(() => <div>Singleton Modal</div>, { id: 'singleton-id' });
        };

        return (
            <Modalyze>
                <span data-testid="modal-count">{modalCount}</span>
                <button onClick={openModal}>Open Modal</button>
            </Modalyze>
        );
    }

    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('Open Modal'));
    await user.click(screen.getByText('Open Modal'));

    expect(screen.getAllByText('Singleton Modal')).toHaveLength(1);
    expect(screen.getByTestId('modal-count').textContent).toBe('1');
});

test('createModal with duplicate id focuses the existing modal', async () => {
    function App() {
        const { createModal, focusedModalId } = useModalyze();

        const openFirst = () => {
            createModal(() => <div>First Modal</div>, { id: 'focus-test-id' });
        };

        const openSecond = () => {
            createModal(() => <div>Other Modal</div>);
        };

        const refocusFirst = () => {
            createModal(() => <div>First Modal</div>, { id: 'focus-test-id' });
        };

        return (
            <Modalyze>
                <span data-testid="focused">{focusedModalId}</span>
                <button onClick={openFirst}>Open First</button>
                <button onClick={openSecond}>Open Other</button>
                <button onClick={refocusFirst}>Refocus First</button>
            </Modalyze>
        );
    }

    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('Open First'));
    await user.click(screen.getByText('Open Other'));

    // Other modal is now on top / focused
    expect(screen.getByTestId('focused').textContent).not.toBe('focus-test-id');

    // Re-creating with the same id should focus the original
    await user.click(screen.getByText('Refocus First'));
    expect(screen.getByTestId('focused').textContent).toBe('focus-test-id');
});
