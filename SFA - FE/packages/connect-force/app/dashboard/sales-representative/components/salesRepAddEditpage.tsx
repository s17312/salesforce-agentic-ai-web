import FormProvider, {
  RHFAutocompleteField,
  RHFTextField,
} from "@/components/hook-form";
import RHFDatePicker from "@/components/hook-form/RHFDatePicker";
import { RHFMuiPhone } from "@/components/hook-form/RHFMobileDropdown";
import { SaveIcon } from "@/components/icons/saveIcon";
import {
  setSalesRepresentativeError,
  setSalesRepresentativeMessage,
} from "@/redux/slices/sales-representative-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  createSalesRepresentative,
  updateSalesRepresentative,
} from "@/service/salesRepresentative.service";
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  FormValuesPropsSalesRepresentative,
  SalesRepresentative,
} from "@/types/sales-representative-types";
import { salesRepresentativeValidationSchema } from "@/utils/schemas/salesRepresentativeSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
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
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { cleanMobileInput, getDialCode } from "@/utils/phoneNumbers";
import { getAllActiveDistributors } from "@/service/outletTransfer.service";

type Props = {
  currentSalesRepresentative?: SalesRepresentative | undefined;
  isEdit?: boolean;
};

export default function SalesRepresentativeForm({
  currentSalesRepresentative,
  isEdit = false,
}: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [phoneNumber, setPhoneNumber] = useState("+94");
  const { distributors: distributors } = useSelector(
    (state) => state.outletTransferSlice
  );
  const responseMessage = useSelector(
    (state) => state.salesRepresentativeSlice.message
  );

  const responseError = useSelector(
    (state) => state.salesRepresentativeSlice.error
  );

  const defaultValues = useMemo(
    () => ({
      representativeID: currentSalesRepresentative?.representativeID || "",
      name: currentSalesRepresentative?.name || "",
      email: currentSalesRepresentative?.email || "",
      contactNo: currentSalesRepresentative?.contactNo || "",
      contactNoCountryCode:
        currentSalesRepresentative?.contactNoCountryCode || "",
      addressLine1: currentSalesRepresentative?.addressLine1 || "",
      addressLine2: currentSalesRepresentative?.addressLine2 || "",
      addressLine3: currentSalesRepresentative?.addressLine3 || "",
      dateOfBirth: currentSalesRepresentative?.dateOfBirth || null,
      nic: currentSalesRepresentative?.nic || "",
      reference: currentSalesRepresentative?.reference || "",
      distributorUId: currentSalesRepresentative?.distributorUId || null,
    }),
    [currentSalesRepresentative]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([getAllActiveDistributors()]);
      } catch (error) {
        enqueueSnackbar(`Error in getting data`, { variant: "error" });
      }
    };
    fetchData();
  }, []);

  const methods = useForm<FormValuesPropsSalesRepresentative>({
    //@ts-ignore
    resolver: yupResolver(salesRepresentativeValidationSchema),
    defaultValues,
    mode: "all",
  });

  const { handleSubmit, reset, formState, setValue, control, setFocus } =
    methods;

  useEffect(() => {
    if (isEdit && currentSalesRepresentative) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentSalesRepresentative]);

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setSalesRepresentativeMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setSalesRepresentativeError(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseMessage, responseError]);

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

  const prepareCompanyData = (data: FormValuesPropsSalesRepresentative) => {
    let cleanPhone = data.contactNo;
    let phoneCode = data.contactNoCountryCode;

    if (data.contactNo && data.contactNo.includes(" ")) {
      cleanPhone = cleanMobileInput(data.contactNo);
      phoneCode = getDialCode(data.contactNo);
    }

    return {
      ...data,
      contactNo: cleanPhone,
      contactNoCountryCode: phoneCode,
    };
  };

  const handleCreateSalesRepresentative = async (
    data: FormValuesPropsSalesRepresentative
  ) => {
    const formattedData = {
      ...prepareCompanyData(data),
      dateOfBirth: data.dateOfBirth
        ? format(new Date(data.dateOfBirth), "yyyy-MM-dd")
        : null,
    };
    try {
      await createSalesRepresentative(formattedData);
      reset(defaultValues);
      router.push(PATH_DASHBOARD.salesRepresentative.list);
    } catch (error: any) {}
  };

  const handleUpdateSalesRepresentative = async (
    data: FormValuesPropsSalesRepresentative
  ) => {
    const formattedData = {
      ...prepareCompanyData(data),
      dateOfBirth: data.dateOfBirth
        ? format(new Date(data.dateOfBirth), "yyyy-MM-dd")
        : null,
    };
    try {
      await updateSalesRepresentative(
        currentSalesRepresentative?.uId,
        formattedData
      );
      router.push(PATH_DASHBOARD.salesRepresentative.list);
    } catch (error: any) {}
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.salesRepresentative.list);
  };

  const handleReset = () => {
    reset(defaultValues);
    setPhoneNumber("+94");
  };

  const mapListToOptions = (list: any[], labelKey: string, valueKey: string) =>
    list.map((item) => ({
      label: item[labelKey],
      value: item[valueKey],
    }));

  const distributorAssignmentMap = mapListToOptions(
    distributors,
    "distributorName",
    "uId"
  );

  return (
    <FormProvider
      methods={methods}
      onSubmit={
        !isEdit
          ? handleSubmit(handleCreateSalesRepresentative)
          : handleSubmit(handleUpdateSalesRepresentative)
      }
    >
      <Grid item xs={12} sx={{ mb: 3, position: "relative" }}>
        <Accordion
          expanded={true}
          sx={{
            mb: 2,
            border: "1px solid #BDC1E4",
            borderRadius: "9px",
          }}
        >
          <AccordionSummary
            aria-controls="Sales Representative Creation"
            id="panel1a-header"
            sx={cursorDefault}
          >
            <Typography variant="body1" sx={{ ml: 5, fontWeight: 500 }}>
              Sales Representative Details
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
            <RHFTextField name="representativeID" label="Code*" />
            <RHFTextField name="name" label="Name*" />
            <RHFTextField name="email" label="Email Address*" />
            <RHFMuiPhone
              name="contactNo"
              value={isEdit ? defaultValues.contactNo ?? "" : phoneNumber ?? ""}
              onChange={setPhoneNumber}
              control={control}
              label="Phone Number*"
            />
            <RHFTextField name="addressLine1" label="Address Line 1*" />
            <RHFTextField name="addressLine2" label="Address Line 2" />
            <RHFTextField name="addressLine3" label="Address Line 3" />

            <RHFDatePicker
              name="dateOfBirth"
              label="Date of Birth"
              disableFuture={true}
              onChange={(date: any) => {
                setValue("dateOfBirth", date);
              }}
              format={process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"}
              value={
                defaultValues.dateOfBirth
                  ? new Date(defaultValues.dateOfBirth)
                  : null
              }
              renderInput={(params) => <TextField {...params} />}
            />
            <RHFTextField name="nic" label="NIC" />
            <RHFTextField name="reference" label="Reference" />
            <RHFAutocompleteField
              name="distributorUId"
              placeholder="Distributor Assignment*"
              options={distributorAssignmentMap}
              control={control}
              inputProps={{
                form: {
                  autocomplete: "off",
                },
              }}
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
  );
}
