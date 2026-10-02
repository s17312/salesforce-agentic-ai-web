import StatusChip from "@/components/color-chip/Chip";
import FormProvider, {
  RHFCheckbox,
  RHFTextField,
} from "@/components/hook-form";
import { cursorTextDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { FormValuesPropsSalesUnitType } from "@/types/sales-unit-type-types";
import {
  Box,
  Grid,
  Accordion,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { format, isValid } from "date-fns";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

type Props = {
  currentSalesUnitType: FormValuesPropsSalesUnitType | undefined;
};

export default function SalesUnitTypeViewPage({ currentSalesUnitType }: Props) {
  const dateFormat = process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy";
  const defaultValues = useMemo(
    () => ({
      unitId: currentSalesUnitType?.unitId || "",
      unitName: currentSalesUnitType?.unitName || "",
      description: currentSalesUnitType?.description || "",
      isBaseUnit: currentSalesUnitType?.isBaseUnit || undefined,
      baseUnitId: currentSalesUnitType?.baseUnitId || null,
      detailedName: currentSalesUnitType?.detailedName || "",
      baseUnitName: currentSalesUnitType?.baseUnitName || "",
      totQty: currentSalesUnitType?.totQty || null,
      ratio: currentSalesUnitType?.ratio || null,
      createdBy: currentSalesUnitType?.createdBy || "ADMIN",
      modifiedBy: currentSalesUnitType?.modifiedBy || "ADMIN",
      creationDate: currentSalesUnitType?.creationDate || "",
      modifiedDate: currentSalesUnitType?.modifiedDate || "",
    }),
    [currentSalesUnitType]
  );

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSalesUnitType]);

  const methods = useForm<FormValuesPropsSalesUnitType>({
    defaultValues,
  });

  const { reset, watch } = methods;

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSalesUnitType, defaultValues, reset]);

  const isBaseUnit = watch("isBaseUnit");

  return (
    <FormProvider methods={methods}>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <StatusChip status={currentSalesUnitType?.active} />
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
            aria-controls="Sales Unit Type Details"
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
              Sales Unit Type Details
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
              name="unitId"
              label="Code"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.unitId ? { shrink: true } : { shrink: false }
              }
            />
            <RHFTextField
              name="unitName"
              label="Name"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.unitName ? { shrink: true } : { shrink: false }
              }
            />
            <RHFTextField
              name="description"
              label="Description"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.description ? { shrink: true } : { shrink: false }
              }
            />
            <RHFCheckbox name="isBaseUnit" label="Base Unit" disabled />
            {!isBaseUnit ? (
              <RHFTextField
                name="baseUnitName"
                label="Base Unit"
                inputProps={{ readOnly: true }}
                focused
                sx={cursorTextDefault}
                InputLabelProps={
                  defaultValues.baseUnitName
                    ? { shrink: true }
                    : { shrink: false }
                }
              />
            ) : null}
            <RHFTextField
              name="ratio"
              label="Quantity"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.ratio ? { shrink: true } : { shrink: false }
              }
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
