import { RHFTextField } from "@/components/hook-form";
import FormProvider from "@/components/hook-form/FormProvider";
import RHFAutocompleteField from "@/components/hook-form/RHFAutocompleteField";
import RHFDatePicker from "@/components/hook-form/RHFDatePicker";
import { RHFMuiPhone } from "@/components/hook-form/RHFMobileDropdown";
import { SaveIcon } from "@/components/icons/saveIcon";
import {
  setDistributorError,
  setDistributorMessage,
} from "@/redux/slices/distributor-slice";
import { dispatch, useSelector } from "@/redux/store";
import { getAllActiveBusinessCategorys } from "@/service/businessCategory.service";
import {
  createDistributor,
  updateDistributor,
} from "@/service/distributor.service";
import { getAllDistrictsByProvince } from "@/service/districts.service";
import { getAllActivePaymentTerms } from "@/service/paymentTerm.service";
import { getAllProvinces } from "@/service/provinces.service";
import { getAllActiveTitles } from "@/service/titles.service";
import { getAllTownsByDistrict } from "@/service/towns.service";
import { Distributor } from "@/types/distributor-types";
import { cleanMobileInput, getDialCode } from "@/utils/phoneNumbers";
import { distributerValidationSchema } from "@/utils/schemas/distributorSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LoadingButton } from "@mui/lab";
import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { FormValuesProps } from "connect-force-api-client/models/distributor";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useSnackbar } from "../../../../components/snackbar";
import { PATH_DASHBOARD } from "../../../../routes/paths";
import { checkIfIdIsActive } from "@/utils/checkIfIdIsActive";
import { format } from "date-fns";
import { getPriceListAllByPriceType } from "@/service/mapping-service/priceListType.service";
import RHFAutocompleteCheckboxField from "@/components/hook-form/RHFAutocompleteCheckboxField";
import { setAllPriceListTypeDetails } from "@/redux/slices/price-list-type-slice";
import { getAllDistributorAccounts } from "@/service/distributor-accounts-service";

type Props = {
  currentDistributor?: Distributor | undefined;
  isEdit?: boolean;
};

export default function DistributorAddForm({
  currentDistributor,
  isEdit = false,
}: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { provinces: provincesList, isLoading: provinceIsLoading } =
    useSelector((state) => state.provinceSlice);
  const { districts: districtsList, isLoading: districtIsLoading } =
    useSelector((state) => state.districtSlice);
  const { towns: townsList, isLoading: isloadingCity } = useSelector(
    (state) => state.townSlice
  );
  const { titles: titlesList } = useSelector((state) => state.titleSlice);
  const { businessCategorys: businessCategoryList } = useSelector(
    (state) => state.businessCategorySlice
  );
  const { paymentTerms: paymentTermsList } = useSelector(
    (state) => state.paymentTermSlice
  );
  const priceListTypeList = useSelector(
    (state) => state.priceListTypeSlice.priceListTypeDetails
  );

  const distributorAccountsList = useSelector(
    (state) => state.distributorAccountsSlice.distributorAccountsDetails
  );

  const [phoneNum, setPhoneNum] = useState("+94");
  const [mobileNum, setmobileNum] = useState("+94");
  const [ownerTpNum, setOwnerTpNum] = useState("+94");

  const [expand1, setExpand1] = useState(true);
  const [expand2, setExpand2] = useState(false);
  const [expand3, setExpand3] = useState(false);
  const [expand4, setExpand4] = useState(false);
  const [expand5, setExpand5] = useState(false);

  const [isDistrictDisabled, setIsDistrictDisabled] = useState(true);
  const [isTownDisabled, setIsTownDisabled] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const defaultValues = useMemo(
    () => ({
      distributorID: currentDistributor?.distributorID || "",
      distributorName: currentDistributor?.distributorName || "",
      address: currentDistributor?.address || "",
      addressLine1: currentDistributor?.addressLine1 || "",
      addressLine2: currentDistributor?.addressLine2 || "",
      provinceUId: currentDistributor?.provinceUId || "",
      districtUId: currentDistributor?.districtUId || "",
      townUId: currentDistributor?.townUId || "",
      phoneCountryCode: currentDistributor?.phoneCountryCode || "",
      phone: currentDistributor?.phone || "",
      titleUId: currentDistributor?.titleUId || "",
      ownerName: currentDistributor?.ownerName || "",
      ownerAddr: currentDistributor?.ownerAddr || "",
      ownerAddressLine1: currentDistributor?.ownerAddressLine1 || "",
      ownerAddressLine2: currentDistributor?.ownerAddressLine2 || "",
      ownerTpNoCountryCode: currentDistributor?.ownerTpNoCountryCode || "",
      ownerTpNo: currentDistributor?.ownerTpNo || "",
      mobileNoCountryCode: currentDistributor?.mobileNoCountryCode || "",
      mobileNo: currentDistributor?.mobileNo || "",
      appointedDate: currentDistributor?.appointedDate || null,
      businessCategoryUId:
        currentDistributor?.businessCategoryUId !== undefined
          ? checkIfIdIsActive(
              currentDistributor.businessCategoryUId,
              businessCategoryList
            )
          : "",
      paymentTermUId:
        currentDistributor?.paymentTermUId !== undefined
          ? checkIfIdIsActive(
              currentDistributor.paymentTermUId,
              paymentTermsList
            )
          : "",
      vatNo: currentDistributor?.vatNo || "",
      priceListAssignmentUIds: Array.isArray(currentDistributor?.priceListType)
        ? currentDistributor.priceListType.map((item: any) => item.uId)
        : null,
      priceListAssignmentDefaultUId:
        currentDistributor?.priceListAssignmentDefaultUId || null,
      cashAccountAssignmentUIds: Array.isArray(currentDistributor?.cashAccount)
        ? currentDistributor.cashAccount.map((item: any) => item.uId)
        : null,
      cashAccountAssignmentDefaultUId:
        currentDistributor?.cashAccountAssignmentDefaultUId || null,
      chequeAccountAssignmentUIds: Array.isArray(
        currentDistributor?.chequeAccount
      )
        ? currentDistributor.chequeAccount.map((item: any) => item.uId)
        : null,
      chequeAccountAssignmentDefaultUId:
        currentDistributor?.chequeAccountAssignmentDefaultUId || null,
      outstandingAccountAssignmentUIds: Array.isArray(
        currentDistributor?.outstandingAccount
      )
        ? currentDistributor.outstandingAccount.map((item: any) => item.uId)
        : null,
      outstandingAccountAssignmentDefaultUId:
        currentDistributor?.outstandingAccountAssignmentDefaultUId || null,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDistributor, paymentTermsList, businessCategoryList, isDataLoaded]
  );

  const responseMessage = useSelector((state) => state.distributor.message);
  const responseError = useSelector((state) => state.distributor.error);

  const fetchPriceListsData = async () => {
    try {
      await getPriceListAllByPriceType(2);
    } catch (error) {
      console.error("Error in getting price list data", error);
    }
  };

  const fetchDistributorAccountsData = async () => {
    try {
      await getAllDistributorAccounts(
        undefined,
        undefined,
        undefined,
        undefined,
        "asc",
        true
      );
    } catch (error) {
      console.error("Error in getting distributor accounts list data", error);
    }
  };

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setDistributorMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setDistributorError(null));
    }
  }, [responseMessage, responseError]);

  useEffect(() => {
    if ((isEdit && currentDistributor) || isDataLoaded) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentDistributor, isDataLoaded]);

  const fetchData = async () => {
    try {
      await Promise.all([
        getAllProvinces(),
        getAllActiveTitles(),
        getAllActiveBusinessCategorys(),
        getAllActivePaymentTerms(),
      ]);
      setIsDataLoaded(true);
    } catch (error) {
      console.error("Error in getting data", error);
    }
  };
  useEffect(() => {
    fetchData();
    fetchPriceListsData();
    fetchDistributorAccountsData();
  }, []);

  const methods = useForm<FormValuesProps>({
    // @ts-ignore
    resolver: yupResolver(distributerValidationSchema),
    defaultValues,
    mode: "all",
  });

  const {
    handleSubmit,
    reset,
    formState,
    setValue,
    control,
    watch,
    setFocus,
    clearErrors,
  } = methods;

  // Using errors from formState to trigger re-renders on validation changes.
  // This is necessary for dynamic form validation feedback.
  useEffect(() => {}, [formState.errors]);

  const selectedPriceListsIDs: number[] =
    watch("priceListAssignmentUIds") || [];

  // Only include items that are in the currently selected IDs
  const selectedPriceLists = selectedPriceListsIDs.map(
    (priceListId: number) => {
      const priceListType = priceListTypeList.find(
        (pl) => pl.uId === priceListId
      );
      return {
        value: priceListId,
        priceListTypeName: priceListType?.priceListTypeName || "Unknown",
      };
    }
  );

  const watchPriceListAssignmentUIds = useWatch({
    control,
    name: "priceListAssignmentUIds",
  });

  const watchPriceListAssignmentDefaultUId = useWatch({
    control,
    name: "priceListAssignmentDefaultUId",
  });

  const selectedCashAccountListIDs: number[] =
    watch("cashAccountAssignmentUIds") || [];
  const selectedChequeAccountListIDs: number[] =
    watch("chequeAccountAssignmentUIds") || [];
  const selectedOutstandingAccountListIDs: number[] =
    watch("outstandingAccountAssignmentUIds") || [];

  // Only include items that are in the currently selected IDs
  const selectedCashAccounts = selectedCashAccountListIDs.map(
    (cashAccountId: number) => {
      const cashAccount = distributorAccountsList.find(
        (ca) => ca.uId === cashAccountId
      );
      return {
        value: cashAccountId,
        accountName: cashAccount?.accountName || "Unknown",
      };
    }
  );

  const selectedChequeAccounts = selectedChequeAccountListIDs.map(
    (chequeAccountId: number) => {
      const chequeAccount = distributorAccountsList.find(
        (chequeAcc) => chequeAcc.uId === chequeAccountId
      );
      return {
        value: chequeAccountId,
        accountName: chequeAccount?.accountName || "Unknown",
      };
    }
  );

  const selectedOutstandingAccounts = selectedOutstandingAccountListIDs.map(
    (outstandingAccountId: number) => {
      const outstandingAccount = distributorAccountsList.find(
        (ca) => ca.uId === outstandingAccountId
      );
      return {
        value: outstandingAccountId,
        accountName: outstandingAccount?.accountName || "Unknown",
      };
    }
  );

  const watchCashAccountAssignmentUIds = useWatch({
    control,
    name: "cashAccountAssignmentUIds",
  });

  const watchCashAccountAssignmentDefaultUId = useWatch({
    control,
    name: "cashAccountAssignmentDefaultUId",
  });
  const watchChequeAccountAssignmentUIds = useWatch({
    control,
    name: "chequeAccountAssignmentUIds",
  });

  const watchChequeAccountAssignmentDefaultUId = useWatch({
    control,
    name: "chequeAccountAssignmentDefaultUId",
  });

  const watchOutstandingAccountAssignmentUIds = useWatch({
    control,
    name: "outstandingAccountAssignmentUIds",
  });

  const watchOutstandingAccountAssignmentDefaultUId = useWatch({
    control,
    name: "outstandingAccountAssignmentDefaultUId",
  });

  useEffect(() => {
    if (
      watchPriceListAssignmentDefaultUId &&
      !watchPriceListAssignmentUIds?.includes(
        Number(watchPriceListAssignmentDefaultUId)
      )
    ) {
      setValue("priceListAssignmentDefaultUId", null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchPriceListAssignmentUIds]);

  useEffect(() => {
    if (
      watchCashAccountAssignmentDefaultUId &&
      !watchCashAccountAssignmentUIds?.includes(
        Number(watchCashAccountAssignmentDefaultUId)
      )
    ) {
      setValue("cashAccountAssignmentDefaultUId", null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchCashAccountAssignmentUIds]);

  useEffect(() => {
    if (
      watchChequeAccountAssignmentDefaultUId &&
      !watchChequeAccountAssignmentUIds?.includes(
        Number(watchChequeAccountAssignmentDefaultUId)
      )
    ) {
      setValue("chequeAccountAssignmentDefaultUId", null);
    }
  }, [watchChequeAccountAssignmentUIds]);

  useEffect(() => {
    if (
      watchOutstandingAccountAssignmentDefaultUId &&
      !watchOutstandingAccountAssignmentUIds?.includes(
        Number(watchOutstandingAccountAssignmentDefaultUId)
      )
    ) {
      setValue("outstandingAccountAssignmentDefaultUId", null);
    }
  }, [watchOutstandingAccountAssignmentUIds]);

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

  const w_province = watch("provinceUId");
  const w_district = watch("districtUId");

  useEffect(() => {
    w_province && getAllDistrictsByProvince(parseInt(`${w_province}`));
  }, [w_province]);

  useEffect(() => {
    w_district && getAllTownsByDistrict(parseInt(`${w_district}`));
  }, [w_district]);

  /*PREPARE DISTRIBUTOR DATA*/
  const prepareDistributorData = (data: FormValuesProps) => {
    let cleanedPhone = data.phone;
    let phoneDialCode = data.phoneCountryCode;
    let cleanedMobileNo = data.mobileNo;
    let mobileNoCountryCode = data.mobileNoCountryCode;
    let cleanedOwnerTpNo = data.ownerTpNo;
    let ownerTpNoCountryCode = data.ownerTpNoCountryCode;
    let priceListAssignmentDefaultUId = Number(
      data.priceListAssignmentDefaultUId
    );
    let cashAccountAssignmentDefaultUId = Number(
      data.cashAccountAssignmentDefaultUId
    );
    let chequeAccountAssignmentDefaultUId = Number(
      data.chequeAccountAssignmentDefaultUId
    );
    let outstandingAccountAssignmentDefaultUId = Number(
      data.outstandingAccountAssignmentDefaultUId
    );

    // Only clean and extract data for phone if it includes a space
    if (data.phone && data.phone.includes(" ")) {
      cleanedPhone = cleanMobileInput(data.phone);
      phoneDialCode = getDialCode(data.phone);
    }
    // Only clean and extract data for mobileNo if it includes a space
    if (data.mobileNo && data.mobileNo.includes(" ")) {
      cleanedMobileNo = cleanMobileInput(data.mobileNo);
      mobileNoCountryCode = getDialCode(data.mobileNo);
    }
    // Only clean and extract data for ownerTpNo if it includes a space
    if (data.ownerTpNo && data.ownerTpNo.includes(" ")) {
      cleanedOwnerTpNo = cleanMobileInput(data.ownerTpNo);
      ownerTpNoCountryCode = getDialCode(data.ownerTpNo);
    }
    // Set priceListAssignmentDefaultUId to null if priceListAssignmentUIds is null
    if (data.priceListAssignmentUIds === null) {
      priceListAssignmentDefaultUId = 0;
    }
    if (data.cashAccountAssignmentUIds === null) {
      cashAccountAssignmentDefaultUId = 0;
    }
    if (data.chequeAccountAssignmentUIds === null) {
      chequeAccountAssignmentDefaultUId = 0;
    }
    if (data.outstandingAccountAssignmentUIds === null) {
      outstandingAccountAssignmentDefaultUId = 0;
    }

    return {
      ...data,
      phoneCountryCode: phoneDialCode,
      phone: cleanedPhone,
      mobileNoCountryCode: mobileNoCountryCode,
      mobileNo: cleanedMobileNo,
      ownerTpNoCountryCode: ownerTpNoCountryCode,
      ownerTpNo: cleanedOwnerTpNo,
      appointedDate: data.appointedDate
        ? format(new Date(data.appointedDate), "yyyy-MM-dd")
        : null,
      priceListAssignmentDefaultUId: Number(priceListAssignmentDefaultUId),
      cashAccountAssignmentDefaultUId: Number(cashAccountAssignmentDefaultUId),
      chequeAccountAssignmentDefaultUId: Number(
        chequeAccountAssignmentDefaultUId
      ),
      outstandingAccountAssignmentDefaultUId: Number(
        outstandingAccountAssignmentDefaultUId
      ),
    };
  };

  const handleCreateDistributor = async (data: FormValuesProps) => {
    try {
      const cleanedData = prepareDistributorData(data);
      await createDistributor(cleanedData);
      reset(defaultValues);
      router.push(PATH_DASHBOARD.distributor.list);
      dispatch(setAllPriceListTypeDetails([]));
    } catch (error: any) {}
  };

  const handleUpdateDistributor = async (data: FormValuesProps) => {
    try {
      const cleanedData = prepareDistributorData(data);
      await updateDistributor(currentDistributor?.uId, cleanedData);
      router.push(PATH_DASHBOARD.distributor.list);
      dispatch(setAllPriceListTypeDetails([]));
    } catch (error: any) {}
  };

  // Generic mapping function
  const mapListToOptions = (list: any[], labelKey: string, valueKey: string) =>
    list.map((item) => ({
      label: item[labelKey],
      value: item[valueKey],
    }));

  // Usage with different lists
  const provinceMap = mapListToOptions(provincesList, "nameEN", "uId");
  const districtListByProvince = mapListToOptions(
    districtsList,
    "name_en",
    "uId"
  );
  const townListByDistrict = mapListToOptions(townsList, "name_en", "uId");
  const titleMap = mapListToOptions(titlesList, "description", "uId");
  const businessCategoryMap = mapListToOptions(
    businessCategoryList,
    "category",
    "uId"
  );
  const paymentTermMap = mapListToOptions(paymentTermsList, "name", "uId");
  const priceListTypeMap = mapListToOptions(
    priceListTypeList,
    "priceListTypeName",
    "uId"
  );

  const distributorAccountsListTypeMap = mapListToOptions(
    distributorAccountsList,
    "accountName",
    "uId"
  );

  const handleProvinceChange = (value: any) => {
    setValue("provinceUId", value);

    setValue("townUId", null);
    if (!value) {
      setValue("townUId", null);
      setValue("districtUId", null);
    }
  };

  const handleDistrictChange = (value: any) => {
    setValue("districtUId", value);

    if (!value) {
      setValue("townUId", null);
    }
  };

  useEffect(() => {
    if (w_province) {
      setIsDistrictDisabled(false);

      setIsTownDisabled(true);
    } else {
      setIsDistrictDisabled(true);
      setIsTownDisabled(true);
    }
  }, [w_province, setValue]);

  useEffect(() => {
    if (w_district) {
      setIsTownDisabled(false);
    } else {
      setIsTownDisabled(true);
    }
  }, [w_district]);

  useEffect(() => {
    if (isEdit) {
      fetchPriceListsData();
      fetchDistributorAccountsData();
    }
  }, [isEdit]);

  const handleClick = async () => {
    // Trigger validation for all fields
    const isValid = await methods.trigger();

    // Check for errors after validation
    if (!isValid) {
      const part1Fields: (keyof FormValuesProps)[] = [
        "distributorID",
        "distributorName",
        "address",
        "addressLine1",
        "addressLine2",
        "provinceUId",
        "districtUId",
        "townUId",
        "phone",
      ];

      const part2Fields: (keyof FormValuesProps)[] = [
        "titleUId",
        "ownerName",
        "ownerAddr",
        "ownerAddressLine1",
        "ownerAddressLine2",
        "ownerTpNo",
        "mobileNo",
      ];

      const part3Fields: (keyof FormValuesProps)[] = [
        "appointedDate",
        "businessCategoryUId",
        "paymentTermUId",
      ];

      const part4Fields: (keyof FormValuesProps)[] = [
        "priceListAssignmentUIds",
        "priceListAssignmentDefaultUId",
      ];

      const part5Fields: (keyof FormValuesProps)[] = [
        "cashAccountAssignmentUIds",
        "cashAccountAssignmentDefaultUId",
      ];

      const part6Fields: (keyof FormValuesProps)[] = [
        "chequeAccountAssignmentUIds",
        "chequeAccountAssignmentDefaultUId",
      ];

      const part7Fields: (keyof FormValuesProps)[] = [
        "outstandingAccountAssignmentUIds",
        "outstandingAccountAssignmentDefaultUId",
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
      const part4Error = part4Fields.some((field) => currentErrors[field]);
      if (part4Error) {
        setExpand4(true);
      }
      const part5Error = part5Fields.some((field) => currentErrors[field]);
      if (part5Error) {
        setExpand5(true);
      }
    }
  };

  const handleSubmitClick = async () => {
    await handleClick();
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.distributor.list);
  };

  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    if (!isloadingCity && !districtIsLoading && !provinceIsLoading) {
      setTimeout(() => {
        setShowGrid(true);
      }, 500);
    } else {
      setShowGrid(false);
    }
  }, [isloadingCity, districtIsLoading, provinceIsLoading]);

  const handleReset = () => {
    reset(defaultValues);
    setPhoneNum("+94");
    setOwnerTpNum("+94");
    setmobileNum("+94");
  };

  useEffect(() => {
    if (watchPriceListAssignmentUIds) {
      clearErrors(["priceListAssignmentDefaultUId"]);
    }
  }, [clearErrors, watchPriceListAssignmentUIds]);

  useEffect(() => {
    if (watchCashAccountAssignmentUIds) {
      clearErrors(["cashAccountAssignmentDefaultUId"]);
    }
  }, [clearErrors, watchCashAccountAssignmentUIds]);

  useEffect(() => {
    if (watchChequeAccountAssignmentUIds) {
      clearErrors(["chequeAccountAssignmentDefaultUId"]);
    }
  }, [clearErrors, watchChequeAccountAssignmentUIds]);

  useEffect(() => {
    if (watchOutstandingAccountAssignmentUIds) {
      clearErrors(["outstandingAccountAssignmentDefaultUId"]);
    }
  }, [clearErrors, watchOutstandingAccountAssignmentUIds]);

  return (
    <>
      {isEdit && (
        <Box>
          {isloadingCity ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "170px",
                }}
              >
                <CircularProgress />
              </Box>
            </>
          ) : null}
        </Box>
      )}
      <FormProvider
        methods={methods}
        onSubmit={
          !isEdit
            ? handleSubmit(handleCreateDistributor, onError)
            : handleSubmit(handleUpdateDistributor, onError)
        }
      >
        <Grid
          item
          xs={12}
          sx={{
            mb: 3,
            position: "relative",
            display: (
              isEdit
                ? !showGrid ||
                  isloadingCity ||
                  districtIsLoading ||
                  provinceIsLoading
                : false
            )
              ? "none"
              : "block",
          }}
        >
          {/* Distributor details */}
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
                Distributor Details
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
              <RHFTextField name="distributorID" label="Code*" />
              <RHFTextField name="distributorName" label="Name*" />
              <RHFTextField name="address" label="Address Line 1*" />
              <RHFTextField name="addressLine1" label="Address Line 2" />
              <RHFTextField name="addressLine2" label="Address Line 3" />

              <RHFAutocompleteField
                name="provinceUId"
                label="Province*"
                placeholder="Province*"
                options={provinceMap}
                control={control}
                onChange={handleProvinceChange}
                rules={{ required: true }}
                inputProps={{
                  form: {
                    autocomplete: "off",
                  },
                }}
              />

              <RHFAutocompleteField
                name="districtUId"
                placeholder="District*"
                options={districtListByProvince}
                control={control}
                disabled={isDistrictDisabled}
                onChange={handleDistrictChange}
                rules={{ required: true }}
                inputProps={{
                  form: {
                    autocomplete: "off",
                  },
                }}
              />

              <RHFAutocompleteField
                name="townUId"
                placeholder="Town*"
                options={townListByDistrict}
                control={control}
                disabled={isTownDisabled}
                rules={{ required: true }}
                inputProps={{
                  form: {
                    autocomplete: "off",
                  },
                }}
              />
              <RHFMuiPhone
                name="phone"
                value={isEdit ? defaultValues.phone ?? "" : phoneNum ?? ""}
                onChange={setPhoneNum}
                control={control}
                label="Phone*"
              />

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
              <RHFAutocompleteField
                name="titleUId"
                placeholder="Title*"
                options={titleMap}
                control={control}
                inputProps={{
                  form: {
                    autocomplete: "off",
                  },
                }}
              />

              <RHFTextField name="ownerName" label="Owner Name*" />
              <RHFTextField name="ownerAddr" label="Owner Address Line 1*" />
              <RHFTextField
                name="ownerAddressLine1"
                label="Owner Address Line 2"
              />
              <RHFTextField
                name="ownerAddressLine2"
                label="Owner Address Line 3"
              />
              <RHFMuiPhone
                name="ownerTpNo"
                value={
                  isEdit ? defaultValues.ownerTpNo ?? "" : ownerTpNum ?? ""
                }
                onChange={setOwnerTpNum}
                label="Telephone Number*"
              />
              <RHFMuiPhone
                name="mobileNo"
                value={isEdit ? defaultValues.mobileNo ?? "" : mobileNum ?? ""}
                onChange={setmobileNum}
                label="Mobile Number*"
              />
            </Box>
          </Accordion>

          {/* Other details */}
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
                Additional Details
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
              <RHFDatePicker
                name="appointedDate"
                label="Appointed Date*"
                disableFuture={true}
                onChange={(date: any) => {
                  setValue("appointedDate", date);
                }}
                value={
                  defaultValues.appointedDate
                    ? new Date(defaultValues.appointedDate)
                    : null
                }
                renderInput={(params) => <TextField {...params} />}
              />

              <RHFAutocompleteField
                name="businessCategoryUId"
                placeholder="Business Category*"
                options={businessCategoryMap}
                control={control}
                inputProps={{
                  form: {
                    autocomplete: "off",
                  },
                }}
              />

              <RHFAutocompleteField
                name="paymentTermUId"
                placeholder="Payment Term*"
                options={paymentTermMap}
                control={control}
                inputProps={{
                  form: {
                    autocomplete: "off",
                  },
                }}
              />
            </Box>
          </Accordion>

          {/* Price List assignment */}
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
                rules={{ required: true }}
              />
              {selectedPriceLists && selectedPriceLists.length > 0 && (
                <Box>
                  <FormLabel component="legend">
                    Select Default Price List
                  </FormLabel>
                  <Controller
                    name="priceListAssignmentDefaultUId"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <RadioGroup {...field}>
                          {selectedPriceLists.map((priceList: any) => (
                            <FormControlLabel
                              sx={{ width: "fit-content" }}
                              key={priceList.value}
                              value={Number(priceList.value)}
                              control={<Radio />}
                              label={priceList.priceListTypeName}
                            />
                          ))}
                        </RadioGroup>
                        {error && (
                          <Typography variant="caption" color="error">
                            {error.message}
                          </Typography>
                        )}
                      </>
                    )}
                  />
                </Box>
              )}
            </Box>
          </Accordion>

          {/* Account assignment */}
          <Accordion
            expanded={expand5}
            onChange={() => setExpand5(!expand5)}
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
                Account Assignment
              </Typography>
            </AccordionSummary>
            <Typography variant="body2" sx={{ mx: 12, fontWeight: 600, mb: 3 }}>
              Cash Account Assignment
            </Typography>
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
                name="cashAccountAssignmentUIds"
                placeholder="Cash Accounts"
                options={distributorAccountsListTypeMap}
                control={control}
                rules={{ required: true }}
              />
              {selectedCashAccounts && selectedCashAccounts.length > 0 && (
                <Box>
                  <FormLabel component="legend">
                    Select Default Cash Account
                  </FormLabel>
                  <Controller
                    name="cashAccountAssignmentDefaultUId"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <RadioGroup {...field}>
                          {selectedCashAccounts.map((cashAccount: any) => (
                            <FormControlLabel
                              sx={{ width: "fit-content" }}
                              key={cashAccount.value}
                              value={Number(cashAccount.value)}
                              control={<Radio />}
                              label={cashAccount.accountName}
                            />
                          ))}
                        </RadioGroup>
                        {error && (
                          <Typography variant="caption" color="error">
                            {error.message}
                          </Typography>
                        )}
                      </>
                    )}
                  />
                </Box>
              )}
            </Box>
            <Typography variant="body2" sx={{ mx: 12, fontWeight: 600, mb: 3 }}>
              Cheque Account Assignment
            </Typography>
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
                name="chequeAccountAssignmentUIds"
                placeholder="Cheque Accounts"
                options={distributorAccountsListTypeMap}
                control={control}
                rules={{ required: true }}
              />
              {selectedChequeAccounts && selectedChequeAccounts.length > 0 && (
                <Box>
                  <FormLabel component="legend">
                    Select Default Cheque Account
                  </FormLabel>
                  <Controller
                    name="chequeAccountAssignmentDefaultUId"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <RadioGroup {...field}>
                          {selectedChequeAccounts.map((chequeAccount: any) => (
                            <FormControlLabel
                              sx={{ width: "fit-content" }}
                              key={chequeAccount.value}
                              value={Number(chequeAccount.value)}
                              control={<Radio />}
                              label={chequeAccount.accountName}
                            />
                          ))}
                        </RadioGroup>
                        {error && (
                          <Typography variant="caption" color="error">
                            {error.message}
                          </Typography>
                        )}
                      </>
                    )}
                  />
                </Box>
              )}
            </Box>
            <Typography variant="body2" sx={{ mx: 12, fontWeight: 600, mb: 3 }}>
              Outstanding Account Assignment
            </Typography>
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
                name="outstandingAccountAssignmentUIds"
                placeholder="Outstanding Accounts"
                options={distributorAccountsListTypeMap}
                control={control}
                rules={{ required: true }}
              />
              {selectedOutstandingAccounts &&
                selectedOutstandingAccounts.length > 0 && (
                  <Box>
                    <FormLabel component="legend">
                      Select Default Outstanding Account
                    </FormLabel>
                    <Controller
                      name="outstandingAccountAssignmentDefaultUId"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <>
                          <RadioGroup {...field}>
                            {selectedOutstandingAccounts.map(
                              (outAccount: any) => (
                                <FormControlLabel
                                  sx={{ width: "fit-content" }}
                                  key={outAccount.value}
                                  value={Number(outAccount.value)}
                                  control={<Radio />}
                                  label={outAccount.accountName}
                                />
                              )
                            )}
                          </RadioGroup>
                          {error && (
                            <Typography variant="caption" color="error">
                              {error.message}
                            </Typography>
                          )}
                        </>
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
