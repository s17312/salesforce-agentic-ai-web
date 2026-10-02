import { MAXIMUM_MSG, MINIMUM_MSG } from "@/data/commons";
import * as Yup from "yup";

export const uomValidationSchema = Yup.object().shape({
  uomId: Yup.string()
    .required("Code is required")
    .transform((value) => (value ? value.trim() : value))
    .test(
      "no-middle-spaces",
      "Middle spaces are not allowed",
      (value) => !/\s/.test(value)
    )
    .min(3, "Must be at least 3 characters long")
    .max(10, "Exceeds max length of 10 characters"),

  shortName: Yup.string()
    .required("Name is required")
    .transform((value) => (value ? value.trim() : value))
    .max(50, MAXIMUM_MSG(50))
    .min(1, MINIMUM_MSG(1)),

  description: Yup.string()
    .optional()
    .nullable()
    .transform((value) => (value ? value.trim() : value))
    .max(100, MAXIMUM_MSG(100)),

  baseUnitUId: Yup.string()
    .nullable()
    .when("isNotBaseUnit", (values, schema) => {
      if (values[0] === true) {
        return schema.required("Base Unit is required");
      } else {
        return schema.nullable();
      }
    }),
  count: Yup.number()
  .nullable()
  .transform((value, originalValue) =>
    originalValue === '' || originalValue === null ? null : Number(originalValue)
  )
  .when('isNotBaseUnit', {
    is: true,
    then: (schema) =>
      schema
        .required("Ratio is required")
        .typeError("Ratio must be a number")
        .min(0.001, "Ratio must be at least 0.001")
        .max(1000000, "Ratio cannot exceed 1,000,000"),
    otherwise: (schema) => schema.nullable(),
  }),

});
