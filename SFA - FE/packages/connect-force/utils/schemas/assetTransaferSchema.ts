import { MAXIMUM_MSG, MINIMUM_MSG } from "@/data/commons";
import * as Yup from "yup";

export const assetTransferValidationSchema = Yup.object().shape({
    transactionId: Yup.string()
        .required("Code is required")
        .matches(/^[^\s]+$/, "Middle spaces are not allowed")
        .transform((value) => (value ? value.trim() : value))
        .min(3, MINIMUM_MSG(3))
        .max(20, MAXIMUM_MSG(10)),

    // transactionDate: Yup.date()
    //     .required("Asset Transfer Date is required")
    //     .typeError("Please provide a valid date for the Transfer Date")
    //     .test(
    //         "year-format",
    //         "Please provide a valid date for the Transfer Date",
    //         (value) => {
    //             const year = value?.getFullYear().toString();
    //             return year?.length === 4;
    //         }
    //     )
});