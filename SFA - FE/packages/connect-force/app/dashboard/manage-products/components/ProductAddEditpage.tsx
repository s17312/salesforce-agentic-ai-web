import { RHFCheckbox, RHFTextField } from "@/components/hook-form";
import FormProvider from "@/components/hook-form/FormProvider";
import RHFAutocompleteCheckboxField from "@/components/hook-form/RHFAutocompleteCheckboxField";
import RHFAutocompleteField from "@/components/hook-form/RHFAutocompleteField";
import RHFRadioGroup from "@/components/hook-form/RHFRadioGroup";
import { RHFUpload } from "@/components/hook-form/RHFUpload";
import { SaveIcon } from "@/components/icons/saveIcon";
import PopupResponse from "@/components/popup/popup-response";
import { CustomFile } from "@/components/upload";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { setProductMessage } from "@/redux/slices/product-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { createProduct, updateProduct } from "@/service/product.service";
import { getAllActiveProductCategory } from "@/service/productCategory.service";
import { getAllActiveProductGroups } from "@/service/productGroup.service";
import { getAllSalesUnitTypeDetails } from "@/service/salesUnitType.service";
import { getAllActiveUOMs } from "@/service/uom.service";
import { Product } from "@/types/product-types";
import { productValidationSchema } from "@/utils/schemas/productSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LoadingButton } from "@mui/lab";
import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { ProductFormValuesProps } from "connect-force-api-client/models/product";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useMemo, useState } from "react"; // Correctly import useState from react
import { Controller, useForm, useWatch } from "react-hook-form";

type Props = {
  currentProduct?: Product | undefined;
  isEdit?: boolean;
};

export default function ProductAddForm({
  currentProduct,
  isEdit = false,
}: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { productCategorys: productCategoryList } = useSelector(
    (state) => state.productCategorySlice
  );
  const { productGroups: productGroupList } = useSelector(
    (state) => state.productGroupSlice
  );
  const { uoms: uOMList } = useSelector((state) => state.uomSlice);
  const responseMessage = useSelector((state) => state.product.message);
  const salesUnitTypeList = useSelector(
    (state) => state.salesUnitTypeSlice.salesUnitTypeDetails
  );
  const page = useSelector((state) => state.salesUnitTypeSlice.newPage);
  const rowCount = useSelector(
    (state) => state.salesUnitTypeSlice.newRowsPerPage
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | string | null>(null);
  const [droped, setDroped] = useState<boolean>(false);
  const [isClearImage, setIsClearImage] = useState<boolean>(false);
  const [expand1, setExpand1] = useState(true);
  const [expand2, setExpand2] = useState(false);
  const [serverDownError, setServerDownError] = useState(false);

  const withoutBaseUnit = salesUnitTypeList.filter(
    (unit) => unit.isBaseUnit === false && unit.active === true
  );

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllSalesUnitTypeDetails(
          page,
          rowCount,
          undefined,
          "uId",
          "desc"
        );
      } catch (error) {
        dispatch(setPopupResponse(true));
        setServerDownError(true);
      }
    };
    fetchData();
  }, [page, rowCount]);

  // Base64 to Blob Conversion Function
  const base64ToBlob = (
    base64String: string,
    contentType: string = "image/png"
  ) => {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  };

  const defaultValues = useMemo(
    () => ({
      productID: currentProduct?.productID || "",
      productName: currentProduct?.productName || "",
      description: currentProduct?.description || "",
      productGroupUId: currentProduct?.productGroupUId || null,
      productCategoryUId: currentProduct?.productCategoryUId || null,
      uomuId: currentProduct?.uomuId || null,
      isReturnable: currentProduct?.isReturnable || false,
      minOrderLevel: currentProduct?.minOrderLevel || "",
      maxOrderLevel: currentProduct?.maxOrderLevel || "",
      qty: currentProduct?.qty || "",
      barcodeID: currentProduct?.barcodeID || "",
      imgData: currentProduct?.imgData || null,
      salesUnitTypeAssignmentUIds: currentProduct?.salesUnitType?.map(
        (item: any) => item.uId || null
      ),
      salesUnitTypeAssignmentDefaultUId:
        currentProduct?.salesUnitTypeAssignmentDefaultUId || null,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProduct]
  );

  const methods = useForm<ProductFormValuesProps>({
    // @ts-ignore
    resolver: yupResolver(productValidationSchema),
    defaultValues,
    mode: "all",
  });
  const {
    handleSubmit,
    reset,
    control,
    formState,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = methods;
  const handleClearImage = () => {
    setImagePreview(null);
    setFile(null);
    setDroped(false);
    setValue("imgData", null);
    clearErrors("imgData");
  };
  // Blob to Image Conversion Function
  const handleBase64ToImage = (base64String: string) => {
    if (!base64String) return null;
    const blob = base64ToBlob(base64String);
    const file = new File([blob], "image.jpg", { type: "image/jpeg" });
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    setValue("imgData", [newFile]);
    setDroped(true);
    return newFile;
  };

  const selectedSalesUnitTypeListsIDs = watch("salesUnitTypeAssignmentUIds");

  const selectedSalesUnitTypeLists = selectedSalesUnitTypeListsIDs?.map(
    (salesUnitId: number) => {
      const salesUnitType = withoutBaseUnit.find(
        (pl) => pl.uId === salesUnitId
      );
      return {
        value: salesUnitId,
        unitName: salesUnitType?.unitName,
      };
    }
  );
  const watchSalesUnitTypeAssignmentUIds = useWatch({
    control,
    name: "salesUnitTypeAssignmentUIds",
  });

  const salesUnitTypeAssignmentDefaultUId = useWatch({
    control,
    name: "salesUnitTypeAssignmentDefaultUId",
  });

  useEffect(() => {
    if (watchSalesUnitTypeAssignmentUIds) {
      clearErrors(["salesUnitTypeAssignmentDefaultUId"]);
    }
  }, [clearErrors, watchSalesUnitTypeAssignmentUIds]);

  useEffect(() => {
    if (
      salesUnitTypeAssignmentDefaultUId &&
      !watchSalesUnitTypeAssignmentUIds?.includes(
        salesUnitTypeAssignmentDefaultUId
      )
    ) {
      setValue("salesUnitTypeAssignmentDefaultUId", null);
    }
  }, [watchSalesUnitTypeAssignmentUIds]);

  useEffect(() => {
    const hasErrors = errors.salesUnitTypeAssignmentUIds || errors.salesUnitTypeAssignmentDefaultUId;
    if (hasErrors && !expand2) {
      setExpand2(true);
    }
  }, [errors, expand2]);

  useEffect(() => {
    handleReset();
    setIsClearImage(false);
  }, []);

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues as ProductFormValuesProps);
      // setFile(handleBase64ToImage(defaultValues.imgData));
      if (currentProduct.imgData) {
        setFile(handleBase64ToImage(defaultValues.imgData));
      }

      setImagePreview(
        currentProduct.imgData
          ? `data:image/jpeg;base64,${currentProduct.imgData}`
          : null
      );
    } else {
      reset(defaultValues as ProductFormValuesProps);
    }
  }, [isEdit, currentProduct, defaultValues]);

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setProductMessage(null));
    }
  }, [responseMessage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getAllActiveProductGroups(),
          getAllActiveProductCategory(),
          getAllActiveUOMs(),
        ]);
      } catch (error) {
        console.error("Error in getting data", error);
      }
    };
    fetchData();
  }, []);

  const blobToBase64 = (blob: Blob): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleCreateProduct = async (data: ProductFormValuesProps) => {
    try {
      if (data.imgData && data.imgData.length > 0) {
        const base64Promises = data.imgData.map(
          async (file: CustomFile | string) => {
            if (file instanceof File) {
              const base64String = await blobToBase64(file);
              return base64String?.toString().split(",")[1];
            }
            return file;
          }
        );

        const base64Strings = await Promise.all(base64Promises);
        data.imgData = base64Strings.join(",");
      } else {
        data.imgData = null;
      }
      data.qty = Number(data.qty);
      data.minOrderLevel = Number(data.minOrderLevel);
      data.maxOrderLevel = Number(data.maxOrderLevel);
      await createProduct(data);

      router.push(PATH_DASHBOARD.product.list);
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleUpdateProduct = async (data: ProductFormValuesProps) => {
    try {
      if (data.imgData && data.imgData.length > 0) {
        const base64Promises = data.imgData.map(
          async (file: CustomFile | string) => {
            if (file instanceof File) {
              const base64String = await blobToBase64(file);
              return base64String?.toString().split(",")[1];
            }
            return file;
          }
        );

        const base64Strings = await Promise.all(base64Promises);
        data.imgData = base64Strings.join(",");
      } else {
        data.imgData = null;
      }
      data.qty = Number(data.qty);
      data.minOrderLevel = Number(data.minOrderLevel);
      data.maxOrderLevel = Number(data.maxOrderLevel);
      await updateProduct(currentProduct?.uId, data);
      router.push(PATH_DASHBOARD.product.list);
    } catch (error: any) {}
  };

  // Generic mapping function
  const mapListToOptions = (list: any[], labelKey: string, valueKey: string) =>
    list.map((item) => ({
      label: item[labelKey],
      value: item[valueKey],
    }));

  const productCategoryMap = mapListToOptions(
    productCategoryList,
    "categoryName",
    "uId"
  );
  const productGroupMap = mapListToOptions(
    productGroupList,
    "productGroupName",
    "uId"
  );

  const uOMMap = mapListToOptions(uOMList, "shortName", "uId");
  const salesUnitTypeMap = mapListToOptions(withoutBaseUnit, "unitName", "uId");

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.product.list);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/[^0-9.,]/g, "");
  };

  const values = watch();

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const newFile = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
        setValue("imgData", [newFile], { shouldDirty: true });
        setImagePreview(newFile.preview);
        setDroped(true);
      } else {
        setIsClearImage(false);
      }
    },
    [setValue]
  );

  const handleRemoveFile = (inputFile: File | string | null) => {
    const filtered =
      values.imgData &&
      values.imgData?.filter((file: any) => file !== inputFile);
    setValue("imgData", filtered, { shouldDirty: true });
    setImagePreview(null);
    setDroped(true);
  };

  const handleReset = () => {
    setIsClearImage(true);
    reset(defaultValues);
    handleClearImage();
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={
        !isEdit
          ? handleSubmit(handleCreateProduct)
          : handleSubmit(handleUpdateProduct)
      }
    >
      <Grid item xs={12} sx={{ mb: 3, position: "relative" }}>
        <Accordion
          expanded={expand1}
          onChange={() => setExpand1(!expand1)}
          sx={{
            mb: 2,
            border: "1px solid #BDC1E4",
            borderRadius: "9px",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="Business Category Creation"
            id="panel1a-header"
            sx={{ flexDirection: "row-reverse", alignItems: "center" }}
          >
            <Typography variant="body1" sx={{ ml: 5, fontWeight: 500 }}>
              Product Details
            </Typography>
          </AccordionSummary>

          <Box
            sx={{ mx: 12, mb: 2 }}
            rowGap={2}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            }}
          >
            <RHFTextField name="productID" label="Code*" />
            <RHFTextField name="productName" label="Name*" />
            <RHFTextField name="description" label="Description" />
            <RHFAutocompleteField
              name="productCategoryUId"
              placeholder="Product Category*"
              options={productCategoryMap}
              control={control}
              inputProps={{
                form: {
                  autocomplete: "off",
                },
              }}
            />
            <RHFAutocompleteField
              name="productGroupUId"
              placeholder="Product Group*"
              options={productGroupMap}
              control={control}
              inputProps={{
                form: {
                  autocomplete: "off",
                },
              }}
            />
            <Box>
              <RHFCheckbox name="isReturnable" label="Is Returnable" />
            </Box>
            <RHFTextField name="minOrderLevel" label="Min Order Level" />
            <RHFTextField name="maxOrderLevel" label="Max Order Level" />
            <RHFTextField name="qty" label="Measurement*" />
            <RHFAutocompleteField
              name="uomuId"
              placeholder="UOM*"
              options={uOMMap}
              control={control}
              inputProps={{
                form: {
                  autocomplete: "off",
                },
              }}
            />
            <RHFTextField name="barcodeID" label="Barcode" />
          </Box>
          <Box sx={{ mx: 12, mb: 2, mt: 3 }}>
            <Typography variant="body1">Upload Product Image</Typography>
            <Typography variant="caption" color="textSecondary" gutterBottom>
              Maximum image size: 10MB
            </Typography>
          </Box>
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
            <RHFUpload
              multiple
              // thumbnail
              name="imgData"
              accept={{
                "image/jpeg": [".jpg", ".jpeg"],
                "image/png": [".png"],
              }}
              control={control}
              disabled={values?.imgData?.length === 1}
              maxSize={10485760}
              onDrop={handleDrop}
              onRemove={handleRemoveFile}
              isClear={isClearImage}
              // onRemoveAll={handleRemoveAllFiles}
            />

            {imagePreview && (
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  height: 250,
                  width: 250,
                }}
              >
                <Image
                  src={imagePreview}
                  alt="Product"
                  height={235}
                  width={250}
                />
                {isEdit && (
                  <IconButton
                    sx={{ position: "absolute", top: 0, right: 0 }}
                    onClick={() => handleRemoveFile(file)}
                  >
                    <CloseRoundedIcon />
                  </IconButton>
                )}
              </div>
            )}
          </Box>
        </Accordion>
        <Accordion
          expanded={expand2}
          onChange={() => setExpand2(!expand2)}
          sx={{
            mb: 2,
            border: "1px solid #BDC1E4",
            borderRadius: "9px",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
            sx={{ flexDirection: "row-reverse", alignItems: "center" }}
          >
            <Typography variant="body1" sx={{ ml: 3, fontWeight: 500 }}>
              Sales Unit Assignment
            </Typography>
          </AccordionSummary>
          <Box sx={{ mx: 12, mb: 3 }} rowGap={2} columnGap={2}>
            <RHFAutocompleteCheckboxField
              name="salesUnitTypeAssignmentUIds"
              placeholder="Sales Unit Types*"
              options={salesUnitTypeMap}
              control={control}
              rules={{ required: true }}
            />
          </Box>
          <Box>
            {selectedSalesUnitTypeLists &&
              selectedSalesUnitTypeLists.length > 0 && (
                <Box sx={{ mx: 12, mb: 3 }}>
                  <FormLabel component="legend">
                    Select Default Sales Unit *
                  </FormLabel>

                  <Controller
                    name="salesUnitTypeAssignmentDefaultUId"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <RadioGroup
                          {...field}
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gap: 1,
                          }}
                        >
                          {selectedSalesUnitTypeLists.map((salesUnit: any) => (
                            <FormControlLabel
                              sx={{ width: "fit-content" }}
                              key={salesUnit.value}
                              value={Number(salesUnit.value)}
                              control={<Radio />}
                              label={salesUnit.unitName}
                            />
                          ))}
                        </RadioGroup>
                        {error && (
                          <Typography variant="caption" color="error">
                            {error.message}
                          </Typography>
                        )}
                      </>
                    )}
                  />
                </Box>
              )}
          </Box>
        </Accordion>
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
                onClick={() => handleReset()}
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
      {popupResponse && serverDownError && (
        <PopupResponse
          type={"error"}
          message={"Internal server error"}
          redirectBack={redirectBack}
        />
      )}
    </FormProvider>
  );
}
