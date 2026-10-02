import FormProvider from "@/components/hook-form/FormProvider";
import { useSnackbar } from "@/components/snackbar";
import {
  setCompanyError,
  setCompanyMessage,
} from "@/redux/slices/company-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { createCompany, updateCompany } from "@/service/company.service";
import { Company } from "@/types/company-types";
import { cleanMobileInput, getDialCode } from "@/utils/phoneNumbers";
import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LoadingButton } from "@mui/lab";
import { SaveIcon } from "@/components/icons/saveIcon";
import { getAllActiveLegaleEntityTypes } from "@/service/legleEntityType.service";
import RHFTextField from "@/components/hook-form/RHFTextField";
import RHFAutocompleteField from "@/components/hook-form/RHFAutocompleteField";
import { companyValidationSchema } from "@/utils/schemas/companySchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { RHFMuiPhone } from "@/components/hook-form/RHFMobileDropdown";
import { getPriceListAllByPriceType } from "@/service/mapping-service/priceListType.service";
import RHFAutocompleteCheckboxField from "@/components/hook-form/RHFAutocompleteCheckboxField";
import { setAllPriceListTypeDetails } from "@/redux/slices/price-list-type-slice";

type Props = {
  currentCompany?: Company | undefined;
  isEdit?: boolean;
};

type FormValuesProps = {
  companyId?: string | null;
  companyName?: string | null;
  legalEntryTypeUId?: number | string | null;
  registeredAddress?: string | null;
  phoneNo?: string | null;
  email?: string | null;
  taxID?: string | null;
  companySize?: string | null;
  industry?: string | null;
  siCcode?: string | null;
  comments?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  vatNo?: string | null;
  phoneNoCountryCode?: string | null;
  priceListAssignmentUIds?: number[] | null;
  priceListAssignmentDefaultUId?: number | null | undefined;
};

export default function CompanyAddEditForm({
  currentCompany,
  isEdit = false,
}: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { legleEntityTypeStates: legalEntryTypeList } = useSelector((state) => state.legleEntityTypeSlice);
  const priceListTypeList = useSelector((state) => state.priceListTypeSlice.priceListTypeDetails);

  const [phoneNum, setPhoneNum] = useState("+94");
  const [expand1, setExpand1] = useState(true);
  const [expand2, setExpand2] = useState(false);
  const [expand3, setExpand3] = useState(false);

  const defaultValues = useMemo(
    () => ({
      companyId: currentCompany?.companyId || "",
      companyName: currentCompany?.companyName || "",
      legalEntryTypeUId: currentCompany?.legalEntryTypeUId || "",
      registeredAddress: currentCompany?.registeredAddress || "",
      phoneNo: currentCompany?.phoneNo || "",
      email: currentCompany?.email || "",
      taxID: currentCompany?.taxID || "",
      companySize: currentCompany?.companySize || "",
      industry: currentCompany?.industry || "",
      siCcode: currentCompany?.siCcode || "",
      comments: currentCompany?.comments || "",
      addressLine1: currentCompany?.addressLine1 || "",
      addressLine2: currentCompany?.addressLine2 || "",
      vatNo: currentCompany?.vatNo || "",
      phoneNoCountryCode: currentCompany?.phoneNoCountryCode || "",
      priceListAssignmentUIds: Array.isArray(currentCompany?.priceListType) ?
        currentCompany.priceListType.map((item: any) => item.uId) : null,
      priceListAssignmentDefaultUId: currentCompany?.priceListAssignmentDefaultUId || null,
    }),
    [currentCompany]
  );

  const responseMessage = useSelector((state) => state.companySlice.message);
  const responseError = useSelector((state) => state.companySlice.error);

  const fetchPriceListsData = async () => {
    try {
      await getPriceListAllByPriceType(1);
    } catch (error) {
      console.error("Error in getting price list data", error);
    }
  };


  const fetchData = async () => {
    try {
      await Promise.all([
        getAllActiveLegaleEntityTypes(
          undefined,
          undefined,
          undefined,
          "legalEntryTypeName",
          "asc",
          true
        ),
      ]);
    } catch (error) {
      enqueueSnackbar(`Error in getting data`, { variant: "error" });
    }
  };

  useEffect(() => {
    fetchData();
    fetchPriceListsData();
  }, []);

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setCompanyMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setCompanyError(null));
    }
  }, [responseMessage, responseError]);

  useEffect(() => {
    if (isEdit && currentCompany) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentCompany]);

  const methods = useForm<FormValuesProps>({
    // @ts-ignore
    resolver: yupResolver(companyValidationSchema),
    defaultValues,
    mode: "all",
  });

  const { handleSubmit, reset, formState, control, setFocus, watch, setValue } = methods;

  // Using errors from formState to trigger re-renders on validation changes.
  // This is necessary for dynamic form validation feedback.
  useEffect(() => { }, [formState.errors]);

  const selectedPriceListsIDs: number[] = watch("priceListAssignmentUIds") || [];

  // Only include items that are in the currently selected IDs
  const selectedPriceLists = selectedPriceListsIDs.map((priceListId: number) => {
    const priceListType = priceListTypeList.find((pl) => pl.uId === priceListId);
    return {
      value: priceListId,
      priceListTypeName: priceListType?.priceListTypeName || "Unknown",
    };
  });

  const watchPriceListAssignmentUIds = useWatch({
    control,
    name: "priceListAssignmentUIds",
  });

  const watchPriceListAssignmentDefaultUId = useWatch({
    control,
    name: "priceListAssignmentDefaultUId",
  });

  useEffect(() => {
    // if watchPriceListAssignmentDefaultUId is not in the watchPriceListAssignmentUIds, saetValue null for watchPriceListAssignmentDefaultUId
    if (watchPriceListAssignmentDefaultUId && !watchPriceListAssignmentUIds?.includes(watchPriceListAssignmentDefaultUId)) {
      setValue("priceListAssignmentDefaultUId", null);
    }
  }, [watchPriceListAssignmentUIds]);

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

  const prepareCompanyData = (data: FormValuesProps) => {
    let cleanPhone = data.phoneNo;
    let phoneCode = data.phoneNoCountryCode;
    let priceListAssignmentDefaultUId = Number(data.priceListAssignmentDefaultUId);

    if (data.phoneNo && data.phoneNo.includes(" ")) {
      cleanPhone = cleanMobileInput(data.phoneNo);
      phoneCode = getDialCode(data.phoneNo);
    }

    // Set priceListAssignmentDefaultUId to null if priceListAssignmentUIds is null
    if (data.priceListAssignmentUIds === null) {
      priceListAssignmentDefaultUId = 0;
    }

    return {
      ...data,
      phoneNo: cleanPhone,
      phoneNoCountryCode: phoneCode,
      priceListAssignmentDefaultUId: priceListAssignmentDefaultUId,
    };
  };

  const handleCreateCompany = async (data: FormValuesProps) => {
    try {
      const cmpanyData = prepareCompanyData(data);
      await createCompany(cmpanyData);
      reset(defaultValues);
      router.push(PATH_DASHBOARD.company.list);
      dispatch(setAllPriceListTypeDetails([]));
    } catch (error: any) { }
  };

  const handleUpdateCompany = async (data: FormValuesProps) => {
    try {
      const cmpanyData = prepareCompanyData(data);
      await updateCompany(currentCompany?.uId, cmpanyData);
      router.push(PATH_DASHBOARD.company.list);
      dispatch(setAllPriceListTypeDetails([]));
    } catch (error: any) { }
  };

  // Generic mapping function
  const mapListToOptions = (list: any[], labelKey: string, valueKey: string) =>
    list.map((item) => ({
      label: item[labelKey],
      value: item[valueKey],
    }));

  // Usage with different lists
  const legalEntityTMap = mapListToOptions(
    legalEntryTypeList,
    "legalEntryTypeName",
    "uId"
  );

  const priceListTypeMap = mapListToOptions(priceListTypeList, "priceListTypeName", "uId");

  const handleClick = async () => {
    const isValid = await methods.trigger();
    if (!isValid) {
      const part1Fields: (keyof FormValuesProps)[] = [
        "companyId",
        "companyName",
        "legalEntryTypeUId",
        "taxID",
        "companySize",
        "industry",
        "siCcode",
        "vatNo",
      ];

      const part2Fields: (keyof FormValuesProps)[] = [
        "registeredAddress",
        "addressLine1",
        "addressLine2",
        "phoneNo",
        "email",
        "comments",
      ];

      const part3Fields: (keyof FormValuesProps)[] = [
        "priceListAssignmentUIds",
        "priceListAssignmentDefaultUId",
      ];

      const part4Fields: (keyof FormValuesProps)[] = [
        "priceListAssignmentUIds",
        "priceListAssignmentDefaultUId",
      ];

      const currentErrors = methods.formState.errors; // Use formState to get the latest errors

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
    }
  };

  const handleSubmitClick = async () => {
    await handleClick();
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.company.list);
  };

  const handleReset = () => {
    reset(defaultValues);
    setPhoneNum("+94");
  };

  return (
    <>
      <FormProvider
        methods={methods}
        onSubmit={
          !isEdit
            ? handleSubmit(handleCreateCompany, onError)
            : handleSubmit(handleUpdateCompany, onError)
        }
      >
        <Grid item xs={12} sx={{ mb: 3, position: "relative" }}>
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
                Company Details
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
              <RHFTextField name="companyId" label="Code*" />
              <RHFTextField name="companyName" label="Name*" />
              <RHFAutocompleteField
                name="legalEntryTypeUId"
                label="Legal Entity Type*"
                placeholder="Legal Entity Type*"
                options={legalEntityTMap}
                control={control}
                rules={{ required: true }}
                inputProps={{
                  form: {
                    autocomplete: "off",
                  },
                }}
              />
              <RHFTextField
                name="taxID"
                label="Tax ID"
                type="number"
                onKeyDown={(evt) =>
                  ["e", "E", "+", "-", "="].includes(evt.key) &&
                  evt.preventDefault()
                }
                sx={{
                  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    display: "none",
                  },
                  "& input[type=number]": {
                    MozAppearance: "textfield",
                  },
                }}
              />
              <RHFTextField name="companySize" label="Company Size" />
              <RHFTextField name="industry" label="Industry" />
              <RHFTextField name="siCcode" label="SIC Code" />
              <RHFTextField name="vatNo" label="VAT Number*" />
            </Box>
          </Accordion>

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
                Contact Details
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
              <RHFTextField name="registeredAddress" label="Address Line 1*" />
              <RHFTextField name="addressLine1" label="Address Line 2" />
              <RHFTextField name="addressLine2" label="Address Line 3" />
              <RHFMuiPhone
                name="phoneNo"
                value={isEdit ? defaultValues.phoneNo : phoneNum}
                onChange={setPhoneNum}
                control={control}
                label="Phone*"
              />
              <RHFTextField name="email" label="Email*" />
              <RHFTextField name="comments" label="Comments" />
            </Box>
          </Accordion>
          {/* Price List assignment */}
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
                Price List Assignment
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
              <RHFAutocompleteCheckboxField
                name="priceListAssignmentUIds"
                placeholder="Price Lists"
                options={priceListTypeMap}
                control={control}
              />
              {(selectedPriceLists && selectedPriceLists.length > 0) && (
                <Box>
                  <FormLabel component="legend">Select Default Price List</FormLabel>
                  <Controller
                    name="priceListAssignmentDefaultUId"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup {...field}>
                        {selectedPriceLists.map((priceList: any) => (
                          <FormControlLabel
                            sx={{ width: 'fit-content' }}
                            key={priceList.value}
                            value={Number(priceList.value)}
                            control={<Radio />}
                            label={priceList.priceListTypeName}
                          />
                        ))}
                      </RadioGroup>
                    )}
                  />
                </Box>
              )}
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
