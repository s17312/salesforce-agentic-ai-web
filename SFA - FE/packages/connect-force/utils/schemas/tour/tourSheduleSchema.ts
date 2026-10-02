import * as Yup from "yup";

export const tourScheduleSchema = Yup.object().shape({
  distributorUId: Yup.string().required("Required"),
  representativeUId: Yup.string().required("Required"),
  routeUIds: Yup.array()
    .min(1, "At least one route is required")
    .required("Required"),
  vehicleUId: Yup.string().required("Required"),
  driverName: Yup.string()
    .min(3, "Must be at least 3 characters")
    .max(50, "Must be at most 50 characters")
    .required("Required"),
  porterName: Yup.string().max(50, "Must be at most 50 characters"),
  startMilage: Yup.number()
  .transform((value, originalValue) => (originalValue === "" ? null : value))
  .nullable()
  .required("Required")
  .max(1000000, "Must be at most 1,000,000"),
  targetValue: Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .max(1000000, "Must be at most 1,000,000"),
  targetVolume: Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .max(1000000, "Must be at most 1,000,000"),
});
