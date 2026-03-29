import { BasicExample } from './BasicExample';
import componentSource from './BasicModal.tsx?raw';
import usageExample from './BasicExample.tsx?raw';
import { CodeBlock } from '../components/CodeBlock';

export const Basic = () => {
  return (
    <div className="example-container">
      <div className="example-header">
        <h1>Basic Usage</h1>
        <p className="example-description">
          The simplest way to create a modal with Modalyze. Click the button below to open a modal.
        </p>
      </div>

      <div className="demo-section">
        <div className="card demo-card">
          <h3>Simple Modal</h3>
          <p>Create a basic modal with minimal setup</p>
          <p>Modals are draggable, resizable, stackable and preserve context.</p>
          <BasicExample />
        </div>

        <div className="card code-example">
          <h4>Code</h4>
          <CodeBlock code={componentSource} />
          <h4>Usage</h4>
          <CodeBlock code={usageExample} />
        </div>
      </div>
    </div>
  );
};
