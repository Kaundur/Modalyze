# Modalyze

**Context-aware modals for React**

A React library for creating draggable, resizable, stackable modals that preserve React context. Create modals programmatically without losing access to your context providers.

## Features

- **Context Preservation** - Modals maintain access to React context
- **Programmatic API** - Create modals by calling `createModal()`
- **Multiple Modals** - Open and manage many modals at once
- **Draggable & Resizable** - Move and resize modals freely
- **Zero Config** - Drop in and use immediately

## Installation

```bash
npm install modalyze
# or
yarn add modalyze
# or
pnpm add modalyze
```

## Quick Start

**1. Add the `<Modalyze>` provider to your app**

Place it below any context providers you want modals to access:

```tsx
import { Modalyze } from 'modalyze';

function App() {
    return (
        <OtherProvider>
            <Modalyze>
                <BasicExample /> {/* Modals created here access OtherProvider */}
            </Modalyze>
        </OtherProvider>
    );
}
```

**2. Create modals from any component**

Use the `useModalyze()` hook to create modals:

```tsx
import { useModalyze } from 'modalyze';

const BasicModal = () => {
    return <div>Basic Modal</div>;
};

const BasicExample = () => {
    const { createModal } = useModalyze();
    return <button onClick={() => createModal(BasicModal)}>Open Modal</button>;
};
```

That's it! Modals will have access to any context providers above the `<Modalyze>` component.

## Usage Guide

### Creating and Closing Modals

#### How do I create a modal?

Call the `createModal()` function from the `useModalyze()` hook, `const {createModal} = useModalyze()`. The `<Modalyze>` component must also be included somewhere in your app

#### How do I close a modal?

Modals can be closed via ESC key, clicking outside, or both. Default is ESC only.

```ts
createModal(BasicModal, { closeOnEscape: true, closeOnOutsideClick: false });
```

From within a modal

```ts
const { close } = useModalyzeModal();
```

From outside a modal with the modal ID

```ts
const { closeModal } = useModalyze();
closeModal(modalId);
```

Or close all modals

```ts
const { closeAllModals } = useModalyze();
closeAllModals();
```

### Working with Context

#### How do I access context within a modal?

Just use hooks normally, context is preserved. The modal accesses context from the nearest parent `<Modalyze/>` provider from where `createModal()` is called

#### How do I share state between the page and modal?

Put the state within a context, access it from both places

#### Why aren't my props updating in the modal?

Props passed via `createModal()` are captured at creation time and won't update. For live data that changes over time, use React context instead. Context values will update reactively in your modal.

### Advanced Scenarios

#### How do I close a specific modal programmatically?

Save the ID: `const id = createModal(...)` then `closeModal(id)`

#### How do I handle multiple context providers?

Place a `<Modalyze>` within each provider level, context is preserved at the nearest parent `<Modalyze>` from which createModal is called

```tsx
return (
    <div>
        <OuterProvider>
            <Modalyze>
                <MainContainer />
                <InnerProvider>
                    <Modalyze>
                        <InnerContainer />
                    </Modalyze>
                </InnerProvider>
                <InnerProvider>
                    <Modalyze>
                        <InnerContainer />
                    </Modalyze>
                </InnerProvider>
            </Modalyze>
        </OuterProvider>
    </div>
);
```

#### How does context capture work?

1. `createModal()` creates the modal element at the nearest `<Modalyze>` parent, capturing context at that level
2. The modal is portaled up to the root `<Modalyze>` component
3. The root renders all modals in a shared stack, enabling proper ordering while preserving each modal's captured context

#### Can I have multiple `<Modalyze>` roots?

Yes, but **not recommended**. Multiple root `<Modalyze>` components create separate modal stacks that can't be ordered relative to each other, one stack will always render above the other.

**Recommended:** Use a single root `<Modalyze>` component, with nested `<Modalyze>` providers only for capturing different context levels.

#### How can I prevent a modal from closing?

Use the `closeOnEscape` and `closeOnOutsideClick` options to prevent dismissing.

If you need to intercept the close request use the `setCloseRequestHandler` or `setModalCloseRequestHandler` depending
on if you're setting it from inside or outside the modal.

## API Reference

### Modalyze Component `<Modalyze>`

The main component. Must be included once to create modals, can be repeated to capture different context levels, but should only be one root `<Modalyze>`

### Modalyze Hook `useModalyze()`

Functions

- `createModal<P>(component: ModalComponent<P>, options?: ModalCreationOptions<P>): string` - Creates a modal imperatively while preserving React context. Returns the modal ID.
- `closeModal(modalId: string): void` - Closes a specific modal by ID
- `closeAllModals(): void` - Closes all open modals
- `setModalCloseRequestHandler(modalId: string, handler: ModalCloseHandler | null): void` - Sets a handler to intercept close requests. Return `false` to prevent closure. Pass `null` to remove the handler.
- `setFocusedModal(modalId?: string): void` - Focuses the specified modal, or clears focus if no ID provided
- `bringModalToFront(modalId: string): void` - Brings the specified modal to the top of the stack

Observable State

- `modalIds: string[]` - Array of all modal IDs in stack order (bottom to top)
- `modalCount: number` - Total number of open modals
- `focusedModalId: string | null` - ID of the currently focused modal
- `frontModalId: string | null` - ID of the topmost modal in the stack

### ModalyzeModal hook `useModalyzeModal()`

Functions

- `close()` - Close this modal
- `setCloseRequestHandler(handler: ModalCloseHandler | null): void` - Sets a handler to intercept close requests. Return `false` to prevent closure. Pass `null` to remove handler.
- `setSize(width: number, height: number): {width: number, height: number} | null` - Set the size of the current modal, returns the updated size
- `setPosition(x: number, y: number): {x: number, y: number} | null` - Set the position of the current modal, returns the updated position

Observable State

- `modalId: string` - ID for this modal
- `isFocusedModal: boolean` - Whether this modal is currently focused
- `isTopModal: boolean` - Whether this modal is at the top of the stack

## Types

### Modal Configuration

**`ModalBehaviorConfig`**

```ts
export type ModalBehaviorConfig = {
    closeOnEscape?: boolean;
    closeOnOutsideClick?: boolean;
    minSize?: { width: number; height: number };
    position?: { x: number; y: number };
};
```

**`ModalConfig`**

```ts
export type ModalConfig = ModalBehaviorConfig & {
    title?: string;
    size?: { width: number; height: number };
};
```

**`ModalCreationOptions<P>`**

```ts
export type ModalCreationOptions<P = Record<string, unknown>> = ModalConfig & {
    props?: P;
};
```

### Close Request Handling

**`ModalyzeCloseRequestEvent`**

```ts
export interface ModalyzeCloseRequestEvent {
    reason: 'escape' | 'outside' | 'manual';
    nativeEvent?: MouseEvent | TouchEvent | KeyboardEvent;
    modalId: string;
    source: 'internal' | 'external';
}
```

**`ModalCloseHandler`**

```ts
export type ModalCloseHandler = (event: ModalyzeCloseRequestEvent) => boolean;
```

**Usage:**

```ts
// From outside modal
const { setModalCloseRequestHandler } = useModalyze();
setModalCloseRequestHandler(modalId, (event) => {
    if (hasUnsavedChanges) {
        return confirm('Discard changes?');
    }
    return true;
});

// From inside modal
const { setCloseRequestHandler } = useModalyzeModal();
setCloseRequestHandler((event) => {
    if (hasUnsavedChanges) {
        return confirm('Discard changes?');
    }
    return true;
});
```

## License

MIT License

Copyright (c) 2026 Kaundur

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
