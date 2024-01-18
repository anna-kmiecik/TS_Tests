import { combineReducers } from "redux";
import { shopReducer } from "./CalculatePrice/shopReducer";

export const appReducer = combineReducers({
  appInfo: shopReducer,
});
