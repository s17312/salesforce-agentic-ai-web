import * as Yup from "yup";

export const PoCreationApprovalValidationSchema = Yup.object().shape({
  companyUId: Yup.mixed().required("Required"),
  distributorUId: Yup.mixed().required("Required"),
  priceListUId: Yup.mixed().required("Required"),
  deliveryDate: Yup.date().required("Required"),
  poDate: Yup.date().required("Required"),
  paymentTermUId: Yup.mixed().required("Required"),
  deliveryMethodUId: Yup.mixed().required("Required"),
  warehouseId: Yup.mixed().required("Required"),
  priceListTypeUId: Yup.mixed().required("Required"),
  productUId: Yup.mixed().nullable(),
  quantity: Yup.mixed().when("productUId", {
    is: (productUId: number) => !!productUId, // Check if productUId is provided
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
    otherwise: (schema) => schema.nullable(), // Ignore validation if productUId is not provided
  }),
  remark: Yup.string().nullable().max(100, "Cannot exceed 100 characters"),
});
