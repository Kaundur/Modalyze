import { Modalyze, useModalyze } from 'modalyze';

const BasicModal = () => {
    return (
        <div className="modal-content basic-modal-content">
            <h2>Welcome to Modalyze</h2>
            <p>This is a simple modal demonstrating the core functionality.</p>
        </div>
    );
};

const componentSource = `const BasicModal = () => {
    return (
        <div className="basic-modal-content">
            <h2>Welcome to Modalyze</h2>
            <p>This is a simple modal demonstrating the core functionality.</p>
        </div>
    );
}`;

const usageExample = `const {createModal} = useModalyze();
createModal(BasicModal);
`;

export const Basic = () => {
    const { createModal } = useModalyze();

    return (
        <div className="example-container">
            <div className="example-header">
                <h1>Basic Usage</h1>
                <p className="example-description">
                    The simplest way to create a modal with Modalyze. Click the button below to open
                    a modal.
                </p>
            </div>

            <div className="demo-section">
                <div className="card demo-card">
                    <h3>Simple Modal</h3>
                    <p>Create a basic modal with minimal setup</p>
                    <p>Try opening multiple modals at once</p>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={() => createModal(BasicModal)}
                    >
                        Open Modal
                    </button>
                </div>

                <div className="card code-example">
                    <h4>Code</h4>
                    <div className="code-block">
                        <pre>
                            <code>{componentSource}</code>
                        </pre>
                    </div>
                    <h4>Usage</h4>
                    <div className="code-block">
                        <pre>
                            <code>{usageExample}</code>
                        </pre>
                    </div>
                </div>
            </div>

            <Modalyze />
        </div>
    );
};
