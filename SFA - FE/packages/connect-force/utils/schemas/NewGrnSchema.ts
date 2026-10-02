import * as Yup from "yup";

export const NewGRNValidationSchema = Yup.object().shape({
  invoiceNo: Yup.string().required("Required"),
  companyUId: Yup.mixed().required("Required"),
  distributorUId: Yup.mixed().required("Required"),
  priceListUId: Yup.mixed().required("Required"),
  grnType: Yup.mixed().required("Required"),
  date: Yup.date().required("Required"),
  productUId: Yup.mixed().nullable(),
  quantity: Yup.mixed().when("productUId", {
    is: (productUId: number) => !!productUId,
    then: (schema) =>
      schema
        .transform((value, originalValue) =>
          originalValue.trim() === "" ? null : Number(originalValue)
        )
        .test(
          "is-positive",
          "Quantity must be greater than 0",
          (value) => typeof value === "number" && value > 0
        )
        .test(
          "max-length",
          "Quantity must be less than or equal to 10000",
          (value) => typeof value === "number" && value <= 10000
        )
        .required("Required"),
    otherwise: (schema) => schema.nullable(),
  }),

  poNo: Yup.string().nullable(),
  poDate: Yup.date()
    .nullable()
    .when("poNo", {
      is: (poNo: string) => !!poNo && poNo.trim() !== "",
      then: (schema) => schema.required("Required"),
      otherwise: (schema) => schema.nullable(),
    }),

  chequeNumber: Yup.string().nullable(),
  chequeDate: Yup.date()
    .nullable()
    .when("chequeNumber", {
      is: (chequeNumber: string) => !!chequeNumber && chequeNumber.trim() !== "",
      then: (schema) => schema.required("Required"),
      otherwise: (schema) => schema.nullable(),
    }),

  remark: Yup.string().nullable().max(100, "Cannot exceed 100 characters"),
});
