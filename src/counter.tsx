import { useSelector, actions, dispatch } from "./store";

export function Counter() {
  const count = useSelector((s) => s.counter.count);

  return (
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
  );
}
