import { MAXIMUM_MSG, MINIMUM_MSG } from "@/data/commons";
import * as Yup from "yup";

export const outletClassificationValidationSchema = Yup.object().shape({
  classificationID: Yup.string()
    .required("Code is required")
    .transform((value) => (value ? value.trim() : value))
    .test(
      "no-middle-spaces",
      "Middle spaces are not allowed",
      (value) => !/\s/.test(value)
    )
    .min(3, "Must be at least 3 characters long")
    .max(10, "Exceeds max length of 10 characters"),
  classification: Yup.string()
    .required("Name is required")
    .transform((value) => (value ? value.trim() : value))
    .max(50, MAXIMUM_MSG(50))
    .min(3, MINIMUM_MSG(3)),
  description: Yup.string()
    .optional()
    .nullable()
    .transform((value) => (value ? value.trim() : value))
    .max(100, MAXIMUM_MSG(100)),
});
