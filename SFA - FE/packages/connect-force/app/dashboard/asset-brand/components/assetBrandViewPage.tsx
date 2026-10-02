import StatusChip from "@/components/color-chip/Chip";
import { RHFTextField } from "@/components/hook-form";
import FormProvider from "@/components/hook-form/FormProvider";
import {
  cursorTextDefault,
  scrollBarDefault,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { FormValuesPropsAssetBrand } from "@/types/assetBrand-types";
import {
  Accordion,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { format, isValid } from "date-fns";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

type props = {
  currentAssetBrand: FormValuesPropsAssetBrand | undefined;
};

export default function AssetBrandViewPage({ currentAssetBrand }: props) {
  const dateFormat = process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy";
  const defaultValues = useMemo(
    () => ({
      assetBrandId: currentAssetBrand?.assetBrandId || null,
      assetBrandName: currentAssetBrand?.assetBrandName || null,
      description: currentAssetBrand?.description || null,
      createdBy: currentAssetBrand?.createdBy || "ADMIN",
      modifiedBy: currentAssetBrand?.modifiedBy || "ADMIN",
      creationDate: currentAssetBrand?.creationDate || "",
      modifiedDate: currentAssetBrand?.modifiedDate || "",
    }),
    [currentAssetBrand]
  );

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAssetBrand]);

  const methods = useForm<FormValuesPropsAssetBrand>({
    defaultValues,
  });

  const { reset } = methods;

  return (
    <FormProvider methods={methods}>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <StatusChip status={currentAssetBrand?.active} />
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
            aria-controls="Asset Brand Details"
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
              Asset Brand Details
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
              name="assetBrandId"
              label="Code"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.assetBrandId
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
            <RHFTextField
              name="assetBrandName"
              label="Name"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.assetBrandName
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
            <RHFTextField
              name="description"
              label="Description"
              inputProps={{ readOnly: true }}
              focused={true}
              sx={{
                ...scrollBarDefault,
              }}
              InputLabelProps={
                defaultValues.description ? { shrink: true } : { shrink: false }
              }
              multiline
              maxRows={3}
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
