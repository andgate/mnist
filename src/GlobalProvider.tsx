import { Component, Context, createContext, useContext } from "solid-js";
import { createStore, Store } from "solid-js/store";

type GlobalState = {
  data: ImageData
}

type GlobalCommands = {
  setData: (newData: ImageData) => void
}

const initGlobalState: GlobalState = { data: new ImageData(28, 28) }

export const GlobalStateContext: Context<[GlobalState, GlobalCommands]> =
  createContext([initGlobalState, { setData: (_newData: ImageData) => { } }])

export const GlobalStateProvider: Component = (props) => {
  const [state, setState] = createStore(initGlobalState)
  const store: [Store<GlobalState>, GlobalCommands] = [
    state,
    {
      setData(newData: ImageData) {
        setState('data', newData);
      }
    },
  ]

  return (
    <GlobalStateContext.Provider value={store}>
      {props.children}
    </GlobalStateContext.Provider>
  )
}

export const useGlobal = (): [Store<GlobalState>, GlobalCommands] =>
  useContext(GlobalStateContext)