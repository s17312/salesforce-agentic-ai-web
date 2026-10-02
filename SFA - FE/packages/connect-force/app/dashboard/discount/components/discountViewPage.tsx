import { RHFTextField } from "@/components/hook-form";
import FormProvider from "@/components/hook-form/FormProvider";
import {
  cursorDefault,
  cursorTextDefault,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  Accordion,
  AccordionSummary,
  Box,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import { format, isValid } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

type props = {
  currentDiscount: any | undefined;
};

export default function DiscountViewPage({ currentDiscount }: props) {
  const dateFormat = process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy";
  const applied_product = `${currentDiscount?.appliedProduct?.productID} - ${currentDiscount?.appliedProduct?.productName}`;
  const defaultValues = useMemo(
    () => ({
      discountID: currentDiscount?.discountID || null,
      companyName: currentDiscount?.company?.companyName || null,
      name: currentDiscount?.name || null,
      description: currentDiscount?.description || null,
      startDate: currentDiscount?.startDate || null,
      endDate: currentDiscount?.endDate || null,
      discountTypeId: currentDiscount?.discountTypeID || null,
      discountTypeName: currentDiscount?.discountType?.discountTypeName || null,
      reqProducts: currentDiscount?.reqProducts || null,

      // product discount
      req_Quantity: currentDiscount?.req_Quantity || null,
      applied_product: applied_product || null,
      applied_quantity: currentDiscount?.applied_quantity || null,
      productDiscountBudjet: currentDiscount?.productDiscountBudjet || null,

      // value discount
      valueDiscountType: currentDiscount?.discountValueType?.name || null,
      applied_discount_amt: currentDiscount?.applied_discount_amt || null,
      appliedDiscountProducts: currentDiscount?.appliedDiscountProducts || null,
      req_quantity_value_product:
        currentDiscount?.req_quantity_value_product || null,
      valueDiscountBudjet: currentDiscount?.valueDiscountBudjet || null,

      //invoice value discount
      invoiceValueTypeUId: currentDiscount?.discountValueType?.name || null,
      invoiceValueDiscountAmt: currentDiscount?.invoiceValueDiscountAmt || null,
      invoiceValueDiscountAppliedLimit:
        currentDiscount?.invoiceValueDiscountAppliedLimit || null,
      invoiceValueDiscountBudjet:
        currentDiscount?.invoiceValueDiscountBudjet || null,
    }),
    [currentDiscount]
  );

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDiscount]);

  const methods = useForm<any>({
    defaultValues,
  });

  const { reset } = methods;

  const productNames = (defaultValues?.reqProducts || [])
    .map(
      (product: { productID: string; productName: string }) =>
        `${product.productID} - ${product.productName}`
    )
    .join(", ");

  const productNamesTooltip = (defaultValues?.reqProducts || [])
    .map(
      (product: { productID: string; productName: string }) =>
        `${product.productID} - ${product.productName}`
    )
    .join("\n");

  const appliedProductNames = (defaultValues?.appliedDiscountProducts || [])
    .map(
      (product: { productID: string; productName: string }) =>
        `${product.productID} - ${product.productName}`
    )
    .join(", ");

  return (
    <>
      <FormProvider methods={methods}>
        <Grid item xs={12} sx={{ mb: 3, position: "relative" }}>
          <Accordion
            expanded={true}
            sx={{
              mb: 2,
              border: "1px solid #BDC1E4",
              borderRadius: "9px",
            }}
          >
            <AccordionSummary
              aria-controls="Delivery Method Details"
              id="panel1a-header"
              sx={{
                flexDirection: "row-reverse",
                alignItems: "center",
                "&:hover": {
                  cursor: "default !important",
                },
              }}
            >
              <Typography variant="body1" sx={{ ml: 5, fontWeight: 500 }}>
                Discounts and Promotion
              </Typography>
            </AccordionSummary>
            <Box
              sx={{ mx: 12, mb: 3 }}
              rowGap={2}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
              }}
            >
              <RHFTextField
                name="discountID"
                label="DiscountId"
                inputProps={{ readOnly: true }}
                focused
                sx={cursorTextDefault}
                InputLabelProps={
                  defaultValues.discountID
                    ? { shrink: true }
                    : { shrink: false }
                }
              />
              <RHFTextField
                name="companyName"
                label="Company"
                inputProps={{ readOnly: true }}
                focused
                sx={cursorTextDefault}
                InputLabelProps={
                  defaultValues.companyName
                    ? { shrink: true }
                    : { shrink: false }
                }
              />
              <RHFTextField
                name="name"
                label="Name"
                inputProps={{ readOnly: true }}
                focused
                sx={cursorTextDefault}
                InputLabelProps={
                  defaultValues.name ? { shrink: true } : { shrink: false }
                }
              />
              <RHFTextField
                name="description"
                label="Description"
                inputProps={{ readOnly: true }}
                focused
                sx={cursorTextDefault}
                InputLabelProps={
                  defaultValues.description
                    ? { shrink: true }
                    : { shrink: false }
                }
              />
              <RHFTextField
                name="startDate"
                label="Start Date"
                inputProps={{ readOnly: true }}
                focused
                sx={cursorTextDefault}
                InputLabelProps={
                  defaultValues.startDate ? { shrink: true } : { shrink: false }
                }
                value={
                  defaultValues.startDate &&
                  isValid(new Date(defaultValues.startDate))
                    ? format(new Date(defaultValues.startDate), dateFormat)
                    : ""
                }
              />
              <RHFTextField
                name="endDate"
                label="End Date"
                inputProps={{ readOnly: true }}
                focused
                sx={cursorTextDefault}
                InputLabelProps={
                  defaultValues.endDate ? { shrink: true } : { shrink: false }
                }
                value={
                  defaultValues.endDate &&
                  isValid(new Date(defaultValues.endDate))
                    ? format(new Date(defaultValues.endDate), dateFormat)
                    : ""
                }
              />
              <RHFTextField
                name="discountTypeName"
                label="Discount Type"
                inputProps={{ readOnly: true }}
                focused
                sx={cursorTextDefault}
                InputLabelProps={
                  defaultValues.discountTypeName
                    ? { shrink: true }
                    : { shrink: false }
                }
              />
            </Box>
          </Accordion>
          {defaultValues.discountTypeId == 1 && (
            <Accordion
              expanded={true}
              sx={{
                mb: 2,
                border: "1px solid #BDC1E4",
                borderRadius: "9px",
              }}
            >
              <AccordionSummary
                aria-controls="Discount Creation"
                id="panel1a-header"
                sx={cursorDefault}
              >
                <Typography variant="body1" sx={{ ml: 5, fontWeight: 500 }}>
                  Product Discount
                </Typography>
              </AccordionSummary>
              <Box
                sx={{ mx: 12, mb: 3 }}
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                }}
              >
                <Tooltip
                  title={
                    <span style={{ whiteSpace: "pre-line" }}>
                      {productNamesTooltip}
                    </span>
                  }
                  placement="right"
                  arrow
                >
                  <RHFTextField
                    name="reqProducts"
                    label="Required Product"
                    value={productNames}
                    inputProps={{ readOnly: true }}
                    focused
                    sx={cursorTextDefault}
                    InputLabelProps={
                      defaultValues.reqProducts
                        ? { shrink: true }
                        : { shrink: false }
                    }
                  />
                </Tooltip>
                <RHFTextField
                  name="req_Quantity"
                  label="Required Quantity"
                  inputProps={{ readOnly: true }}
                  focused
                  sx={cursorTextDefault}
                  InputLabelProps={
                    defaultValues.req_Quantity
                      ? { shrink: true }
                      : { shrink: false }
                  }
                />
                <RHFTextField
                  name="applied_product"
                  label="Applied Product"
                  inputProps={{ readOnly: true }}
                  focused
                  sx={cursorTextDefault}
                  InputLabelProps={
                    defaultValues.applied_product
                      ? { shrink: true }
                      : { shrink: false }
                  }
                />
                <RHFTextField
                  name="applied_quantity"
                  label="Applied Quantity"
                  inputProps={{ readOnly: true }}
                  focused
                  sx={cursorTextDefault}
                  InputLabelProps={
                    defaultValues.applied_quantity
                      ? { shrink: true }
                      : { shrink: false }
                  }
                />
                <RHFTextField
                  name="productDiscountBudjet"
                  label="Product Discount Budjet"
                  inputProps={{ readOnly: true }}
                  focused
                  sx={cursorTextDefault}
                  InputLabelProps={
                    defaultValues.productDiscountBudjet
                      ? { shrink: true }
                      : { shrink: false }
                  }
                />
              </Box>
            </Accordion>
          )}

          {defaultValues.discountTypeId == 2 && (
            <Accordion
              expanded={true}
              sx={{
                mb: 2,
                border: "1px solid #BDC1E4",
                borderRadius: "9px",
              }}
            >
              <AccordionSummary id="panel2a-header" sx={cursorDefault}>
                <Typography variant="body1" sx={{ ml: 5, fontWeight: 500 }}>
                  Value Discount - Product
                </Typography>
              </AccordionSummary>
              <Box
                sx={{ mx: 12, mb: 3 }}
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                }}
              >
                <RHFTextField
                  name="valueDiscountType"
                  label="Value Discount Type"
                  inputProps={{ readOnly: true }}
                  focused
                  sx={cursorTextDefault}
                  InputLabelProps={
                    defaultValues.valueDiscountType
                      ? { shrink: true }
                      : { shrink: false }
                  }
                />
                <RHFTextField
                  name="applied_discount_amt"
                  label="Applied Discount Amount"
                  inputProps={{ readOnly: true }}
                  focused
                  sx={cursorTextDefault}
                  InputLabelProps={
                    defaultValues.applied_discount_amt
                      ? { shrink: true }
                      : { shrink: false }
                  }
                />
                <RHFTextField
                  name="applied_discount_products"
                  label="Applied Product"
                  value={appliedProductNames}
                  inputProps={{ readOnly: true }}
                  focused
                  sx={cursorTextDefault}
                  InputLabelProps={
                    defaultValues.appliedDiscountProducts
                      ? { shrink: true }
                      : { shrink: false }
                  }
                />
                <RHFTextField
                  name="req_quantity_value_product"
                  label="Required Quantity"
                  inputProps={{ readOnly: true }}
                  focused
                  sx={cursorTextDefault}
                  InputLabelProps={
                    defaultValues.req_quantity_value_product
                      ? { shrink: true }
                      : { shrink: false }
                  }
                />
                <RHFTextField
                  name="valueDiscountBudjet"
                  label="Value Discount Budget"
                  inputProps={{ readOnly: true }}
                  focused
                  sx={cursorTextDefault}
                  InputLabelProps={
                    defaultValues.valueDiscountBudjet
                      ? { shrink: true }
                      : { shrink: false }
                  }
                />
              </Box>
            </Accordion>
          )}

          {defaultValues.discountTypeId == 3 && (
            <Accordion
              expanded={true}
              sx={{
                mb: 2,
                border: "1px solid #BDC1E4",
                borderRadius: "9px",
              }}
            >
              <AccordionSummary id="panel2a-header" sx={cursorDefault}>
                <Typography variant="body1" sx={{ ml: 5, fontWeight: 500 }}>
                  Value Discount - Invoice
                </Typography>
              </AccordionSummary>
              <Box
                sx={{ mx: 12, mb: 3 }}
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                }}
              >
                <RHFTextField
                  name="invoiceValueTypeUId"
                  label="Invoice Value Type"
                  inputProps={{ readOnly: true }}
                  focused
                  sx={cursorTextDefault}
                  InputLabelProps={
                    defaultValues.invoiceValueTypeUId
                      ? { shrink: true }
                      : { shrink: false }
                  }
                />
                <RHFTextField
                  name="invoiceValueDiscountAmt"
                  label="Discount Amount"
                  inputProps={{ readOnly: true }}
                  focused
                  sx={cursorTextDefault}
                  InputLabelProps={
                    defaultValues.invoiceValueDiscountAmt
                      ? { shrink: true }
                      : { shrink: false }
                  }
                />
                <RHFTextField
                  name="invoiceValueDiscountAppliedLimit"
                  label="Discount Applied Limit"
                  inputProps={{ readOnly: true }}
                  focused
                  sx={cursorTextDefault}
                  InputLabelProps={
                    defaultValues.invoiceValueDiscountAppliedLimit
                      ? { shrink: true }
                      : { shrink: false }
                  }
                />
                <RHFTextField
                  name="invoiceValueDiscountBudjet"
                  label="Discount Budget"
                  inputProps={{ readOnly: true }}
                  focused
                  sx={cursorTextDefault}
                  InputLabelProps={
                    defaultValues.invoiceValueDiscountBudjet
                      ? { shrink: true }
                      : { shrink: false }
                  }
                />
              </Box>
            </Accordion>
          )}
        </Grid>
      </FormProvider>
    </>
  );
}
