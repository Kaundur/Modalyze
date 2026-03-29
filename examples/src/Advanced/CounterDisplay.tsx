import { useModalyze } from 'modalyze';
import { CounterModal } from './CounterModal';
import { useCount } from './useCount';

export const CounterDisplay = ({title}: {title: string}) => {
  const { createModal } = useModalyze();
  const { count, increment } = useCount();

  return (
    <div>
      <h3>{title}</h3>
      <div className="checkbox-container">
        <div className="counter-value">Count: {count}</div>
        <div className="flex-row-gap">
          <button onClick={increment} className="btn btn-primary counter-btn">
            Increment
          </button>
          <button onClick={() => createModal(CounterModal, { title, id: title })} className="btn btn-primary counter-btn">
            Open Modal
          </button>
        </div>
      </div>
    </div>
  );
};
