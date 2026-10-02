import { MAXIMUM_MSG, MINIMUM_MSG } from "@/data/commons";
import * as Yup from "yup";

export const assetValidationSchema = Yup.object().shape({
  assetId: Yup.string()
    .required("Code is required")
    .matches(/^[^\s]+$/, "Middle spaces are not allowed")
    .transform((value) => (value ? value.trim() : value))
    .min(3, MINIMUM_MSG(3))
    .max(20, MAXIMUM_MSG(10)),

  assetName: Yup.string()
    .required("Name is required")
    .transform((value) => (value ? value.trim() : value))
    .min(3, MINIMUM_MSG(3))
    .max(50, MAXIMUM_MSG(50)),

  assetTypeUID: Yup.number()
    .required("Asset Type is required")
    .integer("Must be an integer"),

  assetBrandUId: Yup.number()
    .required("Asset Brand is required")
    .integer("Must be an integer"),

  assetModelUId: Yup.number()
    .required("Asset Model is required")
    .integer("Must be an integer"),

  serialNumber: Yup.string()
    .required("Serial Number is required")
    .min(0, "Serial Number cannot be negative")
    .matches(/^\d{0,10}$/, 'Must be a whole number with at most 10 digits'),

  manufacturer: Yup.string()
    .optional()
    .nullable()
    .transform((value) => (value ? value.trim() : value))
    .max(50, MAXIMUM_MSG(50)),

  purchaseDate: Yup.date()
    .required("Purchase Date is required")
    .typeError("Please provide a valid date for the Purchase Date")
    .test(
      "year-format",
      "Please provide a valid date for the Purchase Date",
      (value) => {
        const year = value?.getFullYear().toString();
        return year?.length === 4;
      }
    ),

  cost: Yup.string()
    .optional()
    .nullable()
    .min(0, "Cost cannot be negative")
    .matches(/^\d{0,10}$/, 'Must be a whole number with at most 10 digits'),

  guaranteeInformation: Yup.string()
    .optional()
    .nullable()
    .transform((value) => (value ? value.trim() : value))
    .max(100, MAXIMUM_MSG(100)),

  maintenanceSchedule: Yup.date()
    .nullable()
    .typeError("Please provide a valid date for the Maintenance Schedule")
    .test(
      "year-format",
      "Please provide a valid date for the Maintenance Schedule",
      (value) => {
        if (value === null) return true;
        const year = value?.getFullYear().toString();
        return year?.length === 4;
      }
    ),

  additionalNotes: Yup.string()
    .optional()
    .nullable()
    .transform((value) => (value ? value.trim() : value))
    .max(100, MAXIMUM_MSG(100)),
});
