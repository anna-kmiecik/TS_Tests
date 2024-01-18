export type ServiceYear = 2020 | 2021 | 2022;

export enum ServiceType1 {
  Photography = "Photography",
  VideoRecording = "VideoRecording",
}

export enum ServiceType2 {
  BlurayPackage = "BlurayPackage",
  TwoDayEvent = "TwoDayEvent",
  WeddingSession = "WeddingSession",
}

const ServiceTypeValues = { ...ServiceType1, ...ServiceType2 };
export type ServiceType =
  | "Photography"
  | "VideoRecording"
  | "WeddingSession"
  | "BlurayPackage"
  | "TwoDayEvent";

export type PriceRecordType1 = {
  [key in ServiceType1]: { [key in ServiceYear]: number };
};

export type PriceRecordType2 = {
  [key in ServiceType2]: { [key in ServiceYear]: number };
};

export const ServicesStep1: PriceRecordType1 = {
  Photography: { 2020: 1700, 2021: 1800, 2022: 1900 },
  VideoRecording: { 2020: 1700, 2021: 1800, 2022: 1900 },
};

export const ServicesStep2: PriceRecordType2 = {
  BlurayPackage: { 2020: 300, 2021: 300, 2022: 300 },
  TwoDayEvent: { 2020: 400, 2021: 400, 2022: 400 },
  WeddingSession: { 2020: 600, 2021: 600, 2022: 600 },
};

export const PackageOfPhotographyAndVideoRecording: {
  [key in ServiceYear]: number;
} = {
  2020: 2200,
  2021: 2300,
  2022: 2500,
};
