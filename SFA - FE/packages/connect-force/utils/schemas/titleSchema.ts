import { MAXIMUM_MSG, MINIMUM_MSG } from "@/data/commons";
import * as Yup from "yup";

export const titleValidationSchema = Yup.object().shape({
  description: Yup.string()
    .required("Description is required")
    .matches(/^[^\s]+$/, "Middle spaces are not allowed")
    .transform((value) => (value ? value.trim() : value))
    .min(2, MINIMUM_MSG(2))
    .max(10, MAXIMUM_MSG(10)),
});
