import { Store } from "redux";
import { ServiceType, ServiceType1, ServiceType2 } from "./consts";
import {
  AppInfoSliceState,
  deSelectAdditionalServiceType,
  deselectServiceType,
  selectAdditionalServiceType,
  selectAdditionalServiceTypeInit,
  selectServiceType,
  selectedAdditionalServices,
  selectedServices as selectedServicesSelector,
} from "./shopReducer";

type SelectionAction = { type: "Select" | "Deselect"; service: ServiceType };
export const updateSelectedServices =
  (
    store: Store<
      Partial<{
        appInfo: AppInfoSliceState;
      }>
    >
  ) =>
  (previouslySelectedServices: ServiceType[], action: SelectionAction) => {
    updateSelectState(store, previouslySelectedServices, true);
    if (action.type === "Deselect") {
      updateDeSelectState(store, [action.service]);
    }
    if (action.type === "Select") {
      updateSelectState(store, [action.service]);
    }

    const selectedBaseServices: ServiceType1[] = selectedServicesSelector(
      store.getState()
    );
    const selectedExtendedServices: ServiceType2[] = selectedAdditionalServices(
      store.getState()
    );
    return [...selectedBaseServices, ...selectedExtendedServices];
  };

export const updateSelectState = (
  store: Store<
    Partial<{
      appInfo: AppInfoSliceState;
    }>
  >,
  services: ServiceType[],
  isInitializing = false
) => {
  store.dispatch(
    selectServiceType({
      selected: services.filter((service) =>
        Object.values<string>(ServiceType1).includes(service)
      ) as ServiceType1[],
    })
  );

  if (isInitializing) {
    store.dispatch(
      selectAdditionalServiceTypeInit({
        additionalServices: services.filter((service) =>
          Object.values<string>(ServiceType2).includes(service)
        ) as ServiceType2[],
      })
    );
  } else {
    store.dispatch(
      selectAdditionalServiceType({
        additionalServices: services.filter((service) =>
          Object.values<string>(ServiceType2).includes(service)
        ) as ServiceType2[],
      })
    );
  }
};

const updateDeSelectState = (
  store: Store<
    Partial<{
      appInfo: AppInfoSliceState;
    }>
  >,
  services: ServiceType[]
) => {
  store.dispatch(
    deselectServiceType({
      selected: services.filter((service) =>
        Object.values<string>(ServiceType1).includes(service)
      ) as ServiceType1[],
    })
  );

  store.dispatch(
    deSelectAdditionalServiceType({
      additionalServices: services.filter((service) =>
        Object.values<string>(ServiceType2).includes(service)
      ) as ServiceType2[],
    })
  );
};
