import { Counter } from "./counter";
import { UserForm } from "./userForm";

export function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Custom Store Demo</h1>
      <Counter />
      <UserForm />
    </div>
  );
}
