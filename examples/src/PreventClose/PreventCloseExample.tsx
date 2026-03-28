import { Modalyze, useModalyze } from 'modalyze';
import { PreventCloseModal } from './PreventCloseModal';

export const PreventCloseExample = () => {
  const { createModal } = useModalyze();
  return (
    <Modalyze>
      <button onClick={() => createModal(PreventCloseModal)}>Open Modal</button>
    </Modalyze>
  );
};
