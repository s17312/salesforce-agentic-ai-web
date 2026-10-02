import { RHFTextField } from "@/components/hook-form";
import FormProvider from "@/components/hook-form/FormProvider";
import { RHFMuiPhone } from "@/components/hook-form/RHFMobileDropdown";
import { SaveIcon } from "@/components/icons/saveIcon";
import {
  setMainOutletError,
  setMainOutletMessage,
} from "@/redux/slices/main-outlet-slice";
import { dispatch, useSelector } from "@/redux/store";
import {
  createMainOutlet,
  updateMainOutlet,
} from "@/service/main-outlet.service";
import {
  CreateMainOutletFormValues,
  MainOutlet,
} from "@/types/main-outlet-types";
import { mainOutletValidationSchema } from "@/utils/schemas/mainOutletSchemas";
import { yupResolver } from "@hookform/resolvers/yup";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LoadingButton } from "@mui/lab";
import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useSnackbar } from "../../../../components/snackbar";
import { PATH_DASHBOARD } from "../../../../routes/paths";

type Props = {
  currentMainOutlet?: MainOutlet | undefined;
  isEdit?: boolean;
};

export default function MainOutletAddForm({
  currentMainOutlet,
  isEdit = false,
}: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const responseMessage = useSelector((state) => state.mainOutletSlice.message);
  const responseError = useSelector((state) => state.mainOutletSlice.error);
  const [contactNo, setContactNo] = useState("+94");
  const [ownerTpNum, setOwnerTpNum] = useState("+94");
  const [expand1, setExpand1] = useState(true);
  const [expand2, setExpand2] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const defaultValues = useMemo(() => {
    return {
      outletID: currentMainOutlet?.outletID || "",
      name: currentMainOutlet?.name || "",
      address: currentMainOutlet?.address || "",
      addressLine1: currentMainOutlet?.addressLine1 || "",
      addressLine2: currentMainOutlet?.addressLine2 || "",
      motherCompanyAddress: currentMainOutlet?.motherCompanyAddress || "",
      motherCompanyAddressLine1:
        currentMainOutlet?.motherCompanyAddressLine1 || "",
      motherCompanyAddressLine2:
        currentMainOutlet?.motherCompanyAddressLine2 || "",
      contactNo: currentMainOutlet?.contactNo || "",
      ownerName: currentMainOutlet?.ownerName || "",
      ownerNIC: currentMainOutlet?.ownerNIC || "",
      ownerContactNo: currentMainOutlet?.ownerContactNo || "",
      brNo: currentMainOutlet?.brNo || "",
      vatNo: currentMainOutlet?.vatNo || "",
    };
  }, [currentMainOutlet]);

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setMainOutletMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setMainOutletError(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseMessage, responseError]);

  useEffect(() => {
    if ((isEdit && currentMainOutlet) || isDataLoaded) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentMainOutlet, isDataLoaded]);

  const methods = useForm<CreateMainOutletFormValues>({
    // @ts-ignore
    resolver: yupResolver(mainOutletValidationSchema),
    defaultValues,
    mode: "all",
  });

  const { handleSubmit, reset, formState, setValue, control, watch, setFocus } =
    methods;

  useEffect(() => {}, [formState.errors]);

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

  const handleCreateMainOutlet = async (data: CreateMainOutletFormValues) => {
    try {
      await createMainOutlet(data);
      reset(defaultValues);
      router.push(PATH_DASHBOARD.mainOutlet.list);
    } catch (error: any) {}
  };

  const handleUpdateMainOutlet = async (data: CreateMainOutletFormValues) => {
    try {
      await updateMainOutlet(currentMainOutlet?.uId, data);
      router.push(PATH_DASHBOARD.mainOutlet.list);
    } catch (error: any) {}
  };

  const handleClick = async () => {
    // Trigger validation for all fields
    const isValid = await methods.trigger();

    // Check for errors after validation
    if (!isValid) {
      const part1Fields: (keyof CreateMainOutletFormValues)[] = [
        "outletID",
        "name",
        "address",
        "addressLine1",
        "addressLine2",
        "contactNo",
        "brNo",
        "vatNo",
      ];

      const part2Fields: (keyof CreateMainOutletFormValues)[] = [
        "motherCompanyAddress",
        "motherCompanyAddressLine1",
        "motherCompanyAddressLine2",
        "ownerName",
        "ownerNIC",
        "ownerContactNo",
      ];

      const currentErrors = methods.formState.errors;

      const part1Error = part1Fields.some((field) => currentErrors[field]);
      if (part1Error) {
        setExpand1(true);
      }
      const part2Error = part2Fields.some((field) => currentErrors[field]);
      if (part2Error) {
        setExpand2(true);
      }
    }
  };

  const handleSubmitClick = async () => {
    await handleClick();
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.mainOutlet.list);
  };

  const [showGrid, setShowGrid] = useState(false);

  const handleReset = () => {
    reset(defaultValues);
    setContactNo("+94");
    setOwnerTpNum("+94");
  };

  return (
    <>
      <FormProvider
        methods={methods}
        onSubmit={
          !isEdit
            ? handleSubmit(handleCreateMainOutlet, onError)
            : handleSubmit(handleUpdateMainOutlet, onError)
        }
      >
        <Grid
          item
          xs={12}
          sx={{
            mb: 3,
            position: "relative",
          }}
        >
          {/* Outlet details */}
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
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{ flexDirection: "row-reverse", alignItems: "center" }}
            >
              <Typography variant="body1" sx={{ ml: 3, fontWeight: 500 }}>
                Main Outlet Details
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
              <RHFTextField name="outletID" label="Parent Outlet Code*" />
              <RHFTextField name="name" label="Name*" />
              <RHFTextField name="address" label="Address Line 1*" />
              <RHFTextField name="addressLine1" label="Address Line 2" />
              <RHFTextField name="addressLine2" label="Address Line 3" />
              <RHFMuiPhone
                name="contactNo"
                value={isEdit ? defaultValues.contactNo ?? "" : contactNo ?? ""}
                onChange={setContactNo}
                control={control}
                label="Contact No*"
              />

              <RHFTextField name="brNo" label="Business Registration Number" />
              <RHFTextField name="vatNo" label="VAT Number" />
            </Box>
          </Accordion>

          {/* owner details */}
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
                Owner Details
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
              <RHFTextField
                name="motherCompanyAddress"
                label="Mother Company Address"
              />
              <RHFTextField
                name="motherCompanyAddressLine1"
                label="Mother Company Address Line 1"
              />
              <RHFTextField
                name="motherCompanyAddressLine2"
                label="Mother Company Address Line 2"
              />
              <RHFTextField name="ownerName" label="Owner Name" />
              <RHFTextField name="ownerNIC" label="Owner NIC" />

              <RHFMuiPhone
                name="ownerContactNo"
                value={
                  isEdit ? defaultValues.ownerContactNo ?? "" : ownerTpNum ?? ""
                }
                onChange={setOwnerTpNum}
                label="Owner Telephone Number"
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
                {isEdit ? "Update" : "Save"}
              </LoadingButton>
              {!isEdit ? (
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
              ) : (
                <Button
                  variant="outlined"
                  onClick={handleCancel}
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
                  Cancel
                </Button>
              )}
            </Box>
          </Box>
        </Grid>
      </FormProvider>
    </>
  );
}
