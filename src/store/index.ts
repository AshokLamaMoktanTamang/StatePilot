import { createAppStore } from "../../lib/src";
import { counterSlice } from "./counter.slice";
import { formSlice } from "./form.slice";

const store = createAppStore({
  counter: counterSlice,
  userForm: formSlice,
});

export const useSelector = store.useSelector;
export const dispatch = {
  counter: store.slices.counter.dispatch,
  userForm: store.slices.userForm.dispatch,
};
export const actions = {
  counter: store.slices.counter.actions,
  userForm: store.slices.userForm.actions,
};
