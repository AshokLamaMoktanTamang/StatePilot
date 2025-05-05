import { SliceConfig } from "../../lib/src";

interface UserFormState {
  name: string;
  email: string;
}

export const formSlice: SliceConfig<UserFormState> = {
  name: "userForm",
  initialState: { name: "", email: "" },
  reducers: {
    setName: (state, { payload }: { payload: string }) => ({
      ...state,
      name: payload,
    }),
    setEmail: (state, { payload }: { payload: string }) => ({
      ...state,
      email: payload,
    }),
  },
};
