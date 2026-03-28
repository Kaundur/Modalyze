export type ModalOptionsModalProps = { customMessage: string };

export const ModalOptionsModal = ({ customMessage }: ModalOptionsModalProps) => {
  return (
    <div className="modal-content test-modal-content">
      <div className="custom-message">
        <strong>Custom Message:</strong> {customMessage}
      </div>
    </div>
  );
};
