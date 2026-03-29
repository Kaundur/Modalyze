import { ModalCreationOptions, Modalyze, useModalyze } from 'modalyze';
import { useState } from 'react';
import { ModalOptionsModal, ModalOptionsModalProps } from './ModalOptionsModal';
import componentSource from './ModalOptionsModal.tsx?raw';
import usageExample from './ModalOptionsExample.tsx?raw';
import { CodeBlock } from '../components/CodeBlock';

export const ModalOptions = () => {
  const { createModal } = useModalyze();

  const [title, setTitle] = useState<string>('Test Modal');
  const [minSize, setMinSize] = useState<{ width: number; height: number }>({
    width: 300,
    height: 200,
  });
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 500,
    height: 400,
  });
  const [customMessage, setCustomMessage] = useState<string>('Hello from Modalyze!');

  const [closeOnEscape, setCloseOnEscape] = useState(true);
  const [closeOnOutsideClick, setCloseOnOutsideClick] = useState(false);
  const [modalId, setModalId] = useState<string>('');
  const [toggleWhen, setToggleWhen] = useState<'' | 'always' | 'whenTop'>('');
  const [positionMode, setPositionMode] = useState<'default' | 'center' | 'custom'>('default');
  const [positionXY, setPositionXY] = useState<{ x: number; y: number }>({ x: 100, y: 100 });

  const modalConfig: ModalCreationOptions<ModalOptionsModalProps> = {
    title: title,
    minSize: minSize,
    size: size,
    props: { customMessage: customMessage },
    closeOnEscape: closeOnEscape,
    closeOnOutsideClick: closeOnOutsideClick,
    ...(modalId ? { id: modalId, ...(toggleWhen ? { toggleWhen } : {}) } : {}),
    ...(positionMode === 'center'
      ? { position: 'center' as const }
      : positionMode === 'custom'
        ? { position: positionXY }
        : {}),
  } as ModalCreationOptions<ModalOptionsModalProps>;

  return (
    <div className="example-container">
      <div className="example-header">
        <h1>Modal Options</h1>
        <p className="example-description">
          Customize modal behavior with configuration options. Adjust the settings below and create
          a modal to see the changes.
        </p>
      </div>

      <div className="demo-section">
        <div className="card demo-card">
          <h3>Configure Modal</h3>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className="input"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>

          <div className="form-group">
            <label>Custom Message (passed as prop)</label>
            <input
              type="text"
              className="input"
              onChange={(e) => setCustomMessage(e.target.value)}
              value={customMessage}
            />
          </div>

          <div className="form-group">
            <label>Initial Size</label>
            <div className="input-group">
              <input
                type="number"
                className="input input-small"
                placeholder="Width"
                onChange={(e) =>
                  setSize((prev) => ({
                    width: Number(e.target.value),
                    height: prev.height,
                  }))
                }
                value={size.width}
              />
              <span className="input-separator">×</span>
              <input
                type="number"
                className="input input-small"
                placeholder="Height"
                onChange={(e) =>
                  setSize((prev) => ({
                    width: prev.width,
                    height: Number(e.target.value),
                  }))
                }
                value={size.height}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Minimum Size</label>
            <div className="input-group">
              <input
                type="number"
                className="input input-small"
                placeholder="Width"
                onChange={(e) =>
                  setMinSize((prev) => ({
                    width: Number(e.target.value),
                    height: prev.height,
                  }))
                }
                value={minSize.width}
              />
              <span className="input-separator">×</span>
              <input
                type="number"
                className="input input-small"
                placeholder="Height"
                onChange={(e) =>
                  setMinSize((prev) => ({
                    width: prev.width,
                    height: Number(e.target.value),
                  }))
                }
                value={minSize.height}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Initial Position</label>
            <select
              className="input"
              value={positionMode}
              onChange={(e) => setPositionMode(e.target.value as 'default' | 'center' | 'custom')}
            >
              <option value="default">Default (cascade)</option>
              <option value="center">Center</option>
              <option value="custom">Custom (X, Y)</option>
            </select>
            {positionMode === 'custom' && (
              <div className="input-group" style={{ marginTop: '8px' }}>
                <input
                  type="number"
                  className="input input-small"
                  placeholder="X"
                  value={positionXY.x}
                  onChange={(e) =>
                    setPositionXY((prev) => ({
                      x: Number(e.target.value),
                      y: prev.y,
                    }))
                  }
                />
                <span className="input-separator">×</span>
                <input
                  type="number"
                  className="input input-small"
                  placeholder="Y"
                  value={positionXY.y}
                  onChange={(e) =>
                    setPositionXY((prev) => ({
                      x: prev.x,
                      y: Number(e.target.value),
                    }))
                  }
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Modal ID</label>
            <input
              type="text"
              className="input"
              placeholder="Leave empty for a random ID"
              value={modalId}
              onChange={(e) => setModalId(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Toggle Behavior (Modal ID required)</label>
            <select
              className="input"
              value={toggleWhen}
              disabled={!modalId}
              onChange={(e) => setToggleWhen(e.target.value as '' | 'always' | 'whenTop')}
            >
              <option value="">Focus existing (default)</option>
              <option value="always">always - always close</option>
              <option value="whenTop">whenTop - close if on top</option>
            </select>
          </div>

          <div className="form-group">
            <label>Dismiss Behavior</label>
            <div className="checkbox-container">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={closeOnEscape}
                  onChange={() => setCloseOnEscape(!closeOnEscape)}
                />
                <span>Close on Escape</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={closeOnOutsideClick}
                  onChange={() => setCloseOnOutsideClick(!closeOnOutsideClick)}
                />
                <span>Close on Outside Click</span>
              </label>
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg"
            onClick={() => createModal<ModalOptionsModalProps>(ModalOptionsModal, modalConfig)}
          >
            Create Modal
          </button>
        </div>

        <div className="card code-example">
          <h4>Code</h4>
          <CodeBlock code={componentSource} />
          <h4>Usage</h4>
          <CodeBlock code={usageExample} />
        </div>
      </div>

      <Modalyze />
    </div>
  );
};
