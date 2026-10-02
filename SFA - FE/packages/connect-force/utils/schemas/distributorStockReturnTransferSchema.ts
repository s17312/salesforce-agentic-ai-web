import * as Yup from "yup";

export const distributorStockReturnTransferValidationSchema =
  Yup.object().shape({
    distributorUId: Yup.mixed().required("Distributor is required"),
    wareHouseUId: Yup.mixed().required("Warehouse is required"),
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
