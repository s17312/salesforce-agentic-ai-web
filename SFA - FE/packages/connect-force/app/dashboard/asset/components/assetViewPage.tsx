import { FormValuesPropsAsset } from "@/types/asset-types";
import StatusChip from "@/components/color-chip/Chip";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  Accordion,
  AccordionSummary,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import { format, isValid } from "date-fns";
import FormProvider, { RHFTextField } from "@/components/hook-form";
import {
  scrollBarDefault,
  cursorTextDefault,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";

type props = {
  currentAsset: FormValuesPropsAsset | undefined;
};

export default function AssetViewPage({ currentAsset }: props) {
  const dateFormat = process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy";

  const defaultValues = useMemo(
    () => ({
      assetId: currentAsset?.assetId || null,
      assetName: currentAsset?.assetName || null,
      assetTypeUID: currentAsset?.assetTypeUID || null,
      assetBrandUId: currentAsset?.assetBrandUId || null,
      assetModelUId: currentAsset?.assetModelUId || null,
      assetTypeName: currentAsset?.assetType?.assetTypeName || null,
      assetBrandName: currentAsset?.assetBrand?.assetBrandName || null,
      assetModelName: currentAsset?.assetModel?.assetModelName || null,
      serialNumber: currentAsset?.serialNumber || null,
      manufacturer: currentAsset?.manufacturer || null,
      purchaseDate: currentAsset?.purchaseDate || null,
      cost: currentAsset?.cost || null,
      guaranteeInformation: currentAsset?.guaranteeInformation || "",
      maintenanceSchedule: currentAsset?.maintenanceSchedule || null,
      additionalNotes: currentAsset?.additionalNotes || null,
      // assignStatus: currentAsset?.assignStatus || null,
      companyUId: currentAsset?.companyUId || 1,
      createdBy: currentAsset?.createdBy || "ADMIN",
      creationDate: currentAsset?.creationDate || "",
      modifiedBy: currentAsset?.modifiedBy || "ADMIN",
      modifiedDate: currentAsset?.modifiedDate || "",
    }),
    [currentAsset]
  );

  useEffect(() => {
    reset(defaultValues);
  }, [currentAsset]);

  const methods = useForm<FormValuesPropsAsset>({
    defaultValues,
  });

  const { reset } = methods;

  return (
    <FormProvider methods={methods}>
      <Grid
        item
        xs={12}
        sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}
      >
        <StatusChip status={currentAsset?.active} />
      </Grid>
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
            aria-controls="Asset"
            id="panel1a-header"
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
              sx={{ ml: 5, mb: 2, fontWeight: 500 }}
            >
              Asset Details
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
            <RHFTextField
              name="assetId"
              label="Asset ID"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.assetId
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
            <RHFTextField
              name="assetName"
              label="Asset Name"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.assetName
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
            <RHFTextField
              name="assetTypeName"
              label="Asset Type"
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
              focused
            />
            <RHFTextField
              name="assetBrandName"
              label="Asset Brand"
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
              focused
            />
            <RHFTextField
              name="assetModelName"
              label="Asset Model"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="serialNumber"
              label="Serial Number"
              inputProps={{ readOnly: true }}
              focused
            />
            <RHFTextField
              name="manufacturer"
              label="Manufacturer"
              inputProps={{ readOnly: true }}
              focused
            />
            <RHFTextField
              name="purchaseDate"
              label="Purchase Date"
              focused
              value={
                defaultValues.purchaseDate &&
                isValid(new Date(defaultValues.purchaseDate))
                  ? format(new Date(defaultValues.purchaseDate), dateFormat)
                  : ""
              }
              inputProps={{ readOnly: true }}
            />
            <RHFTextField
              name="cost"
              label="Cost"
              inputProps={{ readOnly: true }}
              focused
              value={defaultValues.cost || ""}
            />
            <RHFTextField
              name="guaranteeInformation"
              label="Guarantee Information"
              inputProps={{ readOnly: true }}
              focused
              value={defaultValues.guaranteeInformation || ""}
            />
            <RHFTextField
              name="maintenanceSchedule"
              label="Maintenance Schedule"
              focused
              value={
                defaultValues.maintenanceSchedule &&
                isValid(new Date(defaultValues.maintenanceSchedule))
                  ? format(
                      new Date(defaultValues.maintenanceSchedule),
                      dateFormat
                    )
                  : ""
              }
              inputProps={{ readOnly: true }}
            />
            <RHFTextField
              name="additionalNotes"
              label="Additional Notes"
              inputProps={{ readOnly: true }}
              focused
              multiline
              maxRows={3}
              sx={{
                ...scrollBarDefault,
              }}
            />
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
            InputLabelProps={
              defaultValues.createdBy ? { shrink: true } : { shrink: false }
            }
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
            InputLabelProps={
              defaultValues.creationDate ? { shrink: true } : { shrink: false }
            }
          />
          <RHFTextField
            name="modifiedBy"
            label="Modified By"
            inputProps={{ readOnly: true }}
            focused
            sx={cursorTextDefault}
            InputLabelProps={
              defaultValues.modifiedBy ? { shrink: true } : { shrink: false }
            }
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
    </FormProvider>
  );
}
