import StatusChip from "@/components/color-chip/Chip";
import FormProvider, { RHFTextField } from "@/components/hook-form";
import { cursorTextDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { UserProfileResponse } from "@/types/user-management/user-profile-types";
import {
  Accordion,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { isValid, format } from "date-fns";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

type props = {
  currentUserProfile: UserProfileResponse | undefined;
};

export default function UserProfileViewPage({ currentUserProfile }: props) {
  const dateFormat = process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy";
  const defaultValues = useMemo(() => {
    const formattedDOB =
      currentUserProfile?.profile?.dob &&
      isValid(new Date(currentUserProfile.profile.dob))
        ? format(new Date(currentUserProfile.profile.dob), "yyyy-MM-dd")
        : "";
    const formattedAppointedDate =
      currentUserProfile?.profile?.appointedDate &&
      isValid(new Date(currentUserProfile.profile.appointedDate))
        ? format(
            new Date(currentUserProfile.profile.appointedDate),
            "yyyy-MM-dd"
          )
        : "";
    return {
      userDetailsUId: currentUserProfile?.userDetailsUId ?? 0,
      userName: currentUserProfile?.userName ?? "",
      profile: {
        userProfileUId: currentUserProfile?.profile?.userProfileUId ?? 0,
        firstName: currentUserProfile?.profile?.firstName ?? "",
        lastName: currentUserProfile?.profile?.lastName ?? "",
        dob: formattedDOB,
        nic: currentUserProfile?.profile?.nic ?? "",
        address: currentUserProfile?.profile?.address ?? "",
        addressLine2: currentUserProfile?.profile?.addressLine2 ?? "",
        mobileNumber: currentUserProfile?.profile?.mobileNumber ?? "",
        email: currentUserProfile?.profile?.email ?? "",
        emergencyContactName:
          currentUserProfile?.profile?.emergencyContactName ?? "",
        emergencyContactNumber:
          currentUserProfile?.profile?.emergencyContactNumber ?? "",
        employeeID: currentUserProfile?.profile?.employeeID ?? "",
        designation: currentUserProfile?.profile?.designation ?? "",
        epF_ETF_Number: currentUserProfile?.profile?.epF_ETF_Number ?? "",
        appointedDate: formattedAppointedDate,
        userName: currentUserProfile?.profile?.userName ?? "",
      },
    };
  }, [currentUserProfile, dateFormat]);

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserProfile]);

  const methods = useForm<UserProfileResponse>({
    defaultValues,
  });

  const { reset } = methods;

  return (
    <FormProvider methods={methods}>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <StatusChip status={currentUserProfile?.active} />
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
            aria-controls="User Profile Details"
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
              Personal Information
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
              name="profile.firstName"
              label="First Name"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.profile?.firstName
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
            <RHFTextField
              name="profile.lastName"
              label="Last Name"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.profile?.lastName
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
            <RHFTextField
              name="profile.dob"
              label="Date of Birth"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.profile?.dob
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
            <RHFTextField
              name="profile.nic"
              label="NIC"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.profile?.nic
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
            <RHFTextField
              name="profile.address"
              label="Address Line 1"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.profile?.address
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
            <RHFTextField
              name="profile.addressLine2"
              label="Address Line 2"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.profile?.addressLine2
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
          </Box>
        </Accordion>
        {/* ----------Contact Information---------- */}
        <Accordion
          expanded={true}
          sx={{
            mb: 2,
            border: "1px solid #BDC1E4",
            borderRadius: "9px",
          }}
        >
          <AccordionSummary
            aria-controls="User Profile Details"
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
              Contact Information
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
              name="profile.mobileNumber"
              label="Mobile Number"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.profile?.mobileNumber
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
            <RHFTextField
              name="profile.email"
              label="E-mail"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.profile?.email
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
            <RHFTextField
              name="profile.emergencyContactName"
              label="Emergency Contact Person Name"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.profile?.emergencyContactName
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
            <RHFTextField
              name="profile.emergencyContactNumber"
              label="Emergency Contact Person Number"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.profile?.emergencyContactNumber
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
          </Box>
        </Accordion>
        {/* ----------Employment Information---------- */}
        <Accordion
          expanded={true}
          sx={{
            mb: 2,
            border: "1px solid #BDC1E4",
            borderRadius: "9px",
          }}
        >
          <AccordionSummary
            aria-controls="User Profile Details"
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
              Employment Information
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
              name="profile.employeeID"
              label="Employee ID"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.profile?.employeeID
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
            <RHFTextField
              name="profile.designation"
              label="Designation"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.profile?.designation
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
            <RHFTextField
              name="profile.epF_ETF_Number"
              label="EPF/ETF Number"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.profile?.epF_ETF_Number
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
            <RHFTextField
              name="profile.appointedDate"
              label="Appointed Date"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.profile?.appointedDate
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
          </Box>
        </Accordion>
        {/* ----------Account Details---------- */}
        <Accordion
          expanded={true}
          sx={{
            mb: 2,
            border: "1px solid #BDC1E4",
            borderRadius: "9px",
          }}
        >
          <AccordionSummary
            aria-controls="User Profile Details"
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
              Account Details
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
              name="userName"
              label="User Name"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.userName ? { shrink: true } : { shrink: false }
              }
            />
          </Box>
        </Accordion>
      </Grid>
    </FormProvider>
  );
}
