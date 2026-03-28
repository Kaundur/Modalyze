import { ModalyzeCloseRequestEvent, useModalyzeModal } from 'modalyze';
import { useEffect, useRef, useState } from 'react';

export const PreventCloseModal = () => {
  const canCloseRef = useRef(false);
  const [failedCloseAttempt, setFailedCloseAttempt] = useState(false);
  const { setCloseRequestHandler } = useModalyzeModal();

  useEffect(() => {
    setCloseRequestHandler((e: ModalyzeCloseRequestEvent) => {
      console.log('Close attempt:', e);
      setFailedCloseAttempt(true);
      return canCloseRef.current;
    });
  }, [setCloseRequestHandler]);

  return (
    <div className="modal-content prevent-close-modal-content">
      <h2>Controlled Close Behavior</h2>
      <p>This modal demonstrates how to control when a modal can be closed.</p>

      <div className="checkbox-container">
        <label className="checkbox-label">
          <input
            type="checkbox"
            defaultChecked={false}
            onChange={(e) => {
              canCloseRef.current = e.currentTarget.checked;
            }}
          />
          <span>Allow modal to close</span>
        </label>
      </div>

      {failedCloseAttempt && (
        <div className="close-attempt-warning">
          Check the box above to allow this modal to close.
        </div>
      )}
    </div>
  );
};
