import { MAXIMUM_MSG, MINIMUM_MSG } from "@/data/commons";
import * as Yup from "yup";

export const priceListTypeValidationSchema = Yup.object().shape({
    priceListTypeId: Yup.string()
    .required("Code is required")
    .transform((value) => (value ? value.trim() : value))
    .min(3, MINIMUM_MSG(3))
    .max(10, MAXIMUM_MSG(10)),
    priceListTypeName: Yup.string()
    .required("Name is required")
    .transform((value) => (value ? value.trim() : value))
    .max(50, MAXIMUM_MSG(50))
    .min(3, MINIMUM_MSG(3)),
    priceListTypeDescription: Yup.string()
    .optional()
    .nullable()
    .transform((value) => (value ? value.trim() : value))
    .max(100, MAXIMUM_MSG(100)),
    priceTypeUId: Yup.mixed()
    .required("Price Type is required")
    .notOneOf([""], "Price Type is required"),
});
