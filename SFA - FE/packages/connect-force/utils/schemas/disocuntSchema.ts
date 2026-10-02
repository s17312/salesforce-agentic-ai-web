import { MAXIMUM_MSG, MINIMUM_MSG } from "@/data/commons";
import * as Yup from "yup";

export const discountSchema = Yup.object().shape({
  discountID: Yup.string().required("Required"),
  companyId: Yup.string().required("Required"),
  name: Yup.string()
    .required("Required")
    .min(3, MINIMUM_MSG(3))
    .max(50, MAXIMUM_MSG(50)),
  startdate: Yup.date().required("Required"),
  enddate: Yup.date().required("Required"),
  discountTypeID: Yup.number().required("Required"),
  req_Product: Yup.array()
    .nullable()
    .of(Yup.string())
    .transform((originalValue) => {
      // Split the string if it's a string with comma-separated values.
      if (typeof originalValue === "string") {
        return originalValue.split(",").map((item) => item.trim());
      }
      return originalValue;
    })
    .when("discountTypeID", ([discountTypeID]: number[], schema) => {
      if (discountTypeID === 1) {
        return schema.min(1, "Required").required("Required");
      }
      return schema;
    }),

  req_Quantity: Yup.number()
    .when("discountTypeID", ([discountTypeID]: number[], schema) => {
      if (discountTypeID === 1) {
        return schema.required("Required");
      }
      return schema;
    })
    .nullable(),
  applied_product: Yup.string()
    .when("discountTypeID", ([discountTypeID]: number[], schema) => {
      if (discountTypeID === 1) {
        return schema.required("Required");
      }
      return schema;
    })
    .nullable(),
  applied_quantity: Yup.number()
    .when("discountTypeID", ([discountTypeID]: number[], schema) => {
      if (discountTypeID === 1) {
        return schema.required("Required");
      }
      return schema;
    })
    .nullable(),
  applied_discount_ID: Yup.string()
    .when("discountTypeID", ([discountTypeID]: number[], schema) => {
      if (discountTypeID === 2) {
        return schema.required("Required");
      }
      return schema;
    })
    .nullable(),
  applied_discount_amt: Yup.number()
    .nullable()
    .when("discountTypeID", ([discountTypeID]: number[], schema) => {
      if (discountTypeID === 2) {
        return schema.required("Required");
      }
      return schema;
    }),
  applied_discount_products: Yup.array()
    .nullable()
    .of(Yup.string())
    .transform((originalValue) => {
      // Split the string if it's a string with comma-separated values.
      if (typeof originalValue === "string") {
        return originalValue.split(",").map((item) => item.trim());
      }
      return originalValue;
    })
    .when("discountTypeID", ([discountTypeID]: number[], schema) => {
      if (discountTypeID === 2) {
        return schema.min(1, "Required").required("Required");
      }
      return schema;
    }),
  req_quantity_value_product: Yup.string()
    .nullable()
    .when("discountTypeID", ([discountTypeID]: number[], schema) => {
      if (discountTypeID === 2) {
        return schema.required("Required");
      }
      return schema;
    }),
  invoiceValueTypeUId: Yup.number()
    .nullable()
    .when("discountTypeID", ([discountTypeID]: number[], schema) => {
      if (discountTypeID === 3) {
        return schema.required("Required");
      }
      return schema;
    }),
  invoiceValueDiscountAmt: Yup.number()
    .nullable()
    .when("discountTypeID", ([discountTypeID]: number[], schema) => {
      if (discountTypeID === 3) {
        return schema.required("Required");
      }
      return schema;
    }),
  invoiceValueDiscountAppliedLimit: Yup.number()
    .nullable()
    .when("discountTypeID", ([discountTypeID]: number[], schema) => {
      if (discountTypeID === 3) {
        return schema.required("Required");
      }
      return schema;
    }),
});
