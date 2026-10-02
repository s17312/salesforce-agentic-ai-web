import StatusChip from "@/components/color-chip/Chip";
import { RHFCheckbox, RHFTextField } from "@/components/hook-form";
import FormProvider from "@/components/hook-form/FormProvider";
import {
  cursorTextDefault,
  scrollBarDefault,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import type { OutletView } from "@/types/outlet-types";
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
  currentOutlet?: any | undefined;
};

export default function OutletView({ currentOutlet }: Props) {
  const dateFormat = process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy";

  const defaultValues = useMemo(
    () => ({
      // parentOutletUId: `${currentOutlet?.mainOutlet?.outletID} - ${currentOutlet?.mainOutlet?.name}` ?? null,
      outletID: currentOutlet?.outletID ?? null,
      name: currentOutlet?.name ?? null,
      address:
        [
          currentOutlet?.address,
          currentOutlet?.addressLine1,
          currentOutlet?.addressLine2,
        ]
          .filter(Boolean)
          .join(", ") || null,
      motherCompanyAddress:
        [
          currentOutlet?.motherCompanyAddress,
          currentOutlet?.motherCompanyAddressLine1,
          currentOutlet?.motherCompanyAddressLine2,
        ]
          .filter(Boolean)
          .join(", ") || null,
      provinceUId: currentOutlet?.provinceUId ?? null,
      province: currentOutlet?.province?.nameEN ?? null,
      districtUId: currentOutlet?.districtUId ?? null,
      district: currentOutlet?.district?.name_en ?? null,
      townUId: currentOutlet?.cityUId ?? null,
      city: currentOutlet?.city?.name_en ?? null,
      contactNo1CountryCode: currentOutlet?.contactNo1CountryCode ?? null,
      contactNo2CountryCode: currentOutlet?.contactNo2CountryCode ?? null,
      contactNo1: currentOutlet?.contactNo1 ?? null,
      contactNo2: currentOutlet?.contactNo2 ?? null,
      outletCategoryUId: currentOutlet?.outletCategoryUId ?? null,
      outletCategory: currentOutlet?.outletCategory?.outletCategoryName ?? null,
      outletClassificationUId: currentOutlet?.outletClassificationUId ?? null,
      outletClassification:
        currentOutlet?.outletClassification?.classification ?? null,
      outletStatusUId: currentOutlet?.outletStatusUId ?? null,
      outletStatus: currentOutlet?.outletStatus?.statusName ?? null,
      ownerName: currentOutlet?.ownerName ?? null,
      ownerNIC: currentOutlet?.ownerNIC ?? null,
      ownerContactNoCountryCode:
        currentOutlet?.ownerContactNoCountryCode ?? null,
      ownerContactNo: currentOutlet?.ownerContactNo ?? null,
      brNo: currentOutlet?.brNo ?? null,
      vatNo: currentOutlet?.vatNo ?? null,
      lat: currentOutlet?.lat ?? null,
      long: currentOutlet?.long ?? null,
      qrCode: currentOutlet?.qrCode ?? null,
      isExclusive: currentOutlet?.isExclusive ?? false,
      exclusiveRemark: currentOutlet?.exclusiveRemark ?? null,
      paymentModeUId: currentOutlet?.paymentModeUId ?? null,
      paymentMode: currentOutlet?.paymentMode?.paymentModeType ?? null,
      isDiscountEligible: currentOutlet?.isDiscountEligible ?? false,
      creditLimit: currentOutlet?.creditLimit ?? null,
      creditInvoiceLimit: currentOutlet?.creditInvoiceLimit ?? null,
      creditDays: currentOutlet?.creditDays ?? null,
      additionalNotes: currentOutlet?.additionalNotes ?? null,
      isAssetAvailable: currentOutlet?.isAssetAvailable ?? false,
      createdDate: currentOutlet?.creationDate ?? null,
      active: currentOutlet?.active == true ? "Active" : "Inactive",
      modifiedBy: currentOutlet?.modifiedBy || "ADMIN",
      modifiedDate: currentOutlet?.modifiedDate ?? null,
      createdBy: currentOutlet?.createdBy || "ADMIN",
    }),
    [currentOutlet]
  );

  useEffect(() => {
    reset(defaultValues);
  }, [currentOutlet]);

  const methods = useForm<OutletFormValuesProps>({
    defaultValues,
  });

  const { reset } = methods;

  return (
    <FormProvider methods={methods}>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <StatusChip status={currentOutlet?.active} />
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
              Outlet Details
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
              name="parentOutletUId"
              label="Parent Outlet"
              focused
              inputProps={{ readOnly: true }}
              value={
                currentOutlet?.mainOutlet
                  ? `${currentOutlet?.mainOutlet?.outletID} - ${currentOutlet?.mainOutlet?.name}`
                  : ""
              }
              InputLabelProps={
                currentOutlet?.parentOutletUId
                  ? { shrink: true }
                  : { shrink: false }
              }
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="outletID"
              label="Outlet ID"
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
              name="province"
              label="Province"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="district"
              label="District"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="city"
              label="Town"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="contactNo1"
              label="Contact No 1"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="contactNo2"
              label="Contact No 2"
              InputLabelProps={
                defaultValues.contactNo2 ? { shrink: true } : { shrink: false }
              }
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
            <RHFTextField
              name="outletCategory"
              label="Outlet Category"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.outletCategory
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
            <RHFTextField
              name="outletClassification"
              label="Outlet Classification"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.outletClassification
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
            <RHFTextField
              name="brNo"
              label="BR Number"
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
            <RHFTextField
              name="lat"
              label="Latitude"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.lat ? { shrink: true } : { shrink: false }
              }
            />
            <RHFTextField
              name="long"
              label="Logitude"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.long ? { shrink: true } : { shrink: false }
              }
            />
            <RHFTextField
              name="qrCode"
              label="QR Code"
              InputLabelProps={
                defaultValues.qrCode ? { shrink: true } : { shrink: false }
              }
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
            <RHFCheckbox name="isExclusive" label="Is Exclusive" disabled />
            <RHFTextField
              name="exclusiveRemark"
              label="Exclusive Remark"
              focused
              inputProps={{ readOnly: true }}
              multiline
              InputLabelProps={
                defaultValues.exclusiveRemark
                  ? { shrink: true }
                  : { shrink: false }
              }
              maxRows={3}
              sx={{
                ...scrollBarDefault,
              }}
            />
            <RHFTextField
              name="outletStatus"
              label="Outlet Status"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.outletStatus
                  ? { shrink: true }
                  : { shrink: false }
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
              label="Owner Contact No"
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

        {/* Other details */}
        <Accordion
          expanded={true}
          sx={{
            mb: 2,
            border: "1px solid #BDC1E4",
            borderRadius: "9px",
          }}
        >
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
              Additional Details
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
              name="paymentMode"
              label="Payment Mode"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
            />
            <RHFCheckbox
              name="isDiscountEligible"
              label="Is Discount Eligible"
              disabled
            />
            <RHFTextField
              name="creditLimit"
              label="Credit Limit"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.creditLimit ? { shrink: true } : { shrink: false }
              }
            />
            <RHFTextField
              name="creditInvoiceLimit"
              label="Credit Invoice Limit"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.creditInvoiceLimit
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
            <RHFTextField
              name="creditDays"
              label="Credit Days"
              focused
              inputProps={{ readOnly: true }}
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.creditDays ? { shrink: true } : { shrink: false }
              }
            />
            <RHFTextField
              name="additionalNotes"
              label="Additional Notes"
              focused
              inputProps={{ readOnly: true }}
              InputLabelProps={
                defaultValues.additionalNotes
                  ? { shrink: true }
                  : { shrink: false }
              }
              multiline
              maxRows={3}
              sx={{
                ...scrollBarDefault,
              }}
            />
            <RHFCheckbox
              name="isAssetAvailable"
              label="Is Asset Available"
              disabled
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
