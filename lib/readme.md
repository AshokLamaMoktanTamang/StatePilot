# StatePilot 🧭

**StatePilot** is a lightweight, type-safe, and boilerplate-free state management library for React, inspired by Redux, but with zero setup and no dependencies. It allows you to create modular state slices with scoped dispatch and selectors, making large-scale app state management clean and intuitive.

---

## ✨ Features

- ⚛️ React-friendly API (with hooks)
- 🔁 Redux-like reducer logic without the overhead
- 🧩 Modular, slice-based state definition
- 🧠 Type-safe actions and dispatch
- 🚀 Fast and production-ready

---

## 📦 Installation

```bash
npm install @ashoklama/statepilot
```

## 🚀 Usage

### 1. Define your store (e.g., `store.js`)

```js
import { createAppStore } from '@ashoklama/statepilot';

const counterSlice = {
  name: 'counter',
  initialState: { count: 0 },
  reducers: {
    setValue: (_, { payload }) => ({ count: payload }),
  },
};

const store = createAppStore({
  counter: counterSlice,
});

export const useSelector = store.useSelector;
export const dispatch = {
  counter: store.slices.counter.dispatch,
};
export const actions = {
  counter: store.slices.counter.actions,
};
```

### 2. In app.jsx

```js
import React from 'react';
import { useSelector, actions, dispatch } from "./store";

export function App(props) {
  const count = useSelector((s) => s.counter.count);

  return (
    <div className='App'>
      <h1>Hello React.</h1>
      <div style={{ marginBottom: 20 }}>
        <h2>Counter</h2>
        <button
          onClick={() => dispatch.counter(actions.counter.setValue(count - 1))}
        >
          -
        </button>
        <span style={{ margin: "0 10px" }}>{count}</span>
        <button
          onClick={() => dispatch.counter(actions.counter.setValue(count + 1))}
        >
          +
        </button>
      </div>
    </div>
  );
}
```