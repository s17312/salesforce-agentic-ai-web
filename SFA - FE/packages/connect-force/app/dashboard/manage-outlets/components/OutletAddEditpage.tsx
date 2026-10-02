import { useEffect, useMemo, useState } from "react";
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
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider from "@/components/hook-form/FormProvider";
import { outletValidationSchema } from "@/utils/schemas/outletSchema";
import { OutletFormValuesProps } from "connect-force-api-client/models/outlet";
import { createOutlet, updateOutlet } from "@/service/outlet.service";
import { dispatch, useSelector } from "@/redux/store";
import { getAllProvinces } from "@/service/provinces.service";
import { getAllDistrictsByProvince } from "@/service/districts.service";
import { getAllTownsByDistrict } from "@/service/towns.service";
import { getAllActiveOutletCategories } from "@/service/outletCategory.service";
import { getAllActiveOutletClassifications } from "@/service/outletClassification.service";
import { getAllActiveOutletStatus } from "@/service/outletStatus.service";
import { getAllActivePaymentModes } from "@/service/paymentMode.service";
import { useSnackbar } from "../../../../components/snackbar";
import { PATH_DASHBOARD } from "../../../../routes/paths";
import { useRouter } from "next/navigation";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SaveIcon } from "@/components/icons/saveIcon";
import RHFAutocompleteField from "@/components/hook-form/RHFAutocompleteField";
import React from "react";
import { RHFMuiPhone } from "@/components/hook-form/RHFMobileDropdown";
import { cleanMobileInput, getDialCode } from "@/utils/phoneNumbers";
import { setOutletError, setOutletMessage } from "@/redux/slices/outlet-slice";
import { Outlet } from "@/types/outlet-types";
import { checkIfIdIsActive } from "@/utils/checkIfIdIsActive";
import { getPriceListAllByPriceType } from "@/service/mapping-service/priceListType.service";
import RHFAutocompleteCheckboxField from "@/components/hook-form/RHFAutocompleteCheckboxField";
import { setAllPriceListTypeDetails } from "@/redux/slices/price-list-type-slice";
import { RHFCheckbox, RHFTextField } from "@/components/hook-form";
import { getAllActiveMainOutlets } from "@/service/main-outlet.service";

type Props = {
  currentOutlet?: Outlet | undefined;
  isEdit?: boolean;
};

export default function OutletAddForm({
  currentOutlet,
  isEdit = false,
}: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const parentOutletsList = useSelector(
    (state) => state.mainOutletSlice.parentOutlets
  );
  const { provinces: provincesList, isLoading: provinceIsLoading } =
    useSelector((state) => state.provinceSlice);
  const { districts: districtsList, isLoading: districtIsLoading } =
    useSelector((state) => state.districtSlice);
  const { towns: townsList, isLoading: isloadingCity } = useSelector(
    (state) => state.townSlice
  );
  const { outletCategories: outletCategoryList } = useSelector(
    (state) => state.outletCategorySlice
  );
  const { outletClassifications: outletClassificationList } = useSelector(
    (state) => state.outletClassificationSlice
  );
  const { outletStatuss: outletStatusList } = useSelector(
    (state) => state.outletStatusSlice
  );
  const { paymentModes: paymentModeList } = useSelector(
    (state) => state.paymentModeSlice
  );
  const responseMessage = useSelector((state) => state.outlet.message);
  const priceListTypeList = useSelector(
    (state) => state.priceListTypeSlice.priceListTypeDetails
  );

  const responseError = useSelector((state) => state.outlet.error);
  const [contactno1, setContactno1] = useState("+94");
  const [contactno2, setcontactno2] = useState("+94");
  const [ownerTpNum, setOwnerTpNum] = useState("+94");

  const [expand1, setExpand1] = useState(true);
  const [expand2, setExpand2] = useState(false);
  const [expand3, setExpand3] = useState(false);
  const [expand4, setExpand4] = useState(false);

  const [isDistrictDisabled, setIsDistrictDisabled] = useState(true);
  const [isTownDisabled, setIsTownDisabled] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const defaultValues = useMemo(() => {
    return {
      parentOutletUId: currentOutlet?.parentOutletUId || null,
      outletID: currentOutlet?.outletID || "",
      name: currentOutlet?.name || "",
      address: currentOutlet?.address || "",
      addressLine1: currentOutlet?.addressLine1 || "",
      addressLine2: currentOutlet?.addressLine2 || "",
      motherCompanyAddress: currentOutlet?.motherCompanyAddress || "",
      motherCompanyAddressLine1: currentOutlet?.motherCompanyAddressLine1 || "",
      motherCompanyAddressLine2: currentOutlet?.motherCompanyAddressLine2 || "",
      provinceUId: currentOutlet?.provinceUId || null,
      province: currentOutlet?.province?.nameEN || "",
      districtUId: currentOutlet?.districtUId || null,
      district: currentOutlet?.district?.name_en || "",
      cityUId: currentOutlet?.cityUId || null,
      contactNo1CountryCode: currentOutlet?.contactNo1CountryCode || "",
      contactNo2CountryCode: currentOutlet?.contactNo2CountryCode || "",
      contactNo1: currentOutlet?.contactNo1 || "",
      contactNo2: currentOutlet?.contactNo2 || "",
      outletCategoryUId:
        currentOutlet?.outletCategoryUId !== undefined
          ? checkIfIdIsActive(
            currentOutlet.outletCategoryUId,
            outletCategoryList
          )
          : null,
      outletClassificationUId:
        currentOutlet?.outletClassificationUId !== undefined
          ? checkIfIdIsActive(
            currentOutlet.outletClassificationUId,
            outletClassificationList
          )
          : null,
      outletStatusUId:
        currentOutlet?.outletStatusUId !== undefined
          ? checkIfIdIsActive(currentOutlet.outletStatusUId, outletStatusList)
          : null,
      ownerName: currentOutlet?.ownerName || "",
      ownerNIC: currentOutlet?.ownerNIC || "",
      ownerContactNoCountryCode: currentOutlet?.ownerContactNoCountryCode || "",
      ownerContactNo: currentOutlet?.ownerContactNo || "",
      brNo: currentOutlet?.brNo || "",
      vatNo: currentOutlet?.vatNo || "",
      lat: currentOutlet?.lat || "",
      long: currentOutlet?.long || "",
      qrCode: currentOutlet?.qrCode || "",
      isExclusive: currentOutlet?.isExclusive || false,
      exclusiveRemark: currentOutlet?.exclusiveRemark || "",
      paymentModeUId: currentOutlet?.paymentModeUId || null,
      isDiscountEligible: currentOutlet?.isDiscountEligible || false,
      creditLimit: currentOutlet?.creditLimit || null,
      creditInvoiceLimit: currentOutlet?.creditInvoiceLimit || null,
      creditDays: currentOutlet?.creditDays || null,
      additionalNotes: currentOutlet?.additionalNotes || "",
      isAssetAvailable: currentOutlet?.isAssetAvailable || false,
      priceListAssignmentUIds: Array.isArray(currentOutlet?.priceListType)
        ? currentOutlet.priceListType.map((item: any) => item.uId)
        : null,
      priceListAssignmentDefaultUId:
        currentOutlet?.priceListAssignmentDefaultUId || null,
    };
  }, [
    currentOutlet,
    outletCategoryList,
    outletClassificationList,
    outletStatusList,
  ]);

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setOutletMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setOutletError(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseMessage, responseError]);

  useEffect(() => {
    if ((isEdit && currentOutlet) || isDataLoaded) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentOutlet, isDataLoaded]);

  const fetchData = async () => {
    try {
      await Promise.all([
        getAllProvinces(),
        getAllActiveOutletClassifications(),
        getAllActiveOutletCategories(),
        getAllActivePaymentModes(),
        getAllActiveOutletStatus(),
        getAllActiveMainOutlets(),
      ]);
      setIsDataLoaded(true);
    } catch (error) {
      console.error("Error in getting data", error);
    }
  };

  const fetchPriceListsData = async () => {
    try {
      await getPriceListAllByPriceType(3);
    } catch (error) {
      console.error("Error in getting price list data", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchPriceListsData();
  }, []);

  const methods = useForm<OutletFormValuesProps>({
    // @ts-ignore
    resolver: yupResolver(outletValidationSchema),
    defaultValues,
    mode: "all",
  });

  const { handleSubmit, reset, formState, setValue, control, watch, setFocus } =
    methods;

  // Using errors from formState to trigger re-renders on validation changes.
  // This is necessary for dynamic form validation feedback.
  useEffect(() => { }, [formState.errors]);

  const selectedPriceListsIDs: number[] =
    watch("priceListAssignmentUIds") || [];

  // Only include items that are in the currently selected IDs
  const selectedPriceLists = selectedPriceListsIDs.map(
    (priceListId: number) => {
      const priceListType = priceListTypeList.find(
        (pl: any) => pl.uId === priceListId
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

  useEffect(() => {
    // if watchPriceListAssignmentDefaultUId is not in the watchPriceListAssignmentUIds, saetValue null for watchPriceListAssignmentDefaultUId
    if (
      watchPriceListAssignmentDefaultUId &&
      !watchPriceListAssignmentUIds?.includes(
        watchPriceListAssignmentDefaultUId
      )
    ) {
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

  const w_province = watch("provinceUId");
  const w_district = watch("districtUId");

  useEffect(() => {
    w_province && getAllDistrictsByProvince(parseInt(`${w_province}`));
  }, [w_province]);

  useEffect(() => {
    w_district && getAllTownsByDistrict(parseInt(`${w_district}`));
  }, [w_district]);

  /*PREPARE OUTLET DATA*/
  const prepareOutletData = (data: OutletFormValuesProps) => {
    let cleanedContactNo1 = data.contactNo1;
    let contactno1countrycode = data.contactNo1CountryCode;
    let cleanedContactNo2 = data.contactNo2;
    let contactno2countrycode = data.contactNo2CountryCode;
    let cleanedOwnerContactNo = data.ownerContactNo;
    let ownercontactnocountrycode = data.ownerContactNoCountryCode;
    let priceListAssignmentDefaultUId = Number(
      data.priceListAssignmentDefaultUId
    );

    // Only clean and extract data for phone if it includes a space
    if (data.contactNo1 && data.contactNo1.includes(" ")) {
      cleanedContactNo1 = cleanMobileInput(data.contactNo1);
      contactno1countrycode = getDialCode(data.contactNo1);
    }
    // Only clean and extract data for mobileNo if it includes a space
    if (data.contactNo2 && data.contactNo2.includes(" ")) {
      cleanedContactNo2 = cleanMobileInput(data.contactNo2);
      contactno2countrycode = getDialCode(data.contactNo2);
    }
    // Only clean and extract data for ownerTpNo if it includes a space
    if (data.ownerContactNo && data.ownerContactNo.includes(" ")) {
      cleanedOwnerContactNo = cleanMobileInput(data.ownerContactNo);
      ownercontactnocountrycode = getDialCode(data.ownerContactNo);
    }
    // Set priceListAssignmentDefaultUId to null if priceListAssignmentUIds is null
    if (data.priceListAssignmentUIds === null) {
      priceListAssignmentDefaultUId = 0;
    }

    return {
      ...data,
      contactNo1CountryCode: contactno1countrycode,
      contactNo1: cleanedContactNo1,
      contactNo2CountryCode: contactno2countrycode,
      contactNo2: cleanedContactNo2,
      ownercontactnocountrycode: ownercontactnocountrycode,
      ownerContactNo: cleanedOwnerContactNo,
      priceListAssignmentDefaultUId: priceListAssignmentDefaultUId,
    };
  };

  const handleCreateOutlet = async (data: OutletFormValuesProps) => {
    const cleanedData = prepareOutletData(data);
    await createOutlet(cleanedData);
    reset(defaultValues);
    router.push(PATH_DASHBOARD.outlet.list);
    dispatch(setAllPriceListTypeDetails([]));
  };

  const handleUpdateOutlet = async (data: OutletFormValuesProps) => {
    const cleanedData = prepareOutletData(data);
    await updateOutlet(currentOutlet?.uId, cleanedData);
    router.push(PATH_DASHBOARD.outlet.list);
    dispatch(setAllPriceListTypeDetails([]));
  };

  // Generic mapping function
  const mapListToOptions = (list: any[], labelKey: string, valueKey: string) =>
    list.map((item) => ({
      label: item[labelKey],
      value: item[valueKey],
    }));

  // Usage with different lists
  const parentOutletsOptions = mapListToOptions(parentOutletsList, "name", "uId");
  const provinceMap = mapListToOptions(provincesList, "nameEN", "uId");
  const districtListByProvince = mapListToOptions(
    districtsList,
    "name_en",
    "uId"
  );
  const townListByDistrict = mapListToOptions(townsList, "name_en", "uId");
  const outletCategoryMap = mapListToOptions(
    outletCategoryList,
    "outletCategoryName",
    "uId"
  );
  const outletClassificationMap = mapListToOptions(
    outletClassificationList,
    "classification",
    "uId"
  );
  const outletStatusMap = mapListToOptions(
    outletStatusList,
    "statusName",
    "uId"
  );
  const paymentModeMap = mapListToOptions(
    paymentModeList,
    "paymentModeType",
    "uId"
  );
  const priceListTypeMap = mapListToOptions(
    priceListTypeList,
    "priceListTypeName",
    "uId"
  );

  const handleProvinceChange = (value: any) => {
    setValue("provinceUId", value);

    setValue("cityUId", null);
    if (!value) {
      setValue("cityUId", null);
      setValue("districtUId", null);
    }
  };

  const handleDistrictChange = (value: any) => {
    setValue("districtUId", value);

    if (!value) {
      setValue("cityUId", null);
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

  const handleClick = async () => {
    // Trigger validation for all fields
    const isValid = await methods.trigger();

    // Check for errors after validation
    if (!isValid) {
      const part1Fields: (keyof OutletFormValuesProps)[] = [
        "parentOutletUId",
        "outletID",
        "name",
        "address",
        "addressLine1",
        "addressLine2",
        "provinceUId",
        "districtUId",
        "cityUId",
        "contactNo1",
        "contactNo2",
        "outletCategoryUId",
        "outletClassificationUId",
        "brNo",
        "vatNo",
        "lat",
        "long",
        "qrCode",
        "isExclusive",
        "exclusiveRemark",
        "outletStatusUId",
      ];

      const part2Fields: (keyof OutletFormValuesProps)[] = [
        "motherCompanyAddress",
        "motherCompanyAddressLine1",
        "motherCompanyAddressLine2",
        "ownerName",
        "ownerNIC",
        "ownerContactNo",
      ];

      const part3Fields: (keyof OutletFormValuesProps)[] = [
        "paymentModeUId",
        "isDiscountEligible",
        "creditLimit",
        "creditInvoiceLimit",
        "creditDays",
        "additionalNotes",
        "isAssetAvailable",
      ];

      const part4Fields: (keyof OutletFormValuesProps)[] = [
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

      const part4Error = part4Fields.some((field) => currentErrors[field]);
      if (part4Error) {
        setExpand3(true);
      }
    }
  };

  const handleSubmitClick = async () => {
    await handleClick();
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.outlet.list);
  };

  const [showGrid, setShowGrid] = useState(false);
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/[^0-9.,]/g, "");
  };
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
    setContactno1("+94");
    setOwnerTpNum("+94");
    setcontactno2("+94");
  };

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
            ? handleSubmit(handleCreateOutlet, onError)
            : handleSubmit(handleUpdateOutlet, onError)
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
                Outlet Details
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
                name="parentOutletUId"
                label="Parent Outlet"
                placeholder="Parent Outlet"
                options={parentOutletsOptions}
                control={control}
                // onChange={handleProvinceChange}
                rules={{ required: true }}
                inputProps={{
                  form: {
                    autocomplete: "off",
                  },
                }}
              />
              <RHFTextField name="outletID" label="Code*" />
              <RHFTextField name="name" label="Name*" />
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
                name="cityUId"
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
                name="contactNo1"
                value={
                  isEdit ? defaultValues.contactNo1 ?? "" : contactno1 ?? ""
                }
                onChange={setContactno1}
                control={control}
                label="Contact No 1*"
              />
              <RHFMuiPhone
                name="contactNo2"
                value={
                  isEdit ? defaultValues.contactNo2 ?? "" : contactno2 ?? ""
                }
                onChange={setcontactno2}
                control={control}
                label="Contact No 2"
              />
              <RHFAutocompleteField
                name="outletCategoryUId"
                placeholder="Outlet Category*"
                options={outletCategoryMap}
                control={control}
                inputProps={{
                  form: {
                    autocomplete: "off",
                  },
                }}
              />
              <RHFAutocompleteField
                name="outletClassificationUId"
                placeholder="Outlet Classification*"
                options={outletClassificationMap}
                control={control}
                inputProps={{
                  form: {
                    autocomplete: "off",
                  },
                }}
              />
              <RHFTextField name="brNo" label="Business Registration Number" />
              <RHFTextField name="vatNo" label="VAT Number" />
              <RHFTextField name="lat" label="Latitude" />
              <RHFTextField name="long" label="Longitude" />
              <RHFTextField name="qrCode" label="QR Code" />

              <RHFCheckbox name="isExclusive" label="Is Exclusive" />

              <RHFTextField name="exclusiveRemark" label="Exclusive Remark" />
              <RHFAutocompleteField
                name="outletStatusUId"
                placeholder="Outlet Status*"
                options={outletStatusMap}
                control={control}
                inputProps={{
                  form: {
                    autocomplete: "off",
                  },
                }}
              />
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
              <RHFAutocompleteField
                name="paymentModeUId"
                placeholder="Payment Mode*"
                options={paymentModeMap}
                control={control}
                inputProps={{
                  form: {
                    autocomplete: "off",
                  },
                }}
              />

              <RHFCheckbox
                name="isDiscountEligible"
                label="Is Discount Eligible"
              />

              <RHFTextField
                name="creditLimit"
                label="Credit Limit"
                inputProps={{
                  onInput: handleInput,
                  maxLength: 15,
                }}
              />
              <RHFTextField
                name="creditInvoiceLimit"
                label="Credit Invoice Limit"
                inputProps={{
                  onInput: handleInput,
                  maxLength: 5,
                }}
              />
              <RHFTextField
                name="creditDays"
                label="Credit Days"
                inputProps={{
                  onInput: handleInput,
                  maxLength: 5,
                }}
              />
              <RHFTextField name="additionalNotes" label="Additional Notes" />

              <RHFCheckbox name="isAssetAvailable" label="Is Asset Available" />
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
              />
              {selectedPriceLists && selectedPriceLists.length > 0 && (
                <Box>
                  <FormLabel component="legend">
                    Select Default Price List
                  </FormLabel>
                  <Controller
                    name="priceListAssignmentDefaultUId"
                    control={control}
                    render={({ field }) => (
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
