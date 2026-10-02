import * as Yup from "yup";

export const outletMappingReportValidationSchema = Yup.object().shape({
    companyUId: Yup.string().required("Company is required"),
    distributorUId: Yup.string().required("Distributor is required"),
});