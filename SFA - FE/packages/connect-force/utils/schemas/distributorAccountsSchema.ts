import { MAXIMUM_MSG, MINIMUM_MSG } from "@/data/commons";
import * as Yup from "yup";

export const distributorAccountsValidationSchema = Yup.object().shape({
  accountId: Yup.string()
    .required("Code is required")
    .matches(/^[^\s]+$/, "Middle spaces are not allowed")
    .transform((value) => (value ? value.trim() : value))
    .min(3, MINIMUM_MSG(3))
    .max(10, MAXIMUM_MSG(10)),
  accountName: Yup.string()
    .required("Name is required")
    .transform((value) => (value ? value.trim() : value))
    .max(50, MAXIMUM_MSG(50))
    .min(3, MINIMUM_MSG(3)),
accountNumber: Yup.string()
  .required("Account No is required")
  .matches(/^[0-9]*$/, "Only numbers are allowed")
  .min(8, MINIMUM_MSG(8))
  .max(17, MAXIMUM_MSG(17)),
  description: Yup.string()
    .optional()
    .nullable()
    .transform((value) => (value ? value.trim() : value))
    .max(100, MAXIMUM_MSG(100)),
});
