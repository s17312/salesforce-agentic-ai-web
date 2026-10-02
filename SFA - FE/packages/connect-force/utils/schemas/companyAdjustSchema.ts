import * as Yup from "yup";

export const companyAdjustValidationSchema = Yup.object().shape({
  companyUId: Yup.mixed().required("Company is required"),
  wareHouseUId: Yup.mixed().required("Warehouse is required"),
  priceListUId: Yup.mixed().required("Price List is required"),
  quantity: Yup.mixed()
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
      (value) => typeof value === "number" && value <= 10000000000000
    )
    .required("Quantity is required"),
});
