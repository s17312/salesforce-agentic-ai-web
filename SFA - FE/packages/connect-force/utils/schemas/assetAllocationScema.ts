import * as Yup from "yup";
import { MAXIMUM_MSG } from "@/data/commons";

export const assetAllocationValidationSchema = Yup.object().shape({

    allocationType: Yup.number()
        .required("Allocation Type is required")
        .oneOf([2, 3, 4, 5], "Allocation Type must be one of the defined types"),

    companyUId: Yup.number()
        .required("Company is required"),

    distributorUId: Yup.number()
        .nullable()
        .transform((value, originalValue) => (originalValue === "" ? null : value))
        .when("allocationType", {
            is: (type: any) => type === 2 || type === 3,
            then: (schema) =>
                schema
                    .required("Distributor is required for this allocation type")
                    .test(
                        "is-valid-distributor",
                        "Distributor must be greater than 0 if provided",
                        (value) => value > 0
                    ),
            otherwise: (schema) => schema.nullable(),
        }),

    outletUId: Yup.number()
        .nullable()
        .transform((value, originalValue) => (originalValue === "" ? null : value))
        .when("allocationType", {
            is: 3,
            then: (schema) =>
                schema
                    .required("Outlet is required for this allocation type")
                    .test(
                        "is-valid-outlet",
                        "Outlet must be greater than 0 if provided",
                        (value) => value > 0
                    ),
            otherwise: (schema) => schema.nullable(),
        }),

    //   repairUId: Yup.number()
    //     .nullable()
    //     .transform((value, originalValue) => (originalValue === "" ? null : value))
    //     .test(
    //       "is-valid-repair",
    //       "Repair UId must be greater than 0 if provided",
    //       (value) => value === null || value > 0
    //     ),

    //   disposalUId: Yup.number()
    //     .nullable()
    //     .transform((value, originalValue) => (originalValue === "" ? null : value))
    //     .test(
    //       "is-valid-disposal",
    //       "Disposal UId must be greater than 0 if provided",
    //       (value) => value === null || value > 0
    //     ),

    allocationDate: Yup.date()
        .required("Allocation Date is required")
        .typeError("Allocation Date must be a valid date")
        .test(
            "is-valid-date",
            "Allocation Date must be a valid date",
            (value) => value !== undefined && !isNaN(value.getTime())
        ),
    comment: Yup.string()
        .optional()
        .nullable()
        .transform((value) => (value ? value.trim() : value))
        .max(100, MAXIMUM_MSG(100)),
});
