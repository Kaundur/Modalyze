import { Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import { Basic } from './Basic/Basic';
import { ModalOptions } from './ModalOptions/ModalOptions';
import { Advanced } from './Advanced/Advanced';
import { PreventClose } from './PreventClose/PreventClose';
import { useEffect } from 'react';
import { useModalyze } from 'modalyze';

function App() {
    const location = useLocation();
    const { closeAllModals } = useModalyze();

    useEffect(() => {
        // Close all modals when changing between examples
        closeAllModals();
    }, [location, closeAllModals]);

    return (
        <div className="app-container">
            <header className="app-header">
                <div className="header-content">
                    <div className="brand">
                        <h1>Modalyze</h1>
                        <span className="tagline">Context-Aware Modals for React</span>
                    </div>
                    <nav className="main-nav">
                        <NavLink
                            to="/basic"
                            className={({ isActive }) =>
                                isActive ? 'nav-link active' : 'nav-link'
                            }
                        >
                            Basic Usage
                        </NavLink>
                        <NavLink
                            to="/modalOptions"
                            className={({ isActive }) =>
                                isActive ? 'nav-link active' : 'nav-link'
                            }
                        >
                            Modal Options
                        </NavLink>
                        <NavLink
                            to="/preventClose"
                            className={({ isActive }) =>
                                isActive ? 'nav-link active' : 'nav-link'
                            }
                        >
                            Close Handling
                        </NavLink>
                        <NavLink
                            to="/advanced"
                            className={({ isActive }) =>
                                isActive ? 'nav-link active' : 'nav-link'
                            }
                        >
                            Advanced
                        </NavLink>
                    </nav>
                    <div className="header-actions">
                        <a
                            href="https://github.com/kaundur/modalyze"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="github-link"
                        >
                            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                            </svg>
                            GitHub
                        </a>
                    </div>
                </div>
            </header>

            <main className="main-content">
                <div className="content-wrapper">
                    <Routes>
                        <Route path="/" element={<Navigate to="/basic" replace />} />
                        <Route path="/basic" element={<Basic />} />
                        <Route path="/modalOptions" element={<ModalOptions />} />
                        <Route path="/preventClose" element={<PreventClose />} />
                        <Route path="/advanced" element={<Advanced />} />
                    </Routes>
                </div>
            </main>

            <footer className="app-footer">
                <p>Built with Modalyze • Context preservation made simple</p>
            </footer>
        </div>
    );
}

export default App;
