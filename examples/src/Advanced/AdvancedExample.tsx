import { Modalyze } from 'modalyze';
import { CounterDisplay } from './CounterDisplay';
import { CounterProvider } from './CounterProvider';

export const AdvancedExample = () => (
  <CounterProvider>
    <Modalyze>
      <CounterDisplay title="Outer Counter"/>
      <div>
        <CounterProvider>
          <Modalyze>
            <CounterDisplay title="Inner Counter A"/>
          </Modalyze>
        </CounterProvider>
        <CounterProvider>
          <Modalyze>
            <CounterDisplay title="Inner Counter B" />
          </Modalyze>
        </CounterProvider>
      </div>
    </Modalyze>
  </CounterProvider>
);
