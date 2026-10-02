"use client";

import StatusChip from "@/components/color-chip/Chip";
import { RHFTextField } from "@/components/hook-form";
import FormProvider from "@/components/hook-form/FormProvider";
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
import { OutletCategoryDTO } from "connect-force-api-client";
import { format, isValid } from "date-fns";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

type props = {
  currentOutletCategory: OutletCategoryDTO | undefined;
};

export type FormValuesProps = {
  outletCategoryId?: string | null;
  outletCategoryName?: string | null;
  description?: string | null;
};

export default function OutletCategoryView({ currentOutletCategory }: props) {
  const dateFormat = process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy";

  const defaultValues = useMemo(
    () => ({
      outletCategoryId: currentOutletCategory?.outletCategoryId || null,
      outletCategoryName: currentOutletCategory?.outletCategoryName || null,
      description: currentOutletCategory?.description || null,
      creationDate: currentOutletCategory?.creationDate || null,
      active: currentOutletCategory?.active == true ? "Active" : "Inactive",
      modifiedBy: currentOutletCategory?.modifiedBy || "ADMIN",
      modifiedDate: currentOutletCategory?.modifiedDate || "",
      createdBy: currentOutletCategory?.createdBy || "ADMIN",
    }),
    [currentOutletCategory]
  );

  useEffect(() => {
    reset(defaultValues);
  }, [currentOutletCategory]);

  const methods = useForm<FormValuesProps>({
    defaultValues,
  });

  const { reset } = methods;

  return (
    <FormProvider methods={methods}>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <StatusChip status={currentOutletCategory?.active} />
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
            aria-controls="Outlet Category"
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
              Outlet Category Details
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
              name="outletCategoryId"
              label="Code"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="outletCategoryName"
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
              inputProps={{ readOnly: true }}
              focused
              sx={{
                ...scrollBarDefault,
              }}
              InputLabelProps={
                defaultValues.description ? { shrink: true } : { shrink: false }
              }
            />
          </Box>
        </Accordion>
      </Grid>
      <Grid item xs={12} sx={{ mb: 3 }}>
        <Box
          sx={{ mx: 12, mb: 3 }}
          rowGap={3}
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
    </FormProvider>
  );
}
