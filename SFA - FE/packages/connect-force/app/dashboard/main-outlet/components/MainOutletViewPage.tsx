import StatusChip from "@/components/color-chip/Chip";
import { RHFCheckbox, RHFTextField } from "@/components/hook-form";
import FormProvider from "@/components/hook-form/FormProvider";
import {
  cursorTextDefault,
  scrollBarDefault,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { MainOutlet } from "@/types/main-outlet-types";
import { Outlet } from "@/types/outlet-types";
import {
  Accordion,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { OutletFormValuesProps } from "connect-force-api-client/models/outlet";
import { format, isValid } from "date-fns";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

type Props = {
  currentMainOutlet?: MainOutlet | undefined;
};

export default function MainOutletView({ currentMainOutlet }: Props) {
  const dateFormat = process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy";

  const defaultValues = useMemo(
    () => ({
      // @ts-ignore
      outletID: currentMainOutlet?.outletID ?? null,
      name: currentMainOutlet?.name ?? null,
      address:
        [
          currentMainOutlet?.address,
          currentMainOutlet?.addressLine1,
          currentMainOutlet?.addressLine2,
        ]
          .filter(Boolean)
          .join(", ") || null,
      motherCompanyAddress:
        [
          currentMainOutlet?.motherCompanyAddress,
          currentMainOutlet?.motherCompanyAddressLine1,
          currentMainOutlet?.motherCompanyAddressLine2,
        ]
          .filter(Boolean)
          .join(", ") || null,
      contactNo: currentMainOutlet?.contactNo ?? null,
      ownerName: currentMainOutlet?.ownerName ?? null,
      ownerNIC: currentMainOutlet?.ownerNIC ?? null,
      ownerContactNo: currentMainOutlet?.ownerContactNo ?? null,
      brNo: currentMainOutlet?.brNo ?? null,
      vatNo: currentMainOutlet?.vatNo ?? null,
      createdDate: currentMainOutlet?.creationDate ?? null,
      active: currentMainOutlet?.active == true ? "Active" : "Inactive",
      modifiedBy: currentMainOutlet?.modifiedBy || "ADMIN",
      modifiedDate: currentMainOutlet?.modifiedDate ?? null,
      createdBy: currentMainOutlet?.createdBy || "ADMIN",
    }),
    [currentMainOutlet]
  );

  useEffect(() => {
    reset(defaultValues);
  }, [currentMainOutlet]);

  const methods = useForm<OutletFormValuesProps>({
    defaultValues,
  });

  const { reset } = methods;

  return (
    <FormProvider methods={methods}>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <StatusChip status={currentMainOutlet?.active} />
      </Box>
      <Grid item xs={12} sx={{ mt: 2, mb: 5 }}>
        {/* Distributor details */}
        <Accordion
          expanded={true}
          sx={{
            mb: 2,
            border: "1px solid #BDC1E4",
            borderRadius: "9px",
          }}
        >
          <AccordionSummary
            aria-controls="Main Outlet Details"
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
              sx={{ ml: 6, mb: 2, fontWeight: 500 }}
            >
              Main Outlet Details
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
              name="outletID"
              label="Parent Outlet Code"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="name"
              label="Name"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="address"
              label="Address"
              focused
              inputProps={{ readOnly: true }}
              multiline
              maxRows={3}
              sx={{
                ...scrollBarDefault,
              }}
            />
            <RHFTextField
              name="contactNo"
              label="Contact No"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />

            <RHFTextField
              name="brNo"
              label="Business Registration Number"
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.brNo ? { shrink: true } : { shrink: false }
              }
              focused
              inputProps={{ readOnly: true }}
            />
            <RHFTextField
              name="vatNo"
              label="VAT Number"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.vatNo ? { shrink: true } : { shrink: false }
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
          {/* owner details */}
          <AccordionSummary
            aria-controls="Outlet Creation"
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
              sx={{ ml: 6, mb: 2, fontWeight: 500 }}
            >
              Owner Details
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
              name="motherCompanyAddress"
              label="Mother Company Address"
              focused
              inputProps={{ readOnly: true }}
              InputLabelProps={
                defaultValues.motherCompanyAddress
                  ? { shrink: true }
                  : { shrink: false }
              }
              multiline
              maxRows={3}
              sx={{
                ...scrollBarDefault,
              }}
            />
            <RHFTextField
              name="ownerName"
              label="Owner Name"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.ownerName ? { shrink: true } : { shrink: false }
              }
            />
            <RHFTextField
              name="ownerNIC"
              label="Owner NIC"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.ownerNIC ? { shrink: true } : { shrink: false }
              }
            />
            <RHFTextField
              name="ownerContactNo"
              label="Owner Telephone Number"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.ownerContactNo
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
            InputLabelProps={
              defaultValues.createdBy ? { shrink: true } : { shrink: false }
            }
          />
          <RHFTextField
            name="createdDate"
            label="Created Date"
            inputProps={{ readOnly: true }}
            focused
            value={
              defaultValues.createdDate &&
              isValid(new Date(defaultValues.createdDate))
                ? format(new Date(defaultValues.createdDate), dateFormat)
                : ""
            }
            sx={cursorTextDefault}
            InputLabelProps={
              defaultValues.createdDate ? { shrink: true } : { shrink: false }
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
