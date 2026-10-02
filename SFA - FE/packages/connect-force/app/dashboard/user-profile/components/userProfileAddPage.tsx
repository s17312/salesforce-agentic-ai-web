import FormProvider, { RHFTextField } from "@/components/hook-form";
import {
  setUserProfileError,
  setUserProfileMessage,
} from "@/redux/slices/user-management/user-profile-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { createUserProfile } from "@/service/user-management/userProfile.service";
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  CreateUserProfilePayload,
  UserProfilePayload,
} from "@/types/user-management/user-profile-types";
import { userProfileCreateValidationSchema } from "@/utils/schemas/userProfileSchema";
import { LoadingButton } from "@mui/lab";
import { SaveIcon } from "@/components/icons/saveIcon";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import RHFDatePicker from "@/components/hook-form/RHFDatePicker";
import { yupResolver } from "@hookform/resolvers/yup";
import { RHFMuiPhone } from "@/components/hook-form/RHFMobileDropdown";

type Props = {
  currentUserProfile?: CreateUserProfilePayload | undefined;
};

export default function UserProfileAddPage({ currentUserProfile }: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [phoneNum, setPhoneNum] = useState("+94");
  const [emergencyContactPersonNumber, setEmergencyContactPersonNumber] =
    useState("+94");
  const [expand1, setExpand1] = useState(true);
  const [expand2, setExpand2] = useState(false);
  const [expand3, setExpand3] = useState(false);
  const [expand4, setExpand4] = useState(false);

  const defaultValues = useMemo(
    () => ({
      firstName: currentUserProfile?.firstName || "",
      lastName: currentUserProfile?.lastName || "",
      dob: currentUserProfile?.dob || null,
      nic: currentUserProfile?.nic || "",
      address: currentUserProfile?.address || "",
      addressLine2: currentUserProfile?.addressLine2 || "",
      mobileNumber: currentUserProfile?.mobileNumber || "",
      email: currentUserProfile?.email || "",
      emergencyContactName: currentUserProfile?.emergencyContactName || "",
      emergencyContactNumber: currentUserProfile?.emergencyContactNumber || "",
      employeeID: currentUserProfile?.employeeID || "",
      designation: currentUserProfile?.designation || "",
      epF_ETF_Number: currentUserProfile?.epF_ETF_Number || "",
      appointedDate: currentUserProfile?.appointedDate || null,
      userName: currentUserProfile?.userName || "",
      password: currentUserProfile?.password || "",
      confirmPassword: "",
    }),
    [currentUserProfile]
  );

  const responseMessage = useSelector(
    (state) => state.userProfileSlice.message
  );
  const responseError = useSelector((state) => state.userProfileSlice.error);

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserProfile]);

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setUserProfileMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setUserProfileError(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseMessage, responseError]);

  const methods = useForm<CreateUserProfilePayload>({
    //@ts-ignore
    resolver: yupResolver(userProfileCreateValidationSchema),
    defaultValues,
    mode: "all",
  });

  const { handleSubmit, reset, formState, setValue, control, setFocus } =
    methods;

  const scrollToElement = (element: HTMLElement | null) => {
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const onError = (errors: any) => {
    const firstErrorField: any = Object.keys(errors)[0];
    setFocus(firstErrorField);
    const errorElement = document.querySelector(
      `[name="${firstErrorField}"]`
    ) as HTMLElement;
    scrollToElement(errorElement);
  };

  const handleCreateUserProfile = async (data: CreateUserProfilePayload) => {
    try {
      await createUserProfile(data);
      reset(defaultValues);
      router.push(PATH_DASHBOARD.userProfile.list);
    } catch (error: any) {}
  };

  const handleReset = () => {
    reset(defaultValues);
    setPhoneNum("+94");
  };

  useEffect(() => {}, [formState.errors]);

  const handleClick = async () => {
    const isValid = await methods.trigger();
    if (!isValid) {
      const part1Fields: (keyof UserProfilePayload)[] = [
        "userDetailsUId",
        "firstName",
        "lastName",
        "dob",
        "address",
        "addressLine2",
      ];

      const part2Fields: (keyof UserProfilePayload)[] = [
        "mobileNumber",
        "email",
        "emergencyContactName",
        "emergencyContactNumber",
      ];

      const part3Fields: (keyof UserProfilePayload)[] = [
        "employeeID",
        "designation",
        "appointedDate",
        "epF_ETF_Number",
      ];

      const part4Fields: (keyof UserProfilePayload)[] = ["userName"];

      const currentErrors = methods.formState.errors;

      const part1Error = part1Fields.some((field) => currentErrors[field]);

      if (part1Error) {
        setExpand1(true);
      }
      const part2Error = part2Fields.some((field) => currentErrors[field]);

      if (part2Error) {
        setExpand2(true);
      }
      const part3Error = part3Fields.some((field) => currentErrors[field]);

      if (part3Error) {
        setExpand3(true);
      }
      const part4Error = part4Fields.some((field) => currentErrors[field]);

      if (part4Error) {
        setExpand4(true);
      }
    }
  };

  const handleSubmitClick = async () => {
    await handleClick();
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={handleSubmit(handleCreateUserProfile, onError)}
    >
      <Grid item xs={12} sx={{ mb: 3, position: "relative" }}>
        {/* ----------Personal Information---------- */}
        <Accordion
          expanded={expand1}
          onChange={() => setExpand1(!expand1)}
          sx={{
            mb: 2,
            border: "1px solid #BDC1E4",
            borderRadius: "9px",
          }}
        >
          <AccordionSummary
            aria-controls="User Profile Creation"
            id="panel1a-header"
            sx={{
              cursorDefault,
              flexDirection: "row-reverse",
              alignItems: "center",
            }}
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography variant="body1" sx={{ ml: 5, fontWeight: 500 }}>
              Personal Information
            </Typography>
          </AccordionSummary>

          <Box
            sx={{ mx: 12, mb: 3 }}
            rowGap={2}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            }}
          >
            <RHFTextField name="firstName" label="First Name*" />
            <RHFTextField name="lastName" label="Last Name*" />
            <RHFDatePicker
              name="dob"
              label="Date of Birth*"
              disableFuture={true}
              onChange={(date: any) => {
                setValue("dob", date);
              }}
              format={process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"}
              value={defaultValues.dob ? new Date(defaultValues.dob) : null}
              renderInput={(params) => <TextField {...params} />}
            />
            <RHFTextField name="nic" label="Personal ID Number*" />
            <RHFTextField name="address" label="Address Line 1*" />
            <RHFTextField name="addressLine2" label="Address Line 2" />
          </Box>
        </Accordion>
        {/* ----------Contact Information---------- */}
        <Accordion
          expanded={expand2}
          onChange={() => setExpand2(!expand2)}
          sx={{
            mb: 2,
            border: "1px solid #BDC1E4",
            borderRadius: "9px",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
            sx={{ flexDirection: "row-reverse", alignItems: "center" }}
          >
            <Typography variant="body1" sx={{ ml: 3, fontWeight: 500 }}>
              Contact Information
            </Typography>
          </AccordionSummary>
          <Box
            sx={{ mx: 12, mb: 3 }}
            rowGap={2}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            }}
          >
            <RHFMuiPhone
              name="mobileNumber"
              value={phoneNum ?? ""}
              onChange={setPhoneNum}
              control={control}
              label="Mobile Number*"
            />
            <RHFTextField name="email" label="E-mail*" />
            <RHFTextField
              name="emergencyContactName"
              label="Emergency Contact Person Name*"
            />
            <RHFMuiPhone
              name="emergencyContactNumber"
              value={emergencyContactPersonNumber ?? ""}
              onChange={setEmergencyContactPersonNumber}
              control={control}
              label="Emergency Contact Person Number*"
            />
          </Box>
        </Accordion>
        {/* ----------Employment Information---------- */}
        <Accordion
          expanded={expand3}
          onChange={() => setExpand3(!expand3)}
          sx={{
            mb: 2,
            border: "1px solid #BDC1E4",
            borderRadius: "9px",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
            sx={{ flexDirection: "row-reverse", alignItems: "center" }}
          >
            <Typography variant="body1" sx={{ ml: 3, fontWeight: 500 }}>
              Employment Information
            </Typography>
          </AccordionSummary>
          <Box
            sx={{ mx: 12, mb: 3 }}
            rowGap={2}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            }}
          >
            <RHFTextField name="employeeID" label="Employee ID*" />
            <RHFTextField name="designation" label="Designation*" />
            <RHFTextField name="epF_ETF_Number" label="EPF/ETF Number*" />
            <RHFDatePicker
              name="appointedDate"
              label="Appointed Date*"
              disableFuture={true}
              onChange={(date: any) => {
                setValue("appointedDate", date);
              }}
              format={process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"}
              value={
                defaultValues.appointedDate
                  ? new Date(defaultValues.appointedDate)
                  : null
              }
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
        </Accordion>
        {/* ----------Account Details---------- */}
        <Accordion
          expanded={expand4}
          onChange={() => setExpand4(!expand4)}
          sx={{
            mb: 2,
            border: "1px solid #BDC1E4",
            borderRadius: "9px",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4a-content"
            id="panel4a-header"
            sx={{ flexDirection: "row-reverse", alignItems: "center" }}
          >
            <Typography variant="body1" sx={{ ml: 3, fontWeight: 500 }}>
              Account Details
            </Typography>
          </AccordionSummary>
          <Box
            sx={{ mx: 12, mb: 3 }}
            rowGap={2}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            }}
          >
            <RHFTextField name="userName" label="User Name*" />
            <RHFTextField
              name="password"
              label="Password*"
              type="password"
              autoComplete="new-password"
            />
            <RHFTextField
              name="confirmPassword"
              label="Confirm Password*"
              type="password"
              autoComplete="new-password"
            />
          </Box>
        </Accordion>
        <Box
          sx={{
            width: "100%",
            bgcolor: "#E5E0F5",
            height: "10vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "2px solid #FFFFFF",
            borderRadius: "15px",
            mt: "15px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <LoadingButton
              type="submit"
              variant="contained"
              loading={formState.isSubmitting}
              startIcon={<SaveIcon />}
              disabled={!formState.isDirty}
              onClick={handleSubmitClick}
              sx={{
                color: "#FFFFFF",
                height: "44px",
                px: 4,
                borderRadius: "15px",
                mr: 3,
                border: "2px solid #9fa4d4",
                background: "#070E4D",
                "&:hover": {
                  background: "#2D3675",
                },
              }}
            >
              Save
            </LoadingButton>
            <Button
              type="reset"
              variant="outlined"
              onClick={() => handleReset()}
              sx={{
                height: "44px",
                px: 4,
                borderRadius: "15px",
                background: "#f7f4fe",
                border: "2px solid #fbf9ff",
                "&:hover": {
                  background: "#DED8F2",
                  border: "2px solid #f4f1fc",
                },
              }}
            >
              Clear
            </Button>
          </Box>
        </Box>
      </Grid>
    </FormProvider>
  );
}
