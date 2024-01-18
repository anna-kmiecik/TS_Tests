import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { ServiceType1, ServiceType2 } from "./consts";

export type AppInfoSliceState = {
  selectedServices: ServiceType1[];
  selectedAdditionalServices: ServiceType2[];
};

const initialState: AppInfoSliceState = {
  selectedServices: [],
  selectedAdditionalServices: [],
};

const shopReducerSlice = createSlice({
  name: "appInfo",
  initialState,
  reducers: {
    selectServiceType(
      state,
      action: PayloadAction<{ selected: ServiceType1[] }>
    ) {
      const temp = new Set<ServiceType1>([
        ...state.selectedServices,
        ...(action.payload.selected ?? ([] as ServiceType1[])),
      ]);
      state.selectedServices = Array.from(temp);
    },
    selectAdditionalServiceType(
      state,
      action: PayloadAction<{ additionalServices: ServiceType2[] }>
    ) {
      if (state.selectedServices?.length > 0) {
        const temp = new Set<ServiceType2>([
          ...state.selectedAdditionalServices,
          ...(action.payload.additionalServices ?? ([] as ServiceType2[])),
        ]);
        state.selectedAdditionalServices = Array.from(temp);
      }
      else if (state.selectedServices?.length === 0) {
        state.selectedAdditionalServices = [...state.selectedAdditionalServices, ...action.payload.additionalServices.filter((service) => service == ServiceType2.WeddingSession)];
      }
    },
    selectAdditionalServiceTypeInit(
      state,
      action: PayloadAction<{ additionalServices: ServiceType2[] }>
    ) {
      const temp = new Set<ServiceType2>([
        ...state.selectedAdditionalServices,
        ...(action.payload.additionalServices ?? ([] as ServiceType2[])),
      ]);
      state.selectedAdditionalServices = Array.from(temp);
    },
    deselectServiceType(state, action: PayloadAction<{ selected: ServiceType1[] }>) {
      state.selectedServices = [...state.selectedServices.filter((service) => !action.payload.selected.includes(service))];
      if(state.selectedServices?.length === 0)
      {
        state.selectedAdditionalServices = [...state.selectedAdditionalServices.filter((service) => service == ServiceType2.WeddingSession)];
      }
    },
    deSelectAdditionalServiceType(
      state,
      action: PayloadAction<{ additionalServices: ServiceType2[] }>
    ) {
      state.selectedAdditionalServices = [...state.selectedAdditionalServices.filter((service) => !action.payload.additionalServices.includes(service))];
    },
  },
});

const selectedServices = (state) => state.appInfo.selectedServices;
const selectedAdditionalServices = (state) =>
  state.appInfo.selectedAdditionalServices;

// Selectors
export { selectedAdditionalServices, selectedServices };

// Actions
export const { deselectServiceType, deSelectAdditionalServiceType, selectAdditionalServiceType, selectAdditionalServiceTypeInit, selectServiceType } =
  shopReducerSlice.actions;

export const shopReducer = shopReducerSlice.reducer;
