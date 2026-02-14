import { ModalCreationOptions, Modalyze, useModalyze } from 'modalyze';
import { useState } from 'react';

type TestModalProps = { customMessage: string };

export const TestModal = ({ customMessage }: TestModalProps) => {
    return (
        <div className="modal-content test-modal-content">
            <div className="custom-message">
                <strong>Custom Message:</strong> {customMessage}
            </div>
        </div>
    );
};

const componentSource = `const TestModal = (props: TestModalProps) => {
    return (
        <div>
            <strong>Custom Message:</strong> {props.customMessage}
        </div>
    );
}`;

const usageExample = `// Configure modal options
const modalConfig: ModalCreationOptions<TestModalProps> = {
    title: "Test Modal",
    minSize: {width: 300, height: 200},
    size: {width: 500, height: 400},
    props: {customMessage: "Hello!"}
    closeOnEscape: true,
    closeOnOutsideClick: false,
}

// Create modal with options
const {createModal} = useModalyze();
createModal<TestModalProps>(TestModal, modalConfig);`;

export const ModalOptions = () => {
    const { createModal } = useModalyze();

    const [title, setTitle] = useState<string>('Test Modal');
    const [minSize, setMinSize] = useState<{ width: number; height: number }>({
        width: 300,
        height: 200,
    });
    const [size, setSize] = useState<{ width: number; height: number }>({
        width: 500,
        height: 400,
    });
    const [customMessage, setCustomMessage] = useState<string>('Hello from Modalyze!');

    const [closeOnEscape, setCloseOnEscape] = useState(true);
    const [closeOnOutsideClick, setCloseOnOutsideClick] = useState(false);

    const modalConfig: ModalCreationOptions<TestModalProps> = {
        title: title,
        minSize: minSize,
        size: size,
        props: { customMessage: customMessage },
        closeOnEscape: closeOnEscape,
        closeOnOutsideClick: closeOnOutsideClick,
    };

    return (
        <div className="example-container">
            <div className="example-header">
                <h1>Modal Options</h1>
                <p className="example-description">
                    Customize modal behavior with configuration options. Adjust the settings below
                    and create a modal to see the changes.
                </p>
            </div>

            <div className="demo-section">
                <div className="card demo-card">
                    <h3>Configure Modal</h3>

                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            className="input"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                        />
                    </div>

                    <div className="form-group">
                        <label>Custom Message (passed as prop)</label>
                        <input
                            type="text"
                            className="input"
                            onChange={(e) => setCustomMessage(e.target.value)}
                            value={customMessage}
                        />
                    </div>

                    <div className="form-group">
                        <label>Initial Size</label>
                        <div className="input-group">
                            <input
                                type="number"
                                className="input input-small"
                                placeholder="Width"
                                onChange={(e) =>
                                    setSize((prev) => ({
                                        width: Number(e.target.value),
                                        height: prev.height,
                                    }))
                                }
                                value={size.width}
                            />
                            <span className="input-separator">×</span>
                            <input
                                type="number"
                                className="input input-small"
                                placeholder="Height"
                                onChange={(e) =>
                                    setSize((prev) => ({
                                        width: prev.width,
                                        height: Number(e.target.value),
                                    }))
                                }
                                value={size.height}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Minimum Size</label>
                        <div className="input-group">
                            <input
                                type="number"
                                className="input input-small"
                                placeholder="Width"
                                onChange={(e) =>
                                    setMinSize((prev) => ({
                                        width: Number(e.target.value),
                                        height: prev.height,
                                    }))
                                }
                                value={minSize.width}
                            />
                            <span className="input-separator">×</span>
                            <input
                                type="number"
                                className="input input-small"
                                placeholder="Height"
                                onChange={(e) =>
                                    setMinSize((prev) => ({
                                        width: prev.width,
                                        height: Number(e.target.value),
                                    }))
                                }
                                value={minSize.height}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Dismiss Behavior</label>
                        <div className="checkbox-container">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={closeOnEscape}
                                    onChange={() => setCloseOnEscape(!closeOnEscape)}
                                />
                                <span>Close on Escape</span>
                            </label>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={closeOnOutsideClick}
                                    onChange={() => setCloseOnOutsideClick(!closeOnOutsideClick)}
                                />
                                <span>Close on Outside Click</span>
                            </label>
                        </div>
                    </div>

                    <button
                        className="btn btn-primary btn-lg"
                        onClick={() => createModal<TestModalProps>(TestModal, modalConfig)}
                    >
                        Create Modal
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
