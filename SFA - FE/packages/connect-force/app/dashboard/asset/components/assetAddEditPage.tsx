import FormProvider, {
  RHFAutocompleteField,
  RHFTextField,
} from "@/components/hook-form";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { createAsset, updateAsset } from "@/service/asset.service";
import { FormValuesPropsAsset, Asset } from "@/types/asset-types";
import { assetValidationSchema } from "@/utils/schemas/assetSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  Accordion,
  AccordionSummary,
  Button,
  Grid,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import RHFDatePicker from "@/components/hook-form/RHFDatePicker";
import { useSnackbar } from "notistack";
import { getAllAssetTypeDetails } from "@/service/assetType.service";
import { getAllAssetBrandDetails } from "@/service/assetBrand.service";
import { getAllAssetModelDetails } from "@/service/assetModel.service";
import { LoadingButton } from "@mui/lab";
import { SaveIcon } from "@/components/icons/saveIcon";
import { setAssetError, setAssetMessage } from "@/redux/slices/asset-slice";

type Props = {
  currentAsset?: Asset | undefined;
  isEdit?: boolean;
};

export default function AssetForm({ currentAsset, isEdit = false }: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { assetTypeDetails: assetTypes } = useSelector(
    (state) => state.assetTypeSlice
  );

  const { assetBrandDetails: assetBrands } = useSelector(
    (state) => state.assetBrandSlice
  );

  const { assetModelDetails: assetModels } = useSelector(
    (state) => state.assetModelSlice
  );

  const responseMessage = useSelector((state) => state.assetSlice.message);

  const responseError = useSelector((state) => state.assetSlice.error);

  const defaultValues = useMemo(
    () => ({
      assetId: currentAsset?.assetId || "",
      assetName: currentAsset?.assetName || "",
      serialNumber: currentAsset?.serialNumber || null,
      manufacturer: currentAsset?.manufacturer || "",
      purchaseDate: currentAsset?.purchaseDate || null,
      cost: currentAsset?.cost || null,
      guaranteeInformation: currentAsset?.guaranteeInformation || "",
      maintenanceSchedule: currentAsset?.maintenanceSchedule || null,
      additionalNotes: currentAsset?.additionalNotes || "",
      // assetTypeName: currentAsset?.assetType?.assetTypeName || null,
      // assetBrandName: currentAsset?.assetBrand?.assetBrandName || null,
      // assetModelName: currentAsset?.assetModel?.assetModelName || null,
      assetTypeUID: currentAsset?.assetTypeUID || null,
      assetBrandUId: currentAsset?.assetBrandUId || null,
      assetModelUId: currentAsset?.assetModelUId || null,
      companyUId: currentAsset?.companyUId || null,
    }),
    [currentAsset]
  );

  const methods = useForm<FormValuesPropsAsset>({
    //@ts-ignore
    resolver: yupResolver(assetValidationSchema),
    defaultValues,
    mode: "all",
  });

  const { handleSubmit, reset, formState, setValue, control, watch } = methods;

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getAllAssetTypeDetails(
            undefined,
            undefined,
            undefined,
            "AssetTypeName",
            "asc",
            true
          ),
        ]);
      } catch (error) {
        enqueueSnackbar(`Error in getting data`, { variant: "error" });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getAllAssetBrandDetails(
            undefined,
            undefined,
            undefined,
            "AssetBrandName",
            "asc",
            true
          ),
        ]);
      } catch (error) {
        enqueueSnackbar(`Error in getting data`, { variant: "error" });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getAllAssetModelDetails(
            undefined,
            undefined,
            undefined,
            "AssetModelName",
            "asc",
            true
          ),
        ]);
      } catch (error) {
        enqueueSnackbar(`Error in getting data`, { variant: "error" });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isEdit && currentAsset) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentAsset]);

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setAssetMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setAssetError(null));
    }
  }, [responseMessage, responseError]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/[^0-9.,]/g, "");
  };

  const handleCreateAsset = async (data: FormValuesPropsAsset) => {
    const formattedData = {
      ...data,
      purchaseDate: data.purchaseDate
        ? format(new Date(data.purchaseDate), "yyyy-MM-dd")
        : null,
      maintenanceSchedule: data.maintenanceSchedule
        ? format(new Date(data.maintenanceSchedule), "yyyy-MM-dd")
        : null,
    };

    try {
      await createAsset(formattedData);
      reset(defaultValues);
      router.push(PATH_DASHBOARD.asset.list);
    } catch (error: any) {}
  };

  const mapListToOptions = (list: any[], labelKey: string, valueKey: string) =>
    list.map((item) => ({
      label: item[labelKey],
      value: item[valueKey],
    }));

  const assetTypesMap = mapListToOptions(assetTypes, "assetTypeName", "uId");

  const assetBrandsMap = mapListToOptions(assetBrands, "assetBrandName", "uId");

  const assetModelsMap = mapListToOptions(assetModels, "assetModelName", "uId");

  const handleUpdateAsset = async (data: FormValuesPropsAsset) => {
    const formattedData = {
      ...data,
      purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
      maintenanceSchedule: data.maintenanceSchedule
        ? new Date(data.maintenanceSchedule)
        : null,
    };

    try {
      await updateAsset(currentAsset?.uId, formattedData);
      router.push(PATH_DASHBOARD?.asset.list);
    } catch (error: any) {}
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.asset.list);
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={
        !isEdit
          ? handleSubmit(handleCreateAsset)
          : handleSubmit(handleUpdateAsset)
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
            aria-controls="Asset Creation"
            id="panel1a-header"
            sx={cursorDefault}
          >
            <Typography variant="body1" sx={{ ml: 5, fontWeight: 500 }}>
              Asset Details
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
            <RHFTextField name="assetId" label="Code*" />
            <RHFTextField name="assetName" label="Name*" />
            <RHFAutocompleteField
              name="assetTypeUID"
              placeholder="Asset Type*"
              options={assetTypesMap}
              control={control}
              inputProps={{
                form: {
                  autocomplete: "off",
                },
              }}
            />
            <RHFAutocompleteField
              name="assetBrandUId"
              placeholder="Asset Brand*"
              options={assetBrandsMap}
              control={control}
              inputProps={{
                form: {
                  autocomplete: "off",
                },
              }}
            />
            <RHFAutocompleteField
              name="assetModelUId"
              placeholder="Asset Model*"
              options={assetModelsMap}
              control={control}
              inputProps={{
                form: {
                  autocomplete: "off",
                },
              }}
            />
            <RHFTextField name="serialNumber" label="Serial Number*" inputProps={{
                onInput: handleInput,
                maxLength: 9,
              }}/>
            <RHFTextField name="manufacturer" label="Manufacturer" />
            <RHFDatePicker
              name="purchaseDate"
              label="Purchase Date*"
              disableFuture={true}
              onChange={(date: any) => {
                setValue("purchaseDate", date);
              }}
              format={process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"}
              value={
                defaultValues.purchaseDate
                  ? new Date(defaultValues.purchaseDate)
                  : null
              }
              renderInput={(params) => <TextField {...params} />}
            />
            <RHFTextField name="cost" label="Cost" />
            <RHFTextField
              name="guaranteeInformation"
              label="Guarantee Information"
            />
            <RHFDatePicker
              name="maintenanceSchedule"
              label="Maintenance Schedule"
              disablePast={true}
              //   disableFuture={false}
              onChange={(date: any) => {
                setValue("maintenanceSchedule", date);
              }}
              format={process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"}
              value={
                defaultValues.maintenanceSchedule
                  ? new Date(defaultValues.maintenanceSchedule)
                  : null
              }
              renderInput={(params) => <TextField {...params} />}
            />
            <RHFTextField name="additionalNotes" label="Additional Notes" />
            {/* <RHFTextField name="companyUId" label="Company*" /> */}
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
