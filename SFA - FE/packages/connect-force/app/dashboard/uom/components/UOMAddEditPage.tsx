"use client";

import { useSnackbar } from "notistack";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { uomValidationSchema } from "@/utils/schemas/uomSchema";
import {
  createUOM,
  getAllBaseActiveUOMs,
  updateUOM,
} from "@/service/uom.service";
import { PATH_DASHBOARD } from "@/routes/paths";
import FormProvider from "@/components/hook-form/FormProvider";
import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import RHFAutocompleteField from "@/components/hook-form/RHFAutocompleteField";
import { RHFCheckbox, RHFTextField } from "@/components/hook-form";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@mui/lab";
import { SaveIcon } from "@/components/icons/saveIcon";
import { dispatch, useSelector } from "@/redux/store";
import { setUOMError, setUOMMessage } from "@/redux/slices/uom-slice";
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { mapListToOptions } from "@/utils/sortUtils";
import { AddEditUOM } from "@/types/uom-types";

export type FormValuesProps = {
  uomId?: string | null;
  shortName?: string | null;
  description?: string | null;
  isNotBaseUnit?: boolean | null;
  baseUnitUId?: number | null;
  count?: number | null;
};

type props = {
  currentUOM?: AddEditUOM | undefined;
  isEdit?: boolean;
};

export default function UOMAddEditForm({ currentUOM, isEdit = false }: props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { uoms: baseUnitList, isLoading: baseUnitIsLoading } = useSelector(
    (state) => state.uomSlice
  );

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const defaultValues = useMemo(() => {
    return {
      uomId: currentUOM?.uomId || "",
      shortName: currentUOM?.shortName || "",
      description: currentUOM?.description || "",
      isNotBaseUnit: currentUOM?.isNotBaseUnit || false,
      baseUnitUId: currentUOM?.baseUnitUId || null,
      count: currentUOM?.count || 1,
    };
  }, [currentUOM]);

  const responseMessage = useSelector((state) => state.uomSlice.message);
  const responseError = useSelector((state) => state.uomSlice.error);

  useEffect(() => {
    if ((isEdit && currentUOM) || isDataLoaded) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentUOM, isDataLoaded]);

  const fetchData = async () => {
    try {
      await Promise.all([getAllBaseActiveUOMs()]);
      setIsDataLoaded(true);
    } catch (error) {
      console.error("Error in getting data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setUOMMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setUOMError(null));
    }
  }, [responseMessage, responseError]);

  const methods = useForm<FormValuesProps>({
    //@ts-ignore
    resolver: yupResolver(uomValidationSchema),
    defaultValues,
    mode: "all",
  });

  const filteredBaseUnitList = baseUnitList.filter(
    (item) => item.uomId !== currentUOM?.uomId
  );
  const baseUnitMap = mapListToOptions(
    filteredBaseUnitList,
    "shortName",
    "uId"
  );

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
    name: ["count", "isNotBaseUnit", "baseUnitUId"],
  });

  let isNotBaseUnitGetValue = getValues("isNotBaseUnit");

  useEffect(() => {
    if (!isNotBaseUnitGetValue) {
      setValue("baseUnitUId", null);
      setValue("count", null);
      clearErrors(["baseUnitUId", "count"]);
    }
  }, [isNotBaseUnitGetValue, setValue, clearErrors]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/[^0-9.,]/g, "");
  };

  const handleCreateUOM = async (data: FormValuesProps) => {
    try {
      await createUOM(data);
      reset(defaultValues);
      router.push(PATH_DASHBOARD.uom.list);
    } catch (error: any) {}
  };

  const handleUpdateUOM = async (data: FormValuesProps) => {
    try {
      await updateUOM(currentUOM?.uId, data);
      router.push(PATH_DASHBOARD.uom.list);
    } catch (error: any) {}
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.uom.list);
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={
        !isEdit ? handleSubmit(handleCreateUOM) : handleSubmit(handleUpdateUOM)
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
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={cursorDefault}
          >
            <Typography variant="body1" sx={{ ml: 3, fontWeight: 500 }}>
              Unit of Measurement Details
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
            <RHFTextField name="uomId" label="Code*" />
            <RHFTextField name="shortName" label="Name*" />
            <RHFTextField name="description" label="Description" />
            <Box>
              <RHFCheckbox name="isNotBaseUnit" label="Not a base unit" />
            </Box>
          </Box>
        </Accordion>

        {isNotBaseUnitGetValue ? (
          <Accordion
            expanded={true}
            sx={{
              mb: 2,
              border: "1px solid #BDC1E4",
              borderRadius: "9px",
            }}
          >
            <AccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={cursorDefault}
            >
              <Typography variant="body1" sx={{ ml: 3, fontWeight: 500 }}>
                Details
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
                name="baseUnitUId"
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
              <RHFTextField
                name="count"
                label="Ratio*"
                inputProps={{
                  onInput: handleInput,
                  maxLength: 10,
                }}
                defaultValue={1}
              />
            </Box>
          </Accordion>
        ) : null}

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
