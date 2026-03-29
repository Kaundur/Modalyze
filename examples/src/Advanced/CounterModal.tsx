import { useCount } from './useCount';

export const CounterModal = () => {
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
