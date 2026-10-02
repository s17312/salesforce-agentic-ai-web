import * as Yup from "yup";

export const invoiceDetailValidationSchema = Yup.object().shape({
  fromDate: Yup.date().nullable().required("From Date is required"),
  toDate: Yup.date()
    .nullable()
    .required("To Date is required")
    .min(Yup.ref("fromDate"), "To Date cannot be before From Date"),
  tourTypes: Yup.array().min(1, "At least one Tour Type is required"),
  companyUId: Yup.string().required("Company is required"),
  distributorUId: Yup.string().required("Distributor is required"),
  priceListUId: Yup.string().required("Price List is required"),
  productUId: Yup.array()
    .min(1, "At least one Product is required")
    .required("Required"),
});
