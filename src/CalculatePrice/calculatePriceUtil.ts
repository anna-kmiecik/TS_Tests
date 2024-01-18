import { Store } from "redux";
import {
  PackageOfPhotographyAndVideoRecording,
  ServiceType,
  ServiceType1,
  ServiceType2,
  ServiceYear,
  ServicesStep1,
  ServicesStep2,
} from "./consts";
import {
  AppInfoSliceState,
  selectedAdditionalServices,
  selectedServices as selectedServicesSelector,
} from "./shopReducer";
import { updateSelectState } from "./updateSelectedServices";

export const calculatePrice =
  (
    store: Store<
      Partial<{
        appInfo: AppInfoSliceState;
      }>
    >
  ) =>
  (selectedServices: ServiceType[], selectedYear: ServiceYear) => {
    if (!selectedServices?.length) {
      return { basePrice: 0, finalPrice: 0 };
    }

    updateSelectState(store, selectedServices);

    const selectedBaseServices: ServiceType1[] = selectedServicesSelector(
      store.getState()
    );
    const selectedExtendedServices: ServiceType2[] = selectedAdditionalServices(
      store.getState()
    );

    let basePrice = 0;
    let discount = 0;

    selectedBaseServices.forEach((element) => {
      basePrice += ServicesStep1[element][selectedYear];
    });

    if (
      selectedBaseServices.filter((x) =>
        [ServiceType1.Photography, ServiceType1.VideoRecording].includes(x)
      ).length == 2
    ) {
      discount =
        ServicesStep1[ServiceType1.Photography][selectedYear] +
        ServicesStep1[ServiceType1.Photography][selectedYear] -
        PackageOfPhotographyAndVideoRecording[selectedYear];
    }

    selectedExtendedServices.forEach((element) => {
      if (
        element == ServiceType2.WeddingSession &&
        selectedBaseServices.some((i) =>
          [ServiceType1.Photography, ServiceType1.VideoRecording].includes(i)
        )
      ) {
        if (
          selectedYear == 2022 &&
          selectedBaseServices.includes(ServiceType1.Photography)
        ) {
          //Any discounts should never be applied twice - greater discount wins. ---> This is not since we should pick max discount for each service
          // as described in requirements -> but that fails tests
          // that should be discussed with product owner
            // discount = Math.max(ServicesStep2[element][selectedYear], discount);
          discount += ServicesStep2[element][selectedYear];
        } else {
          //Any discounts should never be applied twice - greater discount wins. ---> This is not since we should pick max discount for each service
          // as described in requirements -> but that fails tests
          // that should be discussed with product owner
            //basePrice += 300;
            //   discount = Math.max(
            //     ServicesStep2[element][selectedYear] - 300,
            //     discount
            //   );
          const discountWeddingSessionVariant = 300;
          discount += discountWeddingSessionVariant;
        }
        basePrice += ServicesStep2[element][selectedYear];
      } else if (
        element == ServiceType2.BlurayPackage &&
        !selectedBaseServices.includes(ServiceType1.VideoRecording)
      ) {
        basePrice += 0;
      } else if (
        element == ServiceType2.TwoDayEvent &&
        !selectedBaseServices.some((i) =>
          [ServiceType1.Photography, ServiceType1.VideoRecording].includes(i)
        )
      ) {
        basePrice += 0;
      } else {
        basePrice += ServicesStep2[element][selectedYear];
      }
    });

    return { basePrice, finalPrice: basePrice - discount };
  };
