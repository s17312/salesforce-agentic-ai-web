import * as Yup from "yup";
import { MAXIMUM_MSG, MINIMUM_MSG } from "@/data/commons";

export const returnReasonValidationSchema = Yup.object().shape({
  reasonId: Yup.string()
    .required("Code  is required")
    .matches(/^[^\s]+$/, "Middle spaces are not allowed")
    .transform((value) => (value ? value.trim() : value))
    .min(3, MINIMUM_MSG(3))
    .max(10, MAXIMUM_MSG(10)),

  name: Yup.string()
    .required("Name is required")
    .transform((value) => (value ? value.trim() : value))
    .min(3, MINIMUM_MSG(3))
    .max(50, MAXIMUM_MSG(50)),

  description: Yup.string()
    .optional()
    .nullable()
    .transform((value) => (value ? value.trim() : value))
    .max(100, MAXIMUM_MSG(100)),
});
