import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { closeAllModals } from './modalStore';

afterEach(() => {
    cleanup();
    closeAllModals();
});
