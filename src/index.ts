import { Store, createStore } from "redux";
import { calculatePrice } from "./CalculatePrice/calculatePriceUtil";
import {
  AppInfoSliceState
} from "./CalculatePrice/shopReducer";
import { updateSelectedServices } from "./CalculatePrice/updateSelectedServices";
import { appReducer } from "./reducers";

export const createContext = () => {
  const store: Store<
    Partial<{
      appInfo: AppInfoSliceState;
    }>
  > = createStore(appReducer);

  return { calculatePrice: calculatePrice(store), updateSelectedServices: updateSelectedServices(store) };
};
