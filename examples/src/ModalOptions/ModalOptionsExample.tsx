import { ModalCreationOptions, useModalyze } from 'modalyze';
import { ModalOptionsModal, ModalOptionsModalProps } from './ModalOptionsModal';

const modalConfig: ModalCreationOptions<ModalOptionsModalProps> = {
  title: 'Test Modal',
  minSize: { width: 300, height: 200 },
  size: { width: 500, height: 400 },
  props: { customMessage: 'Hello!' },
  closeOnEscape: true,
  closeOnOutsideClick: false,
  id: 'my-modal',
  toggleWhen: 'whenTop',
  position: 'center',
};

export const ModalOptionsExample = () => {
  const { createModal } = useModalyze();
  return (
    <button onClick={() => createModal<ModalOptionsModalProps>(ModalOptionsModal, modalConfig)}>
      Create Modal
    </button>
  );
};
