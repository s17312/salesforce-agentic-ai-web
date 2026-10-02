import { MAXIMUM_MSG, MINIMUM_MSG } from "@/data/commons";
import * as Yup from "yup";

export const productValidationSchema = Yup.object().shape({
  productID: Yup.string()
    .trim()
    .required("Code is required")
    .matches(/^[^\s]+$/, "Spaces are not allowed")
    .test("min-length", MINIMUM_MSG(3), (value) => {
      if (!value) return false;
      const companyName = value.replace(/\s+/g, " ").trim();
      return companyName.length >= 3;
    })
    .test("max-length", MAXIMUM_MSG(10), (value) => {
      if (!value) return true;
      const companyName = value.replace(/\s+/g, " ").trim();
      return companyName.length <= 10;
    }),
  productName: Yup.string()
    .required("Name is required")
    .transform((value) => (value ? value.trim() : value))
    .test("min-length", MINIMUM_MSG(3), (value) => {
      if (!value) return true; // Allow empty value
      const trimmedName = value.replace(/\s+/g, " ").trim(); // Normalize spaces and trim
      return trimmedName.length >= 3;
    })
    .test("max-length", MAXIMUM_MSG(100), (value) => {
      if (!value) return true; // Allow empty value
      const trimmedName = value.replace(/\s+/g, " ").trim(); // Normalize spaces and trim
      return trimmedName.length <= 100;
    }),
  description: Yup.string()
    .test("max-length", MAXIMUM_MSG(100), (value) => {
      if (!value) return true;
      const name = value.replace(/\s+/g, " ").trim();
      return name.length <= 100;
    })
    .nullable(),
  barcodeID: Yup.string()
    .test("no-spaces", "Spaces are not allowed", (value) => {
      if (!value) return true;
      return !/\s/.test(value);
    })
    .test("max-length", MAXIMUM_MSG(12), (value) => {
      if (!value) return true;
      const name = value.replace(/\s+/g, " ").trim();
      return name.length <= 12;
    })
    .nullable(),
  productGroupUId: Yup.mixed()
    .required("Product Group is required")
    .notOneOf([""], "Product Group  is required"),
  productCategoryUId: Yup.mixed()
    .required("Product Category is required")
    .notOneOf([""], "Product Category is required"),
  uomuId: Yup.mixed()
    .required("UOM is required")
    .notOneOf([""], "UOM is required"),
  minOrderLevel: Yup.string()
    .nullable()
    .matches(
      /^\d{0,5}(\.\d{1,2})?$/,
      "Must be a number with at most 5 digits and up to 2 decimal places"
    )
    .max(8, "Must be at most 8 characters"),

  maxOrderLevel: Yup.string()
    .nullable()
    .matches(
      /^\d{0,5}(\.\d{1,2})?$/,
      "Must be a number with at most 5 digits and up to 2 decimal places"
    )
    .max(8, "Must be at most 8 characters")
    .test(
      "is-greater-than-minOrderLevel",
      "Max order level must be greater than min order level",
      function (value) {
        const { minOrderLevel } = this.parent;
        if (!value || !minOrderLevel) return true; // If either field is empty, skip validation
        return parseFloat(value) > parseFloat(minOrderLevel);
      }
    ),
  qty: Yup.string()
    .required("Qty is required")
    .matches(/^\d{0,10}$/, "Must be a whole number with at most 10 digits")
    .max(10, "Must be at most 5 characters"),
  salesUnitTypeAssignmentUIds: Yup.array()
    .of(Yup.number())
    .min(1, "Sales Unit Type Assignment is required")
    .required("Sales Unit Type Assignment is required"),
  salesUnitTypeAssignmentDefaultUId: Yup.number()
    .nullable()
    .required("Default Sales Unit Type is required"),
});
