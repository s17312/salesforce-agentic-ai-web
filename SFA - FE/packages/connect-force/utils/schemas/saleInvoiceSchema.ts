import * as Yup from "yup";

export const saleInvoiceSchema = Yup.object().shape({
    routeUid: Yup.string().required("Required"),
    outletUid: Yup.string().required("Required"),
    paymentTypeUid: Yup.string().required("Required"),
});
