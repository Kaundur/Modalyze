import { Modalyze, useModalyze } from 'modalyze';
import { CounterProvider } from './CounterProvider';
import { useCount } from './useCount';

const modalSource = `const CounterModal = () => {
    const {count, increment} = useCount();
    return (
        <div>
            <div>Count: {count}</div>
            <button onClick={increment}>Increment</button>
        </div>
    );
}`;

const displaySource = `const CounterDisplay = ({title, position}: {title: string, position: {x: number, y: number}}) => {
 const {createModal} = useModalyze();
    const {count, increment} = useCount();

    return (
        <div className="">
            <h3>{title}</h3>
            <div className="checkbox-container">
                <div className="counter-value">
                    Count: {count}
                </div>
                <div className="flex-row-gap">
                    <button onClick={increment} className="btn btn-primary">
                        Increment
                    </button>
                    <button
                        onClick={() => createModal(CounterModal, {title, position, id: title})}
                        className="btn btn-primary"
                    >
                        Open Modal
                    </button>
                </div>
            </div>
        </div>
    );
}`;

const providerSource = `type CounterContextType = {
    count: number;
    increment: () => void;
};

const CounterContext = createContext<CounterContextType | null>(null);

const useCount = () => {
    const ctx = useContext(CounterContext);
    if (!ctx) throw new Error('useCounter must be used within CounterProvider');
    return ctx;
};

const CounterProvider = ({ children }: { children: React.ReactNode }) => {
    const [count, setCount] = useState<number>(0);
    const increment = () => setCount(c => c + 1);

    return (
        <CounterContext.Provider value={{ count, increment }}>
            {children}
        </CounterContext.Provider>
    );
};`;

const usageExample = `<CounterProvider>
    <Modalyze>
        <CounterDisplay title="Outer Counter" position={{x: 100, y: 100}}/>
        <div>
            <CounterProvider>
                <Modalyze>
                    <CounterDisplay title="Inner Counter A" position={{x: 130, y: 130}}/>
                </Modalyze>
            </CounterProvider>
            <CounterProvider>
                <Modalyze>
                    <CounterDisplay title="Inner Counter B" position={{x: 160, y: 160}}/>
                </Modalyze>
            </CounterProvider>
    </Modalyze>
</CounterProvider>`;

const CounterModal = () => {
    const { count, increment } = useCount();
    return (
        <div className="modal-content prevent-close-modal-content">
            <h2>Modal Counter</h2>
            <p>This modal is connected to its parent counter's context.</p>

            <div className="checkbox-container">
                <div className="counter-value counter-value-lg">Count: {count}</div>
                <button onClick={increment} className="btn btn-primary">
                    Increment
                </button>
            </div>
        </div>
    );
};

const CounterDisplay = ({
    title,
    position,
}: {
    title: string;
    position: { x: number; y: number };
}) => {
    const { createModal } = useModalyze();
    const { count, increment } = useCount();

    return (
        <div className="">
            <h3>{title}</h3>
            <div className="checkbox-container">
                <div className="counter-value">Count: {count}</div>
                <div className="flex-row-gap">
                    <button onClick={increment} className="btn btn-primary">
                        Increment
                    </button>
                    <button
                        onClick={() => createModal(CounterModal, { title, position, id: title })}
                        className="btn btn-primary"
                    >
                        Open Modal
                    </button>
                </div>
            </div>
        </div>
    );
};

export const Advanced = () => {
    return (
        <div className="example-container">
            <div className="example-header">
                <h1>Context Preservation</h1>
                <p className="example-description">
                    Each counter has isolated React context. Modals capture context at the{' '}
                    <code>&lt;Modalyze&gt;</code> provider level, so modals opened from a counter
                    stay connected to that counter's context.
                </p>
            </div>

            <div className="demo-section">
                <div className="card demo-card flex-col-gap">
                    <CounterProvider>
                        <Modalyze>
                            <CounterDisplay title="Outer Counter" position={{ x: 100, y: 100 }} />
                            <div>
                                <CounterProvider>
                                    <Modalyze>
                                        <CounterDisplay
                                            title="Inner Counter A"
                                            position={{ x: 130, y: 130 }}
                                        />
                                    </Modalyze>
                                </CounterProvider>
                                <CounterProvider>
                                    <Modalyze>
                                        <CounterDisplay
                                            title="Inner Counter B"
                                            position={{ x: 160, y: 160 }}
                                        />
                                    </Modalyze>
                                </CounterProvider>
                            </div>
                        </Modalyze>
                    </CounterProvider>
                </div>

                <div className="card code-example">
                    <h4>Modal Component</h4>
                    <div className="code-block">
                        <pre>
                            <code>{modalSource}</code>
                        </pre>
                    </div>

                    <h4>Counter Display</h4>
                    <div className="code-block">
                        <pre>
                            <code>{displaySource}</code>
                        </pre>
                    </div>

                    <h4>Counter Context</h4>
                    <div className="code-block">
                        <pre>
                            <code>{providerSource}</code>
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
