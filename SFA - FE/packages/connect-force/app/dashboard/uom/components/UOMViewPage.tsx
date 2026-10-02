import StatusChip from "@/components/color-chip/Chip";
import { RHFCheckbox, RHFTextField } from "@/components/hook-form";
import FormProvider from "@/components/hook-form/FormProvider";
import {
  cursorTextDefault,
  scrollBarDefault,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { ViewUOM } from "@/types/uom-types";
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
  currentUOM: ViewUOM | undefined;
};

export type FormValuesProps = {
  uomId?: string | null;
  shortName?: string | null;
  description?: string | null;
  isNotBaseUnit?: boolean | null;
  baseUnitUId?: number | null;
  count?: number | null;
};

export default function UOMView({ currentUOM }: props) {
  const dateFormat = process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy";
  const defaultValues = useMemo(
    () => ({
      uomId: currentUOM?.uomId || "",
      shortName: currentUOM?.shortName || "",
      description: currentUOM?.description || "",
      isNotBaseUnit: currentUOM?.isNotBaseUnit || false,
      baseUnitUId: currentUOM?.baseUnitUId || null,
      baseUnit: currentUOM?.baseUOM?.shortName || "",
      count: currentUOM?.count || null,
      createdBy: currentUOM?.createdBy || "ADMIN",
      modifiedBy: currentUOM?.modifiedBy || "ADMIN",
      creationDate: currentUOM?.creationDate || "",
      modifiedDate: currentUOM?.modifiedDate || "",
    }),
    [currentUOM]
  );

  const methods = useForm<FormValuesProps>({
    defaultValues,
  });

  const { reset, watch } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [currentUOM, reset, defaultValues]);

  let isNotBaseUnitGetValue = watch("isNotBaseUnit");

  return (
    <FormProvider methods={methods}>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <StatusChip status={currentUOM?.active} />
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
            aria-controls="Unit of Measurement"
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
              Unit of Measurement Details
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
              name="uomId"
              label="Code"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="shortName"
              label="Name"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="description"
              label="Description"
              inputProps={{ readOnly: true }}
              focused
              multiline
              maxRows={3}
              InputLabelProps={
                defaultValues.description ? { shrink: true } : { shrink: false }
              }
              sx={{
                ...scrollBarDefault,
              }}
            />
            <RHFCheckbox name="isNotBaseUnit" label="Not Base Unit" disabled />
          </Box>
        </Accordion>
        {isNotBaseUnitGetValue ? (
          <Accordion
            expanded={true}
            sx={{
              mb: 2,
              border: "1px solid #BDC1E4",
              borderRadius: "9px",
            }}
          >
            <AccordionSummary
              aria-controls="Unit of Measurement"
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
                Details
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
                name="baseUnit"
                label="Base Unit"
                inputProps={{ readOnly: true }}
                focused
                sx={cursorTextDefault}
              />
              <RHFTextField
                name="count"
                label="Ratio"
                inputProps={{ readOnly: true }}
                focused
                sx={cursorTextDefault}
              />
            </Box>
          </Accordion>
        ) : null}
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
