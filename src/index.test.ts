import { createContext } from ".";
import { ServiceType, ServiceYear } from "./CalculatePrice/consts";

describe("updateSelectedServices.select", () => {
  test("should select when not selected", () => {
    const { updateSelectedServices } = createContext();
    const result = updateSelectedServices([], {
      type: "Select",
      service: "Photography",
    });
    console.log(result);
    expect(result).toEqual(["Photography"]);
  });

  test("should not select the same service twice", () => {
    const { updateSelectedServices } = createContext();
    const result = updateSelectedServices(["Photography"], {
      type: "Select",
      service: "Photography",
    });
    expect(result).toEqual(["Photography"]);
  });

  test("should not select related service when main service is not selected", () => {
    const { updateSelectedServices } = createContext();
    const result = updateSelectedServices(["WeddingSession"], {
      type: "Select",
      service: "BlurayPackage",
    });
    expect(result).toEqual(["WeddingSession"]);
  });

  test("should select related service when main service is selected", () => {
    const { updateSelectedServices } = createContext();
    const result = updateSelectedServices(
      ["WeddingSession", "VideoRecording"],
      {
        type: "Select",
        service: "BlurayPackage",
      }
    );
    expect(result).toEqual([
      "VideoRecording",
      "WeddingSession",
      "BlurayPackage",
    ]);
  });

  test("should select related service when one of main services is selected", () => {
    const { updateSelectedServices } = createContext();
    const result = updateSelectedServices(["WeddingSession", "Photography"], {
      type: "Select",
      service: "TwoDayEvent",
    });
    expect(result).toEqual(["Photography", "WeddingSession", "TwoDayEvent"]);
  });
});

describe("updateSelectedServices.deselect", () => {
    test("should deselect", () => {
        const { updateSelectedServices } = createContext();
        const result = updateSelectedServices(["WeddingSession", "Photography"], {
            type: "Deselect",
            service: "Photography"
        });
        expect(result).toEqual(["WeddingSession"]);
    });

    test("should do nothing when service not selected", () => {
        const { updateSelectedServices } = createContext();
        const result = updateSelectedServices(["WeddingSession", "Photography"], {
            type: "Deselect",
            service: "TwoDayEvent"
        });
        expect(result).toEqual(["Photography", "WeddingSession"]);
    });

    test("should deselect related when last main service deselected", () => {
        const { updateSelectedServices } = createContext();
        const result = updateSelectedServices(["WeddingSession", "Photography", "TwoDayEvent"], {
            type: "Deselect",
            service: "Photography"
        });
        expect(result).toEqual(["WeddingSession"]);
    });

    test("should not deselect related when at least one main service stays selected", () => {
        const { updateSelectedServices } = createContext();
        const result = updateSelectedServices(["WeddingSession", "Photography", "VideoRecording", "TwoDayEvent"], {
            type: "Deselect",
            service: "Photography"
        });
        expect(result).toEqual(["VideoRecording", "WeddingSession", "TwoDayEvent"]);
    });
});

describe.each([2020, 2021, 2022])("calculatePrice.zero (%i)", (year: ServiceYear) => {
    test("should be zero with no services selected", () => {
        const { calculatePrice } = createContext();
        const result = calculatePrice([], year);
        expect(result).toEqual({ basePrice: 0, finalPrice: 0 });
    });
});

describe.each([
    ["WeddingSession", 2020, 600],
    ["WeddingSession", 2021, 600],
    ["WeddingSession", 2022, 600],
    ["Photography", 2020, 1700],
    ["Photography", 2021, 1800],
    ["Photography", 2022, 1900],
    ["VideoRecording", 2020, 1700],
    ["VideoRecording", 2021, 1800],
    ["VideoRecording", 2022, 1900]
])("calculatePrice.singleService (%s, %i)", (service: ServiceType, year: ServiceYear, expectedPrice) => {
    test("no discount applied", () => {
        const { calculatePrice, updateSelectedServices } = createContext();
        const result = calculatePrice([service], year);
        expect(result.basePrice).toBeGreaterThan(0);
        expect(result.finalPrice).toBeGreaterThan(0);
        expect(result.basePrice).toBe(result.finalPrice);
    });

    test("price matches requirements", () => {
        const { calculatePrice, updateSelectedServices } = createContext();
        const result = calculatePrice([service], year);
        expect(result).toEqual({ basePrice: expectedPrice, finalPrice: expectedPrice });
    });
});

describe.each([
    [2020, 300],
    [2021, 300],
    [2022, 0]
])("calcularePrice.photographyWithWeddingSessionPrice (%i increase by %i)", (year: ServiceYear, increase) => {
    test("price matches requirements", () => {
        const { calculatePrice, updateSelectedServices } = createContext();
        const withoutSession = calculatePrice(["Photography"], year);
        const withSession = calculatePrice(["Photography", "WeddingSession"], year);

        const priceChangeWithSession = withSession.finalPrice - withoutSession.finalPrice;

        expect(withSession.basePrice).toBeGreaterThan(0);
        expect(withSession.finalPrice).toBeGreaterThan(0);
        expect(priceChangeWithSession).toEqual(increase);
    });

    test("discount applied", () => {
        const { calculatePrice, updateSelectedServices } = createContext();
        const withoutSession = calculatePrice(["Photography"], year);
        const onlySession = calculatePrice(["WeddingSession"], year);
        const withSession = calculatePrice(["Photography", "WeddingSession"], year);

        const priceWithoutDiscounts = withoutSession.finalPrice + onlySession.finalPrice;

        expect(priceWithoutDiscounts).toBeGreaterThan(withSession.finalPrice);
    });
});

describe.each([
    [2020, 300],
    [2021, 300],
    [2022, 300]
])("calcularePrice.videoRecordingWithWeddingSessionPrice (%i increase by %i)", (year: ServiceYear, increase) => {
    test("price matches requirements", () => {
        const { calculatePrice, updateSelectedServices } = createContext();
        const withoutSession = calculatePrice(["VideoRecording"], year);
        const withSession = calculatePrice(["VideoRecording", "WeddingSession"], year);

        const priceChangeWithSession = withSession.finalPrice - withoutSession.finalPrice;

        expect(priceChangeWithSession).toEqual(increase);
    });

    test("discount applied", () => {
        const { calculatePrice, updateSelectedServices } = createContext();
        const withoutSession = calculatePrice(["VideoRecording"], year);
        const onlySession = calculatePrice(["WeddingSession"], year);
        const withSession = calculatePrice(["VideoRecording", "WeddingSession"], year);

        const priceWithoutDiscounts = withoutSession.finalPrice + onlySession.finalPrice;

        expect(priceWithoutDiscounts).toBeGreaterThan(withSession.finalPrice);
    });
});

describe.each([
    [2020, 500],
    [2021, 500],
    [2022, 600]
])("calcularePrice.videoRecordingWithPhotographyPrice (%i increase by %i)", (year: ServiceYear, increase) => {
    test("price matches requirements", () => {
        const { calculatePrice, updateSelectedServices } = createContext();
        const withoutPhotography = calculatePrice(["VideoRecording"], year);
        const withPhotography = calculatePrice(["VideoRecording", "Photography"], year);

        const priceChangeWithPhotography = withPhotography.finalPrice - withoutPhotography.finalPrice;

        expect(priceChangeWithPhotography).toEqual(increase);
    });

    test("discount applied", () => {
        const { calculatePrice, updateSelectedServices } = createContext();
        const withoutPhotography = calculatePrice(["VideoRecording"], year);
        const onlyPhotography = calculatePrice(["Photography"], year);
        const withPhotography = calculatePrice(["VideoRecording", "Photography"], year);

        const priceWithoutDiscounts = withoutPhotography.finalPrice + onlyPhotography.finalPrice;

        expect(priceWithoutDiscounts).toBeGreaterThan(withPhotography.finalPrice);
    });
});

describe.each([
    [2020, 300],
    [2021, 300],
    [2022, 0]
])(
    "calcularePrice.videoRecordingWithPhotographyWithSessionPrice (%i increase by %i)",
    (year: ServiceYear, increase) => {
        test("price matches requirements", () => {
            //Following test wont work due to that we have to select Photography and VideoRecording first
            //that forces to apply discount from const: PackageOfPhotographyAndVideoRecording
            // export const PackageOfPhotographyAndVideoRecording: { [key in ServiceYear]: number } = {
            //     2020: 2200,
            //     2021: 2300,
            //     2022: 2500,
            //   };
            // Which is higher than WeddingSession discount (300)
            //So only one discount will be applied:
            //
            /// Instruction ----> "Any discounts should never be applied twice - greater discount wins."
            const { calculatePrice, updateSelectedServices } = createContext();
            debugger;
            const withoutSession = calculatePrice(["VideoRecording", "Photography"], year);
            const withSession = calculatePrice(["VideoRecording", "Photography", "WeddingSession"], year);

            const priceChangeWithSession = withSession.finalPrice - withoutSession.finalPrice;

            expect(withSession.basePrice).toBeGreaterThan(0);
            expect(withSession.finalPrice).toBeGreaterThan(0);
            expect(priceChangeWithSession).toEqual(increase);
        });

        test("discount applied", () => {
            const { calculatePrice, updateSelectedServices } = createContext();
            const withoutSession = calculatePrice(["VideoRecording", "Photography"], year);
            const onlySession = calculatePrice(["WeddingSession"], year);
            const withSession = calculatePrice(["VideoRecording", "Photography", "WeddingSession"], year);

            const priceWithoutDiscounts = withoutSession.finalPrice + onlySession.finalPrice;

            expect(priceWithoutDiscounts).toBeGreaterThan(withSession.finalPrice);
        });
    }
);
