import { MAXIMUM_MSG, MINIMUM_MSG } from "@/data/commons";
import * as Yup from "yup";

export const businessCategoryValidationSchema = Yup.object().shape({
  categoryId: Yup.string()
    .required("Code is required")
    .matches(/^[^\s]+$/, "Spaces are not allowed")
    .transform((value) => (value ? value.trim() : value))
    .test("min-length", MINIMUM_MSG(3), (value) => {
      if (!value) return true; // Allow empty value
      const trimmedName = value.replace(/\s+/g, " ").trim(); // Normalize spaces and trim
      return trimmedName.length >= 3;
    })
    .test("max-length", MAXIMUM_MSG(10), (value) => {
      if (!value) return true; // Allow empty value
      const trimmedName = value.replace(/\s+/g, " ").trim(); // Normalize spaces and trim
      return trimmedName.length <= 10;
    }),
  category: Yup.string()
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
