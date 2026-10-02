import StatusChip from "@/components/color-chip/Chip";
import { RHFCheckbox, RHFTextField } from "@/components/hook-form";
import FormProvider from "@/components/hook-form/FormProvider";
import RHFAutocompleteCheckboxField from "@/components/hook-form/RHFAutocompleteCheckboxField";
import PopupResponse from "@/components/popup/popup-response";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllSalesUnitTypeDetails } from "@/service/salesUnitType.service";
import {
  cursorTextDefault,
  scrollBarDefault,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { Product } from "@/types/product-types";
import { mapListToOptions } from "@/utils/sortUtils";
import {
  Accordion,
  AccordionSummary,
  Box,
  FormLabel,
  Grid,
  Typography,
} from "@mui/material";
import { ProductFormValuesProps } from "connect-force-api-client/models/product";
import { format, isValid } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  currentProduct?: Product | undefined;
};

export default function ProductView({ currentProduct }: Props) {
  const dateFormat = process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy";
  const router = useRouter();
  const [serverDownError, setServerDownError] = useState(false);
  const salesUnitTypeList = useSelector(
    (state) => state.salesUnitTypeSlice.salesUnitTypeDetails
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const withoutBaseUnit = salesUnitTypeList.filter(
    (unit) => unit.isBaseUnit === false
  );
  const page = useSelector((state) => state.salesUnitTypeSlice.newPage);
  const rowCount = useSelector(
    (state) => state.salesUnitTypeSlice.newRowsPerPage
  );

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

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
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
      minOrderLevel: currentProduct?.minOrderLevel || null,
      maxOrderLevel: currentProduct?.maxOrderLevel || null,
      qty: currentProduct?.qty || "",
      barcodeID: currentProduct?.barcodeID || "",
      imgData: currentProduct?.imgData || null,
      uom: currentProduct?.uom?.shortName || null,
      productGroup:
        currentProduct?.productGroupName ||
        currentProduct?.productGroup?.productGroupName ||
        null,

      productCategory:
        currentProduct?.productCategoryName ||
        currentProduct?.productCategory?.categoryName ||
        null,

      createdBy: currentProduct?.createdBy || "ADMIN",
      modifiedBy: currentProduct?.modifiedBy || "ADMIN",
      creationDate: currentProduct?.creationDate || "",
      modifiedDate: currentProduct?.modifiedDate || "",
      salesUnitTypeAssignmentUIds: currentProduct?.salesUnitType?.map(
        (item: any) => item.uId
      ),
      salesUnitTypeDefault:
        currentProduct?.salesUnitTypeDefault?.unitName || null,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProduct]
  );

  useEffect(() => {
    reset(defaultValues);
  }, [currentProduct]);

  const methods = useForm<ProductFormValuesProps>({
    defaultValues,
  });

  const { reset, watch, control } = methods;

  const salesUnitTypeMap = mapListToOptions(withoutBaseUnit, "unitName", "uId");

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

  return (
    <FormProvider methods={methods}>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <StatusChip status={currentProduct?.active} />
      </Box>
      <Grid item xs={12} sx={{ mt: 2, mb: 5 }}>
        <Accordion
          expanded={true}
          sx={{
            mb: 2,
            border: "1px solid #BDC1E4",
            borderRadius: "9px",
          }}
        >
          <AccordionSummary
            aria-controls="Product Creation"
            sx={{
              flexDirection: "row-reverse",
              alignItems: "center",
              "&:hover": {
                cursor: "default !important",
              },
            }}
          >
            <Typography
              variant="body1"
              gutterBottom
              sx={{ ml: 5, fontWeight: 500 }}
            >
              Product Details
            </Typography>
          </AccordionSummary>
          <Box
            sx={{
              mb: currentProduct?.imgData ? 3 : 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {currentProduct?.imgData && (
              <Box>
                <img
                  src={`data:image/jpeg;base64,${currentProduct.imgData}`}
                  alt="Product"
                  style={{ height: 200, width: "auto" }}
                />
              </Box>
            )}
          </Box>
          <Box
            sx={{ mx: 12, mb: 3 }}
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            }}
          >
            <RHFTextField
              name="productID"
              label="Code"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="productName"
              label="Name"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="description"
              label="Description"
              focused
              multiline
              maxRows={3}
              InputLabelProps={
                defaultValues.description ? { shrink: true } : { shrink: false }
              }
              sx={{
                ...scrollBarDefault,
              }}
              inputProps={{ readOnly: true }}
            />
            <RHFTextField
              name="productGroup"
              label="Product Group"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="productCategory"
              label="Product Category"
              focused
              inputProps={{ readOnly: true }}
            />
            <RHFCheckbox name="isReturnable" label="Is Returnable" disabled />
            <RHFTextField
              name="minOrderLevel"
              label="Min Order Level"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.minOrderLevel
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
            <RHFTextField
              name="maxOrderLevel"
              label="Max Order Level"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.maxOrderLevel
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
            <RHFTextField
              name="qty"
              label="Measurement"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="uom"
              label="UOM"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="barcodeID"
              label="Barcode"
              focused
              sx={cursorTextDefault}
              inputProps={{ readOnly: true }}
              InputLabelProps={
                defaultValues.barcodeID ? { shrink: true } : { shrink: false }
              }
            />
          </Box>
        </Accordion>
        <Accordion
          expanded={true}
          sx={{
            mb: 2,
            border: "1px solid #BDC1E4",
            borderRadius: "9px",
          }}
        >
          <AccordionSummary
            aria-controls="Product Creation"
            sx={{
              flexDirection: "row-reverse",
              alignItems: "center",
              "&:hover": {
                cursor: "default !important",
              },
            }}
          >
            <Typography
              variant="body1"
              gutterBottom
              sx={{ ml: 5, fontWeight: 500 }}
            >
              Sales Unit Assignment
            </Typography>
          </AccordionSummary>
          <Box
            sx={{ mx: 12, mb: 3 }}
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            }}
          >
            <Box>
              <RHFAutocompleteCheckboxField
                name="salesUnitTypeAssignmentUIds"
                placeholder="Sales Unit Types"
                options={salesUnitTypeMap}
                control={control}
                disabled
              />
            </Box>
            <Box>
              {selectedSalesUnitTypeLists &&
                selectedSalesUnitTypeLists.length > 0 && (
                  <Box sx={{ mx: 12, mb: 3 }}>
                    <RHFTextField
                      name="salesUnitTypeDefault"
                      label="Default Sales Unit Type"
                      focused
                      inputProps={{ readOnly: true }}
                      sx={cursorTextDefault}
                    />
                  </Box>
                )}
            </Box>
          </Box>
        </Accordion>
      </Grid>
      <Grid item xs={12} sx={{ mb: 3 }}>
        <Box
          sx={{ mx: 12, mb: 3 }}
          rowGap={2}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            sm: "repeat(4, 1fr)",
          }}
        >
          <RHFTextField
            name="createdBy"
            label="Created By"
            inputProps={{ readOnly: true }}
            focused
            sx={cursorTextDefault}
          />
          <RHFTextField
            name="creationDate"
            label="Created Date"
            inputProps={{ readOnly: true }}
            focused
            value={
              defaultValues.creationDate &&
              isValid(new Date(defaultValues.creationDate))
                ? format(new Date(defaultValues.creationDate), dateFormat)
                : ""
            }
            sx={cursorTextDefault}
          />
          <RHFTextField
            name="modifiedBy"
            label="Modified By"
            inputProps={{ readOnly: true }}
            focused
            sx={cursorTextDefault}
          />
          <RHFTextField
            name="modifiedDate"
            label="Modified Date"
            inputProps={{ readOnly: true }}
            focused
            value={
              defaultValues.modifiedDate &&
              isValid(new Date(defaultValues.modifiedDate))
                ? format(new Date(defaultValues.modifiedDate), dateFormat)
                : ""
            }
            sx={cursorTextDefault}
            InputLabelProps={
              defaultValues.modifiedDate ? { shrink: true } : { shrink: false }
            }
          />
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
