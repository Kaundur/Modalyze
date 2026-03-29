import { AdvancedExample } from './AdvancedExample';
import modalSource from './CounterModal.tsx?raw';
import displaySource from './CounterDisplay.tsx?raw';
import providerSource from './CounterProvider.tsx?raw';
import usageExample from './AdvancedExample.tsx?raw';
import { CodeBlock } from '../components/CodeBlock';

export const Advanced = () => {
  return (
    <div className="example-container">
      <div className="example-header">
        <h1>Context Preservation</h1>
        <p className="example-description">
          Each counter has isolated React context. Modals capture context at the
          <code>&lt;Modalyze&gt;</code> provider level, so modals opened from a counter stay
          connected to that counter's context.
        </p>
      </div>

      <div className="demo-section">
        <div className="card demo-card flex-col-gap">
          <AdvancedExample />
        </div>

        <div className="card code-example">
          <h4>Modal Component</h4>
          <CodeBlock code={modalSource} />

          <h4>Counter Display</h4>
          <CodeBlock code={displaySource} />

          <h4>Counter Context</h4>
          <CodeBlock code={providerSource} />

          <h4>Usage</h4>
          <CodeBlock code={usageExample} />
        </div>
      </div>
    </div>
  );
};
