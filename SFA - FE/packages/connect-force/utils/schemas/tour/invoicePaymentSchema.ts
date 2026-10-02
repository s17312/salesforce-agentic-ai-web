import * as Yup from "yup";

export const invoicePaymentSchema = Yup.object().shape({
  cashPayment: Yup.number()
    .required("Cash payment is required")
    .when("totalPayment", {
      is: (totalPayment: any) => typeof totalPayment === "number",
      then: (schema) =>
        schema.test(
          "is-sufficient",
          "Cash payment insufficient for this payment",
          (cashPayment, context) => {
            const { totalPayment } = context.parent;
            return cashPayment >= totalPayment;
          }
        ),
      otherwise: (schema) => schema,
    }),
  totalPayment: Yup.number().required("Total payment is required"),
});
