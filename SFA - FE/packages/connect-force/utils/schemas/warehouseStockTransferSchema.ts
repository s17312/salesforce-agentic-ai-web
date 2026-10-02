import * as Yup from 'yup';

export const warehouseStockTransferSchema = Yup.object().shape({
    stockTransferDate: Yup.date()
        .required("Warehouse stock transfer Date is required")
        .typeError("Warehouse stock transfer Date must be a valid date")
        .test(
            "is-valid-date",
            "Warehouse stock transfer Date must be a valid date",
            (value) => value !== undefined && !isNaN(value.getTime())
        ),
    distributorUId: Yup.number().required("Distributor is required"),
    fromWarehouseUId: Yup.number().required("From Warehouse is required"),
    recivingWarehouseUId: Yup.number().required("To Warehouse is required"),
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