import { createStore, loggingMiddleware, StoreEnhancer } from "redoodle";
import { applyMiddleware, Store } from "redux";

import { RootReducer } from "./CombineReducers";
import IStoreState from "./IStoreState";
import { EMPTY_STATE } from "./StoreCache";

export default function configureStore(savedState: IStoreState): Store<IStoreState> {
  const logging = applyMiddleware(loggingMiddleware()) as StoreEnhancer;
  const initialState: IStoreState = { ...EMPTY_STATE, ...savedState};

  return createStore(RootReducer, initialState, logging);
}
