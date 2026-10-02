import { MAXIMUM_MSG, MINIMUM_MSG } from "@/data/commons";
import * as Yup from "yup";

export const warehouseValidationSchema = Yup.object().shape({
  warehouseID: Yup.string()
    .required("Code is required")
    .transform((value) => (value ? value.trim() : value))
    .matches(/^[^\s]+$/, "Middle spaces are not allowed")
    .min(3, "Must be at least 3 characters long")
    .max(10, "Exceeds max length of 10 characters"),
  name: Yup.string()
    .required("Name is required")
    .transform((value) => (value ? value.trim() : value))
    .max(50, MAXIMUM_MSG(50))
    .min(3, MINIMUM_MSG(3)),
  description: Yup.string()
    .optional()
    .nullable()
    .transform((value) => (value ? value.trim() : value))
    .max(100, MAXIMUM_MSG(100)),
  warehouseTypeUId: Yup.mixed()
    .required("Warehouse Type is required")
    .notOneOf([""], "Warehouse Type is required"),
  warehouseCategoryUId: Yup.mixed()
    .required("Warehouse Category is required")
    .notOneOf([""], "Warehouse Category is required"),
  warehouseAssinmentUId: Yup.mixed()
    .required("Warehouse Assignment is required")
    .notOneOf([""], "Warehouse Assignment is required"),
});
