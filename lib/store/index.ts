import { produce } from "immer";
import { useSyncExternalStore } from "react";

type Listener = () => void;
export type ReducerFn<S, P = S> = (state: S, action: { payload: P }) => S;
type ReducersMapObject<S> = Record<string, ReducerFn<S, any>>;

type ActionCreators<
  R extends ReducersMapObject<any>,
  SliceName extends string
> = {
  [K in keyof R]: (payload: Parameters<R[K]>[1]["payload"]) => {
    type: `${SliceName}/${Extract<K, string>}`;
    payload: Parameters<R[K]>[1]["payload"];
  };
};

type ActionFromReducers<
  R extends ReducersMapObject<any>,
  SliceName extends string
> = {
  [K in keyof R]: {
    type: `${SliceName}/${Extract<K, string>}`;
    payload: Parameters<R[K]>[1]["payload"];
  };
}[keyof R];

export interface SliceConfig<
  S,
  R extends ReducersMapObject<S> = ReducersMapObject<S>
> {
  name: string;
  initialState: S;
  reducers: R;
}

interface Slice<S, A, AC extends Record<string, (...args: any[]) => A>> {
  name: string;
  getState: () => S;
  dispatch: (action: A) => void;
  useSelector: <U>(selector: (state: S) => U) => U;
  actions: AC;
}

export interface AppStore<
  Slices extends Record<string, SliceConfig<any, any>>
> {
  getState: () => { [K in keyof Slices]: Slices[K]["initialState"] };
  useSelector: <U>(
    selector: (state: { [K in keyof Slices]: Slices[K]["initialState"] }) => U
  ) => U;
  subscribe: (listener: Listener) => () => void;
  slices: {
    [K in keyof Slices]: Slice<
      Slices[K]["initialState"],
      ActionFromReducers<Slices[K]["reducers"], Slices[K]["name"]>,
      ActionCreators<Slices[K]["reducers"], Slices[K]["name"]>
    >;
  };
}

export function createAppStore<
  Slices extends Record<string, SliceConfig<any, any>>
>(configs: Slices): AppStore<Slices> {
  type State = { [K in keyof Slices]: Slices[K]["initialState"] };

  let state = {} as State;

  const listeners = new Set<Listener>();
  const notify = () => listeners.forEach((l) => l());
  const getState = () => state;

  const setState = (recipe: (draft: State) => void) => {
    state = produce(state, recipe);
    notify();
  };

  const useGlobalSelector = <U>(selector: (s: State) => U): U =>
    useSyncExternalStore(
      (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      () => selector(state)
    );

  const slices = {} as AppStore<Slices>["slices"];

  for (const key in configs) {
    const config = configs[key];
    const { name, initialState, reducers } = config;

    state[key] = initialState;

    type SliceState = typeof initialState;
    type Reducers = typeof reducers;
    type Action = ActionFromReducers<Reducers, typeof name>;
    type Creators = ActionCreators<Reducers, typeof name>;

    const actionMap = {} as Creators;

    for (const type in reducers) {
      const fullType = `${name}/${type}` as const;
      actionMap[type] = ((payload: any) => ({
        type: fullType,
        payload,
      }))
    }

    slices[key] = {
      name,
      getState: () => state[key],
      dispatch: (action: Action) =>
        setState((draft) => {
          const prefix = `${name}/`;
          if (action.type.startsWith(prefix)) {
            const method = action.type.slice(prefix.length) as keyof Reducers;
            const reducer = reducers[method];
            if (reducer) {
              draft[key] = reducer(draft[key], action);
            }
          }
        }),
      useSelector: <U>(selector: (s: SliceState) => U) =>
        useGlobalSelector((s) => selector(s[key])),
      actions: actionMap,
    };
  }

  return {
    getState,
    useSelector: useGlobalSelector,
    subscribe: (listener: Listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    slices,
  };
}
