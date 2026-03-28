import { PreventCloseExample } from './PreventCloseExample';
import componentSource from './PreventCloseModal.tsx?raw';
import usageExample from './PreventCloseExample.tsx?raw';

export const PreventClose = () => {
  return (
    <div className="example-container">
      <div className="example-header">
        <h1>Close Handling</h1>
        <p className="example-description">
          Control when modals can be closed using the <code>setCloseRequestHandler</code> hook.
          Perfect for preventing accidental data loss or enforcing validation.
        </p>
      </div>

      <div className="demo-section">
        <div className="card demo-card">
          <h3>Prevent Accidental Close</h3>
          <p>Open a modal that requires explicit permission to close.</p>
          <p className="demo-hint">Try closing it before checking the box</p>
          <PreventCloseExample />
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
    </div>
  );
};
