import { MAXIMUM_MSG, MINIMUM_MSG } from "@/data/commons";
import * as Yup from "yup";

export const routeValidationSchema = Yup.object().shape({
  routeId: Yup.string()
    .required("Code is required")
    .transform((value) => (value ? value.trim() : value))
    .test(
      "no-middle-spaces",
      "Middle spaces are not allowed",
      (value) => !/\s/.test(value)
    )
    .min(3, "Must be at least 3 characters long")
    .max(10, "Exceeds max length of 10 characters"),
  routeName: Yup.string()
    .required("Name is required")
    .transform((value) => (value ? value.trim() : value))
    .max(50, MAXIMUM_MSG(50))
    .min(3, MINIMUM_MSG(3)),
  startPoint: Yup.string()
    .required("Start Point is required")
    .transform((value) => (value ? value.trim() : value))
    .max(50, MAXIMUM_MSG(50))
    .min(1, MINIMUM_MSG(1)),

  endPoint: Yup.string()
    .required("End Point is required")
    .transform((value) => (value ? value.trim() : value))
    .max(50, MAXIMUM_MSG(50))
    .min(1, MINIMUM_MSG(1)),

  distance: Yup.string()
    .optional()
    .transform((value) => (value ? value.trim() : value))
    .test(
      "distance format",
      "Distance must be a non-negative value with up to 4 digits before the decimal and exactly 2 digits after the decimal.",
      (value)=> value?/^\d*\.?\d{0,2}$/.test(value):true
    ),

  estimateTime: Yup.string()
    .optional()
    .transform((value) => (value ? value.trim() : value))
    .test(
      "hh:mm format",
      "Time should be numbers and should be hh:mm format",
      (value)=> value?/^\d{2}:\d{2}$/.test(value):true
    ),

  description: Yup.string()
    .optional()
    .nullable()
    .transform((value) => (value ? value.trim() : value))
    .max(100, MAXIMUM_MSG(100)),
});
