import { Modalyze, ModalyzeCloseRequestEvent, useModalyze, useModalyzeModal } from 'modalyze';
import { useEffect, useRef, useState } from 'react';

const PreventCloseModal = () => {
    const canCloseRef = useRef(false);
    const [failedCloseAttempt, setFailedCloseAttempt] = useState(false);
    const { setCloseRequestHandler } = useModalyzeModal();

    useEffect(() => {
        setCloseRequestHandler((e: ModalyzeCloseRequestEvent) => {
            console.log('Close attempt:', e);
            setFailedCloseAttempt(true);
            return canCloseRef.current;
        });
    }, [setCloseRequestHandler]);

    return (
        <div className="modal-content prevent-close-modal-content">
            <h2>Controlled Close Behavior</h2>
            <p>This modal demonstrates how to control when a modal can be closed.</p>

            <div className="checkbox-container">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        defaultChecked={false}
                        onChange={(e) => {
                            canCloseRef.current = e.currentTarget.checked;
                        }}
                    />
                    <span>Allow modal to close</span>
                </label>
            </div>

            {failedCloseAttempt && (
                <div className="close-attempt-warning">
                    Check the box above to allow this modal to close.
                </div>
            )}
        </div>
    );
};

const componentSource = `const PreventCloseModal = () => {
    const canCloseRef = useRef(false);
    const {setCloseRequestHandler} = useModalyzeModal();

    useEffect(() => {
        setCloseRequestHandler((e: ModalyzeCloseRequestEvent) => {
            // Return true to allow close, false to prevent
            return canCloseRef.current;
        });
    }, [setCloseRequestHandler]);

    return (
        <label>
            <input
                type="checkbox"
                onChange={(e) => {
                    canCloseRef.current = e.currentTarget.checked;
                }}
            />
            Allow modal to close
        </label>
    );
}`;

const usageExample = `// The modal registers a close handler that controls
// whether the modal can be closed by ESC or click-outside
const {createModal} = useModalyze();
createModal(PreventCloseModal);`;

export const PreventClose = () => {
    const { createModal } = useModalyze();

    return (
        <div className="example-container">
            <div className="example-header">
                <h1>Close Handling</h1>
                <p className="example-description">
                    Control when modals can be closed using the <code>setCloseRequestHandler</code>{' '}
                    hook. Perfect for preventing accidental data loss or enforcing validation.
                </p>
            </div>

            <div className="demo-section">
                <div className="card demo-card">
                    <h3>Prevent Accidental Close</h3>
                    <p>Open a modal that requires explicit permission to close.</p>
                    <p className="demo-hint">Try closing it before checking the box</p>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={() => createModal(PreventCloseModal)}
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
