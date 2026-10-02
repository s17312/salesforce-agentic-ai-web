import StatusChip from "@/components/color-chip/Chip";
import { RHFTextField } from "@/components/hook-form";
import FormProvider from "@/components/hook-form/FormProvider";
import {
  cursorTextDefault,
  scrollBarDefault,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { FormValuesPropsVehicle, Vehicle } from "@/types/vehicle-types";
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
  currentVehicle: Vehicle | undefined;
};

export default function VehicleView({ currentVehicle }: props) {
  const dateFormat = process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy";

  const defaultValues = useMemo(
    () => ({
      vehicleID: currentVehicle?.vehicleID || "",
      plateNumber: currentVehicle?.plateNumber || "",
      yearOfManufacture: currentVehicle?.yearOfManufacture || "",
      insuranceDetails: currentVehicle?.insuranceDetails || "",
      insuranceRegisterDate: currentVehicle?.insuranceRegisterDate || null,
      insuranceExpiryDate: currentVehicle?.insuranceExpiryDate || null,
      vehicleCategoryName: currentVehicle?.vehicleCategory?.category || "",
      createdBy: currentVehicle?.createdBy || "ADMIN",
      creationDate: currentVehicle?.creationDate || "",
      modifiedBy: currentVehicle?.modifiedBy || "ADMIN",
      modifiedDate: currentVehicle?.modifiedDate || "",
      distributorName: currentVehicle?.distributor?.distributorName || "",
      representativeName: currentVehicle?.representative?.name || "",
    }),
    [currentVehicle]
  );

  useEffect(() => {
    reset(defaultValues);
  }, [currentVehicle]);

  const methods = useForm<FormValuesPropsVehicle>({
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
        <StatusChip status={currentVehicle?.active} />
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
            aria-controls="Vehicle"
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
              Vehicle Details
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
              name="vehicleID"
              label="Code"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="plateNumber"
              label="Plate Number"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="vehicleCategoryName"
              label="Vehicle Category"
              focused
              sx={cursorTextDefault}
              inputProps={{ readOnly: true }}
            />
            <RHFTextField
              name="yearOfManufacture"
              label="Year of Manufacture"
              focused
              sx={cursorTextDefault}
              inputProps={{ readOnly: true }}
            />
            <RHFTextField
              name="insuranceRegisterDate"
              label="Insurance Register Date"
              focused
              value={
                defaultValues.insuranceRegisterDate &&
                isValid(new Date(defaultValues.insuranceRegisterDate))
                  ? format(
                      new Date(defaultValues.insuranceRegisterDate),
                      dateFormat
                    )
                  : ""
              }
              inputProps={{ readOnly: true }}
            />
            <RHFTextField
              name="insuranceExpiryDate"
              label="Insurance Expiry Date"
              focused
              value={
                defaultValues.insuranceExpiryDate &&
                isValid(new Date(defaultValues.insuranceExpiryDate))
                  ? format(
                      new Date(defaultValues.insuranceExpiryDate),
                      dateFormat
                    )
                  : ""
              }
              inputProps={{ readOnly: true }}
            />
            <RHFTextField
              name="insuranceDetails"
              label="Insurance Details"
              inputProps={{ readOnly: true }}
              focused={true}
              sx={{
                ...scrollBarDefault,
              }}
              InputLabelProps={
                defaultValues.insuranceDetails
                  ? { shrink: true }
                  : { shrink: false }
              }
              multiline
              maxRows={3}
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
            aria-controls="Vehicle"
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
              Vehicle Assigned
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
              name="distributorName"
              label="Distributor"
              focused
              sx={cursorTextDefault}
              inputProps={{ readOnly: true }}
            />
            <RHFTextField
              name="representativeName"
              label="Representative"
              focused
              sx={cursorTextDefault}
              inputProps={{ readOnly: true }}
              InputLabelProps={
                defaultValues.representativeName
                  ? { shrink: true }
                  : { shrink: false }
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
