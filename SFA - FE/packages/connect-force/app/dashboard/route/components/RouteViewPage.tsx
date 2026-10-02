import { RHFTextField } from "@/components/hook-form";
import FormProvider from "@/components/hook-form/FormProvider";
import { Route } from "@/types/route-types";
import {
  Typography,
  Box,
  Grid,
  AccordionSummary,
  Accordion,
} from "@mui/material";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  cursorPointerDefault,
  cursorTextDefault,
  scrollBarDefault,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { RouteDTO } from "connect-force-api-client";
import { format, isValid } from "date-fns";
import StatusChip from "@/components/color-chip/Chip";

type props = {
  currentRoute: RouteDTO | undefined;
};

export type FormValuesProps = {
  routeId?: string | null;
  routeName?: string | null;
  description?: string | null;
  startPoint?: string | null;
  endPoint?: string | null;
  distance?: string | number | null;
  estimateTime?: string | number | null;
  createdBy?: string | number | null;
  modifiedBy?: string | number | null;
  creationDate?: string | Date | null;
  modifiedDate?: string | Date | null;
  status?: string | boolean | null;
};

export default function RouteView({ currentRoute }: props) {
  const dateFormat = process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy";

  const defaultValues = useMemo(
    () => ({
      routeId: currentRoute?.routeId || "",
      routeName: currentRoute?.routeName || "",
      description: currentRoute?.description || "",
      startPoint: currentRoute?.startPoint || "",
      endPoint: currentRoute?.endPoint || "",
      distance: currentRoute?.distance || "",
      estimateTime: currentRoute?.estimateTime || "",
      createdBy: currentRoute?.createdBy || "ADMIN",
      modifiedBy: currentRoute?.modifiedBy || "ADMIN",
      creationDate: currentRoute?.creationDate || "",
      modifiedDate: currentRoute?.modifiedDate || "",
      status: currentRoute?.active || "",
    }),
    [currentRoute]
  );

  useEffect(() => {
    reset(defaultValues);
  }, [currentRoute]);

  const methods = useForm<FormValuesProps>({
    defaultValues,
  });

  const { reset } = methods;

  return (
    <FormProvider methods={methods}>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <StatusChip status={currentRoute?.active} />
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
            aria-controls="Route"
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
              Route Details
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
              name="routeId"
              label="Code"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="routeName"
              label="Name"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="startPoint"
              label="Start Point"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="endPoint"
              label="End Point"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="distance"
              label="Distance"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.distance ? { shrink: true } : { shrink: false }
              }
            />

            <RHFTextField
              name="estimateTime"
              label="Estimate Time"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.estimateTime
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
            <RHFTextField
              name="description"
              label="Description"
              multiline
              maxRows={3}
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
            InputLabelProps={
              defaultValues.modifiedDate ? { shrink: true } : { shrink: false }
            }
            sx={cursorTextDefault}
          />
        </Box>
      </Grid>
    </FormProvider>
  );
}
