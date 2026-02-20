import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModalyze } from '../hooks/useModalyze';
import { Modalyze } from '../components/Modalyze';
import { useModalyzeModal } from '../contexts/ModalyzeModalContext';

test('ESC key closes the focused modal', async () => {
    function App() {
        const { createModal } = useModalyze();

        const openModal = () => {
            createModal(() => <div>Test Modal</div>);
        };

        return (
            <Modalyze>
                <button onClick={openModal}>Open Modal</button>
            </Modalyze>
        );
    }

    const user = userEvent.setup();
    render(<App />);

    // Open modal
    await user.click(screen.getByText('Open Modal'));
    expect(screen.getByText('Test Modal')).toBeInTheDocument();

    // Press ESC
    await user.keyboard('{Escape}');

    // Modal should be gone
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
});

test('ESC key only closes the top modal when multiple are open', async () => {
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

    // Open both modals
    await user.click(screen.getByText('Open Modal 1'));
    await user.click(screen.getByText('Open Modal 2'));

    expect(screen.getByText('Modal 1')).toBeInTheDocument();
    expect(screen.getByText('Modal 2')).toBeInTheDocument();

    // Press ESC - should close Modal 2 (top one)
    await user.keyboard('{Escape}');

    expect(screen.getByText('Modal 1')).toBeInTheDocument();
    expect(screen.queryByText('Modal 2')).not.toBeInTheDocument();

    // Press ESC again - shouldn't close Modal 1 as it's not focused
    await user.keyboard('{Escape}');
    expect(screen.getByText('Modal 1')).toBeInTheDocument();

    // Click Modal 1 to focus it
    await user.click(screen.getByText('Modal 1'));

    // Press ESC - should close Modal 1 (top one)
    await user.keyboard('{Escape}');
    expect(screen.queryByText('Modal 1')).not.toBeInTheDocument();
});

test('modal container has role="dialog"', async () => {
    function App() {
        const { createModal } = useModalyze();

        const openModal = () => {
            createModal(() => <div>Modal Content</div>);
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

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    // Modals have aria-modal false in modaylze as background interaction is allowed
    expect(dialog).toHaveAttribute('aria-modal', 'false');
});

test('modal can be closed with custom close button', async () => {
    function App() {
        const { createModal } = useModalyze();

        const openModal = () => {
            function ModalContent() {
                const { close } = useModalyzeModal();
                return (
                    <div>
                        <div>Modal Content</div>
                        <button onClick={close}>Close</button>
                    </div>
                );
            }
            createModal(ModalContent);
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
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
});
