import { useSelector, actions, dispatch } from "./store";

export function UserForm() {
  const { name, email } = useSelector((s) => s.userForm);

  return (
    <div>
      <h2>User Form</h2>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) =>
          dispatch.userForm(actions.userForm.setName(e.target.value))
        }
      />
      <br />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) =>
          dispatch.userForm(actions.userForm.setEmail(e.target.value))
        }
        style={{ marginTop: 10 }}
      />
      <br />
      <div style={{ marginTop: 10 }}>
        <strong>Preview:</strong> {name} - {email}
      </div>
    </div>
  );
}
