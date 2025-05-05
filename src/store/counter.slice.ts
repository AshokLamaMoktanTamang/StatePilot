import { SliceConfig } from "../../lib/src";

export const counterSlice: SliceConfig<{ count: number }> = {
  name: "counter",
  initialState: { count: 0 },
  reducers: {
    setValue: (_, { payload }: { payload: number }) => ({ count: payload }),
  },
};
