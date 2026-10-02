import * as Yup from "yup";

export const annualSaleSummaryReportSchema = Yup.object().shape({
    year: Yup.date()
        .nullable()
        .required("Year is required"),
    tourTypes: Yup.array()
        .min(1, "At least one Tour Type is required"),
    companyUId: Yup.string().required("Company is required"),

    distributorUId: Yup.string().required("Distributor is required"),
});