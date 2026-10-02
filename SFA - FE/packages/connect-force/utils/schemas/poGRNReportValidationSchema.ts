import * as Yup from "yup";

export const poGRNReportValidationSchema = Yup.object().shape({
    fromDate: Yup.date()
        .nullable()
        .required("From Date is required"),
    toDate: Yup.date()
        .nullable()
        .required("To Date is required")
        .min(Yup.ref("fromDate"), "To Date cannot be before From Date"),
    companyUId: Yup.string().required("Company is required"),

    distributorUId: Yup.string().required("Distributor is required"),
});