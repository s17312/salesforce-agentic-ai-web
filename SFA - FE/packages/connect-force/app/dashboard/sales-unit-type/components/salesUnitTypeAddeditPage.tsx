"use client";

import {
  RHFAutocompleteField,
  RHFCheckbox,
  RHFTextField,
} from "@/components/hook-form";
import FormProvider from "@/components/hook-form/FormProvider";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  createSalesUnitType,
  getAllBaseUnitTypeDetails,
  updateSalesUnitType,
} from "@/service/salesUnitType.service";
import {
  FormValuesPropsSalesUnitType,
  SalesUnitType,
} from "@/types/sales-unit-type-types";
import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { SaveIcon } from "@/components/icons/saveIcon";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  setSalesUnitTypeError,
  setSalesUnitTypeMessage,
} from "@/redux/slices/sales-unit-type-slice";
import { mapListToOptions } from "@/utils/sortUtils";
import { LoadingButton } from "@mui/lab";
import { salesUnitTypeValidationSchema } from "@/utils/schemas/salesUnitTypeValidationSchema";

type props = {
  currentSalesUnitType?: SalesUnitType | undefined;
  isEdit?: boolean;
};

export default function SalesUnitTypeForm({
  currentSalesUnitType,
  isEdit = false,
}: props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const baseUnitTypeList = useSelector(
    (state) => state.salesUnitTypeSlice.baseUnitTypeDetails
  );
  const [showDependentFields, setShowDependentFields] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const isFetchingData = useRef(false);

  const defaultValues = useMemo(() => {
    return {
      unitId: currentSalesUnitType?.unitId || "",
      unitName: currentSalesUnitType?.unitName || "",
      description: currentSalesUnitType?.description || "",
      isBaseUnit: currentSalesUnitType?.isBaseUnit ?? true,
      ratio: currentSalesUnitType?.ratio || null,
      baseUnitId: currentSalesUnitType?.baseUnitId || null,
    };
  }, [currentSalesUnitType]);

  const responseMessage = useSelector(
    (state) => state.salesUnitTypeSlice.message
  );
  const responseError = useSelector((state) => state.salesUnitTypeSlice.error);

  useEffect(() => {
    if ((isEdit && currentSalesUnitType) || isDataLoaded) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentSalesUnitType, isDataLoaded]);

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setSalesUnitTypeMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setSalesUnitTypeError(null));
    }
  }, [responseMessage, responseError]);

  const methods = useForm<FormValuesPropsSalesUnitType>({
    //@ts-ignore
    resolver: yupResolver(salesUnitTypeValidationSchema),
    defaultValues,
    mode: "all",
  });

  const fetchBaseUnitData = async (forceFetch = false) => {
    if ((!isDataLoaded || forceFetch) && !isFetchingData.current) {
      isFetchingData.current = true;
      try {
        await getAllBaseUnitTypeDetails();
        setIsDataLoaded(true);
      } catch (error) {
        enqueueSnackbar(`Something went wrong`, { variant: "error" });
      } finally {
        isFetchingData.current = false;
      }
    }
  };

  const filteredBaseUnitList = baseUnitTypeList.filter(
    (item) => item.unitName !== currentSalesUnitType?.unitName
  );
  const baseUnitMap = mapListToOptions(filteredBaseUnitList, "unitName", "uId");

  const {
    handleSubmit,
    reset,
    formState,
    control,
    getValues,
    setValue,
    clearErrors,
  } = methods;

  useWatch({
    control,
    name: ["isBaseUnit", "baseUnitId"],
  });

  const isBaseUnitGetValue = getValues("isBaseUnit");

  useEffect(() => {
    if (isBaseUnitGetValue) {
      setValue("baseUnitId", null);
      clearErrors(["baseUnitId"]);
    }
  }, [isBaseUnitGetValue, setValue, clearErrors]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDependentFields(!isBaseUnitGetValue);
    });
    return () => clearTimeout(timer);
  }, [isBaseUnitGetValue]);

  useEffect(() => {
    if (!baseUnitTypeList.length) {
      fetchBaseUnitData();
    }
  }, [baseUnitTypeList]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/[^0-9.,]/g, "");
  };

  const handleCreateSalesUnitType = async (
    data: FormValuesPropsSalesUnitType
  ) => {
    if (data.isBaseUnit) {
      data.baseUnitId = null;
    }

    try {
      await createSalesUnitType(data);
      reset(defaultValues);

      if (data.isBaseUnit) {
        await fetchBaseUnitData(true);
      }

      router.push(PATH_DASHBOARD.salesUnitType.list);
    } catch (error: any) {}
  };

  const handleUpdateSalesUnitType = async (
    data: FormValuesPropsSalesUnitType
  ) => {
    if (data.isBaseUnit) {
      data.baseUnitId = null;
    } else {
      data.baseUnitId = data.baseUnitId ? Number(data.baseUnitId) : null;
      data.ratio = data.ratio ? Number(data.ratio) : null;
    }
    try {
      await updateSalesUnitType(currentSalesUnitType?.uId, data);
      if (data.isBaseUnit) {
        await fetchBaseUnitData(true);
      }
      router.push(PATH_DASHBOARD.salesUnitType.list);
    } catch (error: any) {}
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.salesUnitType.list);
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={
        !isEdit
          ? handleSubmit(handleCreateSalesUnitType)
          : handleSubmit(handleUpdateSalesUnitType)
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
            aria-controls="Sales Unit Type Creation"
            id="panel1a-header"
            sx={cursorDefault}
          >
            <Typography variant="body1" sx={{ ml: 5, fontWeight: 500 }}>
              Sales Unit Type Details
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
            <RHFTextField name="unitId" label="Code*" />
            <RHFTextField name="unitName" label="Name*" />
            <RHFTextField name="description" label="Description" />
            <Box>
              <RHFCheckbox name="isBaseUnit" label="Base Unit" />
            </Box>
            {showDependentFields ? (
              <RHFAutocompleteField
                name="baseUnitId"
                label="Base Unit*"
                placeholder="Base Unit*"
                options={baseUnitMap}
                control={control}
                inputProps={{
                  form: {
                    autocomplete: "off",
                  },
                }}
              />
            ) : null}
            <RHFTextField
              name="ratio"
              label="Quantity*"
              inputProps={{
                onInput: handleInput,
                maxLength: 10,
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
                onClick={() => reset(defaultValues)}
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
