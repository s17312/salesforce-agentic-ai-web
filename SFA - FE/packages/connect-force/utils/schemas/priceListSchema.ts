import { MAXIMUM_MSG, MINIMUM_MSG } from "@/data/commons";
import * as Yup from "yup";

export const priceListValidationSchema = Yup.object().shape({
  priceListTypeUId: Yup.number()
    .required("Price List Type UID is required")
    .min(1, MINIMUM_MSG(1)),
  startDate: Yup.string()
    .required("Start Date is required")
    .typeError("Please provide a valid date for the start date"),
  endDate: Yup.string()
    .required("End Date is required")
    .typeError("Please provide a valid date for the end date")
    .test(
      "is-after-start-date",
      "End Date must be after Start Date",
      function (value) {
        const { startDate } = this.parent;
        return !startDate || !value || new Date(value) > new Date(startDate);
      }
    ),
  priceTypeUId: Yup.string().required("Price Type UID is required"),
  companyUId: Yup.number()
    .required("Company UID is required")
    .min(1, MINIMUM_MSG(1)),
  productUId: Yup.number()
    .required("Product UID is required")
    .min(1, MINIMUM_MSG(1)),
  rate: Yup.string()
    .notOneOf([""], "Rate is required")
    .required("Rate is required")
    .max(7, MAXIMUM_MSG(7)),
  mrp: Yup.string()
    .notOneOf([""], "MRP is required")
    .required("MRP is required")
    .max(7, MAXIMUM_MSG(7)),
  batchNumber: Yup.string()
    .required("Batch Number is required")
    .transform((value) => (value ? value.trim() : value))
    .max(50, MAXIMUM_MSG(50)),
});
