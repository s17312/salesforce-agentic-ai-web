import { useEffect, useMemo, useState } from "react";
import FormProvider, {
  RHFTextField,
  RHFAutocompleteField,
} from "@/components/hook-form";
import RHFAutocompleteCheckboxField from "@/components/hook-form/RHFAutocompleteCheckboxField";
import RHFDatePicker from "@/components/hook-form/RHFDatePicker";
import { SaveIcon } from "@/components/icons/saveIcon";
import {
  setDiscountError,
  setDiscountMessage,
} from "@/redux/slices/discount/discount-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllCompany } from "@/service/company.service";
import {
  createDiscount,
  getAllDiscountTypes,
  getAllValueDiscountTypes,
  getDiscountProduct,
  updateDiscount,
} from "@/service/Discount/discount.service";
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { mapListToOptions } from "@/utils/sortUtils";
import { LoadingButton } from "@mui/lab";
import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useForm, useWatch } from "react-hook-form";
import { discountSchema } from "@/utils/schemas/disocuntSchema";
import { yupResolver } from "@hookform/resolvers/yup";

type Props = {
  currentDiscount?: any | undefined;
  isEdit?: boolean;
};

const DiscountForm: React.FC<Props> = ({ currentDiscount, isEdit = false }) => {
  const router = useRouter();
  const [isDiscountProductType, setIsDiscountproductType] = useState(false);
  const [isDiscountValueType, setIsDiscountValueType] = useState(false);
  const [isDiscountInvoiceValueType, setIsDiscountInvoiceValueType] =
    useState(false);
  const responseMessage = useSelector((state) => state.discountSlice.message);
  const responseError = useSelector((state) => state.discountSlice.error);
  const companyList = useSelector((state) => state.companySlice.companies);
  const discountTypeDetails = useSelector(
    (state) => state.discountSlice.discountTypeDetails
  );
  const valueDiscountTypeDetails = useSelector(
    (state) => state.discountSlice.valueDiscountTypeDetails
  );
  const discountProductsList = useSelector(
    (state) => state.discountSlice.discountProducts
  );

  const defaultValues = useMemo(
    () => ({
      discountID: currentDiscount?.discountID || "",
      companyId: currentDiscount?.companyId || null,
      name: currentDiscount?.name || "",
      description: currentDiscount?.description || "",
      discountTypeID: currentDiscount?.discountTypeID || null,
      startdate: currentDiscount?.startDate || new Date().toISOString(),
      enddate: currentDiscount?.endDate || new Date().toISOString(),

      req_Product: currentDiscount?.req_Product || [],
      req_Quantity: currentDiscount?.req_Quantity || null,
      applied_product: currentDiscount?.applied_product || null,
      applied_quantity: currentDiscount?.applied_quantity || null,
      productDiscountBudjet: currentDiscount?.productDiscountBudjet || null,

      applied_discount_ID: currentDiscount?.applied_discount_ID || null,
      applied_discount_amt: currentDiscount?.applied_discount_amt || null,
      applied_discount_products:
        currentDiscount?.applied_discount_products || [],
      req_quantity_value_product:
        currentDiscount?.req_quantity_value_product || null,
      valueDiscountTypeID: currentDiscount?.valueDiscountTypeID || null,
      valueDiscountAmt: currentDiscount?.valueDiscountAmt || null,
      valueDiscountAppliedLimit:
        currentDiscount?.valueDiscountAppliedLimit || null,
      valueDiscountBudjet: currentDiscount?.valueDiscountBudjet || null,

      invoiceValueTypeUId: currentDiscount?.applied_discount_ID || null,
      invoiceValueDiscountAmt: currentDiscount?.invoiceValueDiscountAmt || null,
      invoiceValueDiscountAppliedLimit:
        currentDiscount?.invoiceValueDiscountAppliedLimit || null,
      invoiceValueDiscountBudjet:
        currentDiscount?.invoiceValueDiscountBudjet || null,
    }),
    [currentDiscount]
  );

  const methods = useForm<any>({
    // @ts-ignore
    resolver: yupResolver(discountSchema),
    defaultValues,
    mode: "all",
  });

  const { handleSubmit, reset, formState, getValues, setValue, control } =
    methods;

  useWatch({
    control,
    name: ["startdate", "enddate", "companyId", "discountTypeID"],
  });

  const companyId = getValues("companyId");
  const discountTypeId = getValues("discountTypeID");

  useEffect(() => {
    fetchCompanyData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getAllValueDiscountTypes("asc", true),
          getAllDiscountTypes("asc", true),
        ]);
      } catch (error) {
        enqueueSnackbar(`Error in getting data`, { variant: "error" });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (companyId) {
      fetchProductData(companyId);
    }
  }, [companyId]);

  useEffect(() => {
    if (isEdit && currentDiscount) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentDiscount]);

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setDiscountMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setDiscountError(null));
    }
  }, [responseMessage, responseError]);

  useEffect(() => {
    if (!discountTypeId) {
      setIsDiscountproductType(false);
      setIsDiscountValueType(false);
      setIsDiscountInvoiceValueType(false);
    } else if (discountTypeId === 1) {
      setIsDiscountproductType(true);
      setIsDiscountValueType(false);
      setIsDiscountInvoiceValueType(false);
    } else if (discountTypeId === 2) {
      setIsDiscountValueType(true);
      setIsDiscountproductType(false);
      setIsDiscountInvoiceValueType(false);
    } else if (discountTypeId === 3) {
      setIsDiscountInvoiceValueType(true);
      setIsDiscountproductType(false);
      setIsDiscountValueType(false);
    }
  }, [discountTypeId]);

  useEffect(() => {
    if (isDiscountProductType) {
      reset({
        ...getValues(),
        applied_discount_ID: null,
        applied_discount_amt: null,
        applied_discount_products: null,
        req_quantity_value_product: null,
        valueDiscountBudjet: null,
        invoiceValueTypeUId: null,
        invoiceValueDiscountAmt: null,
        invoiceValueDiscountAppliedLimit: null,
        invoiceValueDiscountBudjet: null,
      });
    }
    if (isDiscountValueType) {
      reset({
        ...getValues(),
        req_Product: null,
        req_Quantity: null,
        applied_product: null,
        applied_quantity: null,
        productDiscountBudjet: null,
        invoiceValueTypeUId: null,
        invoiceValueDiscountAmt: null,
        invoiceValueDiscountAppliedLimit: null,
        invoiceValueDiscountBudjet: null,
      });
    }
    if (isDiscountInvoiceValueType) {
      reset({
        ...getValues(),
        req_Product: null,
        req_Quantity: null,
        applied_product: null,
        applied_quantity: null,
        productDiscountBudjet: null,
        applied_discount_ID: null,
        applied_discount_amt: null,
        applied_discount_products: null,
        req_quantity_value_product: null,
        valueDiscountBudjet: null,
      });
    }
  }, [isDiscountProductType, isDiscountValueType, isDiscountInvoiceValueType]);

  const fetchCompanyData = async () => {
    try {
      await Promise.all([
        getAllCompany(
          undefined,
          undefined,
          undefined,
          "companyName",
          "asc",
          true
        ),
      ]);
    } catch (error) {
      enqueueSnackbar(`Error in getting company data`, { variant: "error" });
    }
  };

  const fetchProductData = async (id: number) => {
    try {
      await getDiscountProduct(id);
    } catch {
      enqueueSnackbar(`Error in getting product data`, { variant: "error" });
    }
  };
  const formData = getValues();

  const handleCreateDiscount = async () => {
    const formData = getValues();

    const appliedValueProduct = Array.isArray(
      formData.applied_discount_products
    )
      ? formData.applied_discount_products.join(",")
      : formData.applied_discount_products;

    const payload = {
      discountID: formData.discountID,
      companyId: formData.companyId,
      name: formData.name,
      description: formData.description,
      discountTypeID: formData.discountTypeID,
      startdate: formData.startdate,
      enddate: formData.enddate,

      discountProduct: {
        req_Product: formData.req_Product,
        req_Quantity: formData.req_Quantity,
        applied_product: formData.applied_product,
        applied_quantity: formData.applied_quantity,
        productDiscountBudjet: formData.productDiscountBudjet,
      },

      discountValue: {
        applied_discount_ID: formData.applied_discount_ID,
        applied_discount_amt: formData.applied_discount_amt,
        applied_discount_products: appliedValueProduct,
        req_quantity_value_product: formData.req_quantity_value_product,
        valueDiscountBudjet: formData.valueDiscountBudjet,
      },
      invoiceValueDiscountType: {
        invoiceValueTypeUId: formData.invoiceValueTypeUId,
        invoiceValueDiscountAmt: formData.invoiceValueDiscountAmt,
        invoiceValueDiscountAppliedLimit:
          formData.invoiceValueDiscountAppliedLimit,
        invoiceValueDiscountBudjet: formData.invoiceValueDiscountBudjet,
      },
    };
    try {
      const responseMsg = await createDiscount(payload);
      enqueueSnackbar(`${responseMsg}`, { variant: "success" });
      reset(defaultValues);
      router.push(PATH_DASHBOARD.discount.list);
    } catch (error: any) {}
  };

  const reqProductArray = Array.isArray(formData.req_Product)
    ? formData.req_Product
    : formData.req_Product?.split(",").map((item: string) => item.trim());

  const handleUpdateDiscount = async () => {
    const formData = getValues();

    const appliedValueProduct = Array.isArray(
      formData.applied_discount_products
    )
      ? formData.applied_discount_products.join(",")
      : formData.applied_discount_products;

    const payload = {
      discountID: formData.discountID,
      companyId: formData.companyId,
      name: formData.name,
      description: formData.description,
      discountTypeID: formData.discountTypeID,
      startdate: formData.startdate,
      enddate: formData.enddate,

      discountProduct: {
        req_Product: reqProductArray,
        req_Quantity: formData.req_Quantity,
        applied_product: formData.applied_product,
        applied_quantity: formData.applied_quantity,
        productDiscountBudjet: formData.productDiscountBudjet,
      },

      discountValue: {
        applied_discount_ID: formData.applied_discount_ID,
        applied_discount_amt: formData.applied_discount_amt,
        applied_discount_products: appliedValueProduct,
        req_quantity_value_product: formData.req_quantity_value_product,
        valueDiscountBudjet: formData.valueDiscountBudjet,
      },
      invoiceValueDiscountType: {
        invoiceValueTypeUId: formData.invoiceValueTypeUId,
        invoiceValueDiscountAmt: formData.invoiceValueDiscountAmt,
        invoiceValueDiscountAppliedLimit:
          formData.invoiceValueDiscountAppliedLimit,
        invoiceValueDiscountBudjet: formData.invoiceValueDiscountBudjet,
      },
    };
    try {
      if (currentDiscount?.uId !== undefined) {
        await updateDiscount(currentDiscount.uId, payload);
      }
      enqueueSnackbar("Discount successfully updated", { variant: "success" });
      router.push(PATH_DASHBOARD.discount.list);
    } catch (error: any) {}
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.discount.list);
  };

  const companyOptions = useMemo(
    () => mapListToOptions(companyList, "companyName", "uId"),
    [companyList, mapListToOptions]
  );

  const discountProductOptions = useMemo(
    () =>
      discountProductsList.map((product) => ({
        value: product.productUId,
        label: `${product.productID} - ${product.productName}`,
      })),
    [discountProductsList]
  );

  const discountTypeMap = mapListToOptions(
    discountTypeDetails,
    "discountTypeName",
    "discountTypeID"
  );

  const valueDiscountTypeMap = mapListToOptions(
    valueDiscountTypeDetails,
    "name",
    "val_type_ID"
  );

  return (
    <FormProvider
      methods={methods}
      onSubmit={
        !isEdit
          ? handleSubmit(handleCreateDiscount)
          : handleSubmit(handleUpdateDiscount)
      }
    >
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
            aria-controls="Discount Creation"
            id="panel1a-header"
            sx={cursorDefault}
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
            <RHFTextField name="discountID" label="Discount ID*" />
            <RHFAutocompleteField
              name="companyId"
              placeholder="Company*"
              options={companyOptions}
              control={control}
            />
            <RHFTextField name="name" label="Name*" />
            <RHFTextField name="description" label="Description" />
            <RHFDatePicker
              name="startdate"
              label="Start Date*"
              disableFuture={false}
              disablePast={true}
              onChange={(date: any) => {
                setValue("startdate", date);
              }}
              format={process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"}
              value={null}
              renderInput={(params) => <TextField {...params} />}
            />
            <RHFDatePicker
              name="enddate"
              label="End Date*"
              disableFuture={false}
              onChange={(date: any) => {
                setValue("enddate", date);
              }}
              format={process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"}
              value={null}
              renderInput={(params) => <TextField {...params} />}
            />
            <RHFAutocompleteField
              name="discountTypeID"
              placeholder="Discount Type*"
              options={discountTypeMap}
              control={control}
              inputProps={{
                form: {
                  autocomplete: "off",
                },
              }}
            />
          </Box>
        </Accordion>
        {isDiscountProductType && (
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
              <RHFAutocompleteCheckboxField
                name="req_Product"
                placeholder="Required Product*"
                options={discountProductOptions}
                control={control}
              />
              <RHFTextField
                name="req_Quantity"
                label="Required Quantity*"
                type="number"
                inputProps={{ min: 0 }}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "+" || e.key === "e") {
                    e.preventDefault();
                  }
                }}
              />
              <RHFAutocompleteField
                name="applied_product"
                placeholder="Applied Product*"
                options={discountProductOptions}
                control={control}
              />
              <RHFTextField
                name="applied_quantity"
                label="Applied Quantity*"
                type="number"
                inputProps={{ min: 0 }}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "+" || e.key === "e") {
                    e.preventDefault();
                  }
                }}
              />
              <RHFTextField
                name="productDiscountBudjet"
                label="Product Discount Budget*"
                type="number"
                inputProps={{ min: 0 }}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "+" || e.key === "e") {
                    e.preventDefault();
                  }
                }}
              />
            </Box>
          </Accordion>
        )}
        {isDiscountValueType && (
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
              <RHFAutocompleteField
                name="applied_discount_ID"
                placeholder="Value Discount Type*"
                options={valueDiscountTypeMap}
                control={control}
              />
              <RHFTextField
                name="applied_discount_amt"
                label="Applied Discount Amount*"
                type="number"
                inputProps={{ min: 0 }}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "+" || e.key === "e") {
                    e.preventDefault();
                  }
                }}
              />
              <RHFAutocompleteCheckboxField
                name="applied_discount_products"
                placeholder="Applied Product*"
                options={discountProductOptions}
                control={control}
              />
              <RHFTextField
                name="req_quantity_value_product"
                label="Required Quantity*"
                type="number"
                inputProps={{ min: 0 }}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "+" || e.key === "e") {
                    e.preventDefault();
                  }
                }}
              />
              <RHFTextField
                name="valueDiscountBudjet"
                label="Value Discount Budget"
                type="number"
                inputProps={{ min: 0 }}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "+" || e.key === "e") {
                    e.preventDefault();
                  }
                }}
              />
            </Box>
          </Accordion>
        )}
        {isDiscountInvoiceValueType && (
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
              <RHFAutocompleteField
                name="invoiceValueTypeUId"
                placeholder="Invoice Value Type*"
                options={valueDiscountTypeMap}
                control={control}
              />
              <RHFTextField
                name="invoiceValueDiscountAmt"
                label="Discount Amount*"
                type="number"
                inputProps={{ min: 0 }}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "+" || e.key === "e") {
                    e.preventDefault();
                  }
                }}
              />
              <RHFTextField
                name="invoiceValueDiscountAppliedLimit"
                label="Discount Applied Limit*"
                type="number"
                inputProps={{ min: 0 }}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "+" || e.key === "e") {
                    e.preventDefault();
                  }
                }}
              />
              <RHFTextField
                name="invoiceValueDiscountBudjet"
                label="Discount Budget"
                type="number"
                inputProps={{ min: 0 }}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "+" || e.key === "e") {
                    e.preventDefault();
                  }
                }}
              />
            </Box>
          </Accordion>
        )}
        <Box
          sx={{
            width: "100%",
            bgcolor: "#E5E0F5",
            height: "10vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "2px solid #FFFFFF",
            borderRadius: "15px",
            mt: "15px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <LoadingButton
              type="submit"
              variant="contained"
              loading={formState.isSubmitting}
              startIcon={<SaveIcon />}
              disabled={!formState.isDirty}
              sx={{
                color: "#FFFFFF",
                height: "44px",
                px: 4,
                borderRadius: "15px",
                mr: 3,
                border: "2px solid #9fa4d4",
                background: "#070E4D",
                "&:hover": {
                  background: "#2D3675",
                },
              }}
            >
              {isEdit ? "Update" : "Save"}
            </LoadingButton>
            {!isEdit ? (
              <Button
                type="reset"
                variant="outlined"
                onClick={() => reset(defaultValues)}
                sx={{
                  height: "44px",
                  px: 4,
                  borderRadius: "15px",
                  background: "#f7f4fe",
                  border: "2px solid #fbf9ff",
                  "&:hover": {
                    background: "#DED8F2",
                    border: "2px solid #f4f1fc",
                  },
                }}
              >
                Clear
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{
                  height: "44px",
                  px: 4,
                  borderRadius: "15px",
                  background: "#f7f4fe",
                  border: "2px solid #fbf9ff",
                  "&:hover": {
                    background: "#DED8F2",
                    border: "2px solid #f4f1fc",
                  },
                }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </Grid>
    </FormProvider>
  );
};

export default DiscountForm;
