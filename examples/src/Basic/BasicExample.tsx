import { Modalyze, useModalyze } from 'modalyze';
import { BasicModal } from './BasicModal';

export const BasicExample = () => {
  const { createModal } = useModalyze();

  return (
    <Modalyze>
      <button className={'btn btn-primary'} onClick={() => createModal(BasicModal)}>
        Open Modal
      </button>
      <p/>
      <button
        className={'btn btn-primary'}
        onClick={() => {
          for (let i = 0; i < 5; i++) createModal(BasicModal);
        }}
      >
        Open Modal x5
      </button>
    </Modalyze>
  );
};
