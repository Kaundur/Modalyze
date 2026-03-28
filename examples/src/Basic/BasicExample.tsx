import { Modalyze, useModalyze } from 'modalyze';
import { BasicModal } from './BasicModal';

export const BasicExample = () => {
  const { createModal } = useModalyze();

  return (
    <Modalyze>
      <button onClick={() => createModal(BasicModal)}>Open Modal</button>
      <button onClick={() => { for (let i = 0; i < 5; i++) createModal(BasicModal); }}>
        Open Modal x5
      </button>
    </Modalyze>
  );
};
