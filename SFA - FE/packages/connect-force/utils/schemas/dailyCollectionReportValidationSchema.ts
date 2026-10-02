import * as Yup from "yup";

export const dailyCollectionReportValidationSchema = Yup.object().shape({
    fromDate: Yup.date()
        .nullable()
        .required("From Date is required"),
    toDate: Yup.date()
        .nullable()
        .required("To Date is required")
        .min(Yup.ref("fromDate"), "To Date cannot be before From Date"),
    tourTypes: Yup.array()
        .min(1, "At least one Tour Type is required"),
    companyUId: Yup.string().required("Company is required"),

    distributorUId: Yup.string().required("Distributor is required"),
});