import { MAXIMUM_MSG, MINIMUM_MSG } from "@/data/commons";
import * as Yup from "yup";

const currentYear = new Date().getFullYear();

export const vehicleValidationSchema = Yup.object().shape({
  vehicleID: Yup.string()
    .required("Code is required")
    .matches(/^[^\s]+$/, "Middle spaces are not allowed")
    .matches(/^[A-Za-z0-9]+$/, "Special characters are not allowed")
    .transform((value) => (value ? value.trim() : value))
    .min(3, MINIMUM_MSG(3))
    .max(10, MAXIMUM_MSG(10)),
  plateNumber: Yup.string()
    .required("Plate Number is required")
    .matches(/^[A-Za-z0-9-]+$/, "Special characters are not allowed")
    .matches(/^[^\s]+$/, "Middle spaces are not allowed")
    .transform((value) => (value ? value.trim() : value))
    .max(8, MAXIMUM_MSG(8))
    .min(6, MINIMUM_MSG(6)),
  vehicleCategoryUID: Yup.mixed()
    .required("Vehicle Category is required")
    .notOneOf([""], "Vehicle Category is required"),
  yearOfManufacture: Yup.string()
    .required("Year of Manufacture is required")
    .matches(/^\d{4}$/, "Please provide a valid year")
    .test("not-future-year", "Future years are not allowed", (value) => {
      return parseInt(value) <= currentYear;
    }),
  insuranceDetails: Yup.string()
    .optional()
    .nullable()
    .transform((value) => (value ? value.trim() : value))
    .max(255, MAXIMUM_MSG(255)),
  insuranceRegisterDate: Yup.date()
    .required("Insurance Register Date is required")
    .typeError("Please provide a valid date for the insurance register date")
    .test(
      "year-format",
      "Please provide a valid date for the insurance register date",
      (value) => {
        const year = value?.getFullYear().toString();
        return year?.length === 4;
      }
    )
    .test("no-future-dates", "Future dates are not allowed", (value) => {
      if (value) {
        const dateValue = new Date();
        return value.getTime() < dateValue.getTime();
      } else {
        return false;
      }
    }),
  insuranceExpiryDate: Yup.date()
    .required("Insurance Expiry Date is required")
    .typeError("Please provide a valid date for the insurance expiry date")
    .test(
      "year-format",
      "Please provide a valid date for the insurance expiry date",
      (value) => {
        const year = value?.getFullYear().toString();
        return year?.length === 4;
      }
    )
    .test("no-past-dates", "Past dates are not allowed", (value) => {
      if (value) {
        const dateValue = new Date();
        value.setHours(0, 0, 0, 0);
        dateValue.setHours(0, 0, 0, 0);
        return value.getTime() >= dateValue.getTime();
      } else {
        return false;
      }
    }),
    distributorUId: Yup.mixed()
    .required("Distributor is required")
    .notOneOf([""], "Distributor is required"),
    representativeUId: Yup.mixed()
    .nullable()
    .optional()
    .notOneOf([""], "Sales Rep is required if provided"),  
});
