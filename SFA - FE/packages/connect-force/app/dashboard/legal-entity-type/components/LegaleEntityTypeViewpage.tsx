"use client";

import StatusChip from "@/components/color-chip/Chip";
import FormProvider from "@/components/hook-form/FormProvider";
import RHFTextField from "@/components/hook-form/RHFTextField";
import {
  cursorTextDefault,
  scrollBarDefault
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  Accordion,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { LegalEntryTypeDTO } from "connect-force-api-client/models/legal-entry-type-dto";
import { format, isValid } from "date-fns";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

type Props = {
  currentLegalEntityType?: LegalEntryTypeDTO | undefined;
};

type FormValuesProps = {
  legalEntryTypeId?: string;
  legalEntryTypeName?: string;
  description?: string;
};

export default function LegalEntityTypeView({ currentLegalEntityType }: Props) {
  const dateFormat = process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy";
  const defaultValues = useMemo(
    () => ({
      legalEntryTypeId: currentLegalEntityType?.legalEntryTypeId || "",
      legalEntryTypeName: currentLegalEntityType?.legalEntryTypeName || "",
      description: currentLegalEntityType?.description || "",
      createdBy: currentLegalEntityType?.createdBy || "ADMIN",
      creationDate: currentLegalEntityType?.creationDate || "",
      modifiedBy: currentLegalEntityType?.modifiedBy || "ADMIN",
      modifiedDate: currentLegalEntityType?.modifiedDate || "",
    }),
    [currentLegalEntityType]
  );

  useEffect(() => {
    reset(defaultValues);
  }, [currentLegalEntityType]);

  const methods = useForm<FormValuesProps>({
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
        <StatusChip status={currentLegalEntityType?.active} />
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
            aria-controls="Legal Entity Type View"
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
              Legal Entity Type Details
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
              name="legalEntryTypeId"
              label="Code"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="legalEntryTypeName"
              label="Name"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="description"
              label="Description"
              multiline
              maxRows={3}
              placeholder="Description"
              focused={true}
              inputProps={{ readOnly: true }}
              InputLabelProps={
                defaultValues.description ? { shrink: true } : { shrink: false }
              }
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
          />
          <RHFTextField
            name="creationDate"
            label="Created Date"
            inputProps={{ readOnly: true }}
            focused
            sx={cursorTextDefault}
            value={
              defaultValues.creationDate &&
              isValid(new Date(defaultValues.creationDate))
                ? format(new Date(defaultValues.creationDate), dateFormat)
                : ""
            }
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
            sx={cursorTextDefault}
            value={
              defaultValues.modifiedDate &&
              isValid(new Date(defaultValues.modifiedDate))
                ? format(new Date(defaultValues.modifiedDate), dateFormat)
                : ""
            }
            InputLabelProps={
              defaultValues.modifiedDate ? { shrink: true } : { shrink: false }
            }
          />
        </Box>
      </Grid>
    </FormProvider>
  );
}
