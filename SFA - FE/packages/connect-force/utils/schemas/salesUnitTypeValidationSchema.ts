import { MAXIMUM_MSG, MINIMUM_MSG } from "@/data/commons";
import * as Yup from "yup";

export const salesUnitTypeValidationSchema = Yup.object().shape({
    unitId: Yup.string()
        .required("Code is required")
        .transform((value) => (value ? value.trim() : value))
        .test(
            "no-middle-spaces",
            "Middle spaces are not allowed",
            (value) => !/\s/.test(value)
        )
        .min(3, "Must be at least 3 characters long")
        .max(10, "Exceeds max length of 10 characters"),

    unitName: Yup.string()
        .required("Name is required")
        .transform((value) => (value ? value.trim() : value))
        .max(50, MAXIMUM_MSG(50))
        .min(1, MINIMUM_MSG(1)),

    description: Yup.string()
        .optional()
        .nullable()
        .transform((value) => (value ? value.trim() : value))
        .max(100, MAXIMUM_MSG(100)),

    baseUnitId: Yup.string()
        .nullable()
        .when("isBaseUnit", (values, schema) => {
            if (values[0] === false) {
                return schema.required("Base Unit is required");
            } else {
                return schema.nullable();
            }
        }),

    ratio: Yup.string()
        .required("Quantity is required")
        .matches(/^[A-Za-z0-9-]+$/, "Special characters are not allowed")
        .matches(/^[^\s]+$/, "Middle spaces are not allowed")
        .transform((value) => (value ? value.trim() : value))
        .min( 1, MINIMUM_MSG(1))
        .max( 10, MAXIMUM_MSG(10)),
});