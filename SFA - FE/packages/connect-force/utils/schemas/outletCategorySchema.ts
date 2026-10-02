import { MAXIMUM_MSG, MINIMUM_MSG } from "@/data/commons";
import * as Yup from "yup";

export const outletCategorySchema = Yup.object().shape({
  outletCategoryId: Yup.string()
    .required("Code is required")
    .transform((value) => (value ? value.trim() : value))
    .test(
      "no-middle-spaces",
      "Middle spaces are not allowed",
      (value) => !/\s/.test(value)
    )
    .test("min-length", MINIMUM_MSG(3), (value) => {
      if (!value) return false;
      const name = value.replace(/\s+/g, " ").trim();
      return name.length >= 3;
    })
    .test("max-length", MAXIMUM_MSG(10), (value) => {
      if (!value) return true;
      const name = value.replace(/\s+/g, " ").trim();
      return name.length <= 10;
    }),
  outletCategoryName: Yup.string()
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
