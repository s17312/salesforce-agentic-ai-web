import FormProvider, {
  RHFAutocompleteField,
  RHFTextField,
} from "@/components/hook-form";
import RHFDatePicker from "@/components/hook-form/RHFDatePicker";
import { SaveIcon } from "@/components/icons/saveIcon";
import {
  setVehicleError,
  setVehicleMessage,
} from "@/redux/slices/vehicle-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  createVehicle,
  getAllActiveDistributorsAssignment,
  getAllRepByDistriIDAssignment,
  updateVehicle,
} from "@/service/vehicle.service";
import { getAllVehicleCategoryDetails } from "@/service/vehicleCategory.service";
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { FormValuesPropsVehicle, Vehicle } from "@/types/vehicle-types";
import { vehicleValidationSchema } from "@/utils/schemas/vehicleSchema";
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
import { mapListToOptions } from "@/utils/sortUtils";

type Props = {
  currentVehicle?: Vehicle | undefined;
  isEdit?: boolean;
};

export default function VehicleForm({ currentVehicle, isEdit = false }: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedDistributorUId, setSelectedDistributorUId] = useState<
    number | null
  >(null);
  const [isDistributorDisabled, setIsDistributorDisabled] = useState(true);
  const { vehicleCategoryDetails: vehicleCategories } = useSelector(
    (state) => state.vehicleCategorySlice
  );
  const distributors = useSelector(
    (state) => state.vehicleSlice.distributorDetails
  );
  const representatives = useSelector(
    (state) => state.vehicleSlice.representativeDetails
  );

  const responseMessage = useSelector((state) => state.vehicleSlice.message);
  const responseError = useSelector((state) => state.vehicleSlice.error);

  const defaultValues = useMemo(
    () => ({
      vehicleID: currentVehicle?.vehicleID || "",
      plateNumber: currentVehicle?.plateNumber || "",
      yearOfManufacture: currentVehicle?.yearOfManufacture || "",
      insuranceDetails: currentVehicle?.insuranceDetails || "",
      insuranceRegisterDate: currentVehicle?.insuranceRegisterDate || null,
      insuranceExpiryDate: currentVehicle?.insuranceExpiryDate || null,
      vehicleCategoryUID: currentVehicle?.vehicleCategoryUID || null,
      distributorUId: currentVehicle?.distributorId || null,
      representativeUId: currentVehicle?.representativeId || null,
    }),
    [currentVehicle]
  );

  const methods = useForm<FormValuesPropsVehicle>({
    //@ts-ignore
    resolver: yupResolver(vehicleValidationSchema),
    defaultValues,
    mode: "all",
  });

  const {
    handleSubmit,
    reset,
    formState,
    setValue,
    getValues,
    control,
    watch,
  } = methods;

  const distributorName = watch("distributorUId");

  useEffect(() => {
    if (distributorName) {
      setIsDistributorDisabled(false);
    } else {
      setIsDistributorDisabled(true);
    }
  }, [distributorName, setValue]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getAllVehicleCategoryDetails(
            undefined,
            undefined,
            undefined,
            "category",
            "asc",
            true
          ),
          getAllActiveDistributorsAssignment(),
        ]);
      } catch (error) {
        enqueueSnackbar(`Error in getting data`, { variant: "error" });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isEdit && currentVehicle) {
      reset(defaultValues);
      setValue("representativeUId", defaultValues.representativeUId);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentVehicle, defaultValues]);

  let distributorUIdForRep = getValues("distributorUId");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        await getAllRepByDistriIDAssignment(distributorUIdForRep ?? 0);
      } catch (error) {
        enqueueSnackbar("Error in fetching assignments", {
          variant: "error",
        });
      }
    };
    fetchAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVehicle]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setValue("representativeUId", null);
        await getAllRepByDistriIDAssignment(distributorUIdForRep ?? 0);
      } catch (error) {
        enqueueSnackbar("Error in fetching assignments", {
          variant: "error",
        });
      }
    };
    fetchAssignments();
  }, [distributorUIdForRep]);

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setVehicleMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setVehicleError(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseMessage, responseError]);

  const handleCreateVehicle = async (data: FormValuesPropsVehicle) => {
    const formattedData = {
      ...data,
      insuranceRegisterDate: data.insuranceRegisterDate
        ? format(new Date(data.insuranceRegisterDate), "yyyy-MM-dd")
        : null,
      insuranceExpiryDate: data.insuranceExpiryDate
        ? format(new Date(data.insuranceExpiryDate), "yyyy-MM-dd")
        : null,
    };
    try {
      await createVehicle(formattedData);
      reset(defaultValues);
      router.push(PATH_DASHBOARD.vehicle.list);
    } catch (error: any) {}
  };

  const vehicleCategoriesMap = mapListToOptions(
    vehicleCategories,
    "category",
    "uId"
  );

  const distributorMap = distributors
    ? mapListToOptions(distributors, "distributorName", "uId")
    : [];

  const representativeByDistributorMap = representatives
    ? mapListToOptions(representatives, "name", "uId")
    : [];

  const handleUpdateVehicle = async (data: FormValuesPropsVehicle) => {
    const formattedData = {
      ...data,
      insuranceRegisterDate: data.insuranceRegisterDate
        ? format(new Date(data.insuranceRegisterDate), "yyyy-MM-dd")
        : null,
      insuranceExpiryDate: data.insuranceExpiryDate
        ? format(new Date(data.insuranceExpiryDate), "yyyy-MM-dd")
        : null,
    };
    try {
      await updateVehicle(currentVehicle?.uId, formattedData);
      router.push(PATH_DASHBOARD.vehicle.list);
    } catch (error: any) {}
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.vehicle.list);
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={
        !isEdit
          ? handleSubmit(handleCreateVehicle)
          : handleSubmit(handleUpdateVehicle)
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
            aria-controls="Vehicle Creation"
            id="panel1a-header"
            sx={cursorDefault}
          >
            <Typography variant="body1" sx={{ ml: 5, fontWeight: 500 }}>
              Vehicle Details
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
            <RHFTextField name="vehicleID" label="Code*" />
            <RHFTextField name="plateNumber" label="Plate Number*" />
            <RHFAutocompleteField
              name="vehicleCategoryUID"
              placeholder="Vehicle Category*"
              options={vehicleCategoriesMap}
              control={control}
              inputProps={{
                form: {
                  autocomplete: "off",
                },
              }}
            />
            <RHFTextField
              name="yearOfManufacture"
              label="Year of Manufacture*"
              type="number"
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
            <RHFDatePicker
              name="insuranceRegisterDate"
              label="Insurance Register Date*"
              disableFuture={true}
              onChange={(date: any) => {
                setValue("insuranceRegisterDate", date);
              }}
              format={process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"}
              value={
                defaultValues.insuranceRegisterDate
                  ? new Date(defaultValues.insuranceRegisterDate)
                  : null
              }
              renderInput={(params) => <TextField {...params} />}
            />
            <RHFDatePicker
              name="insuranceExpiryDate"
              label="Insurance Expiry Date*"
              minDate={new Date()}
              onChange={(date: any) => {
                setValue("insuranceExpiryDate", date);
              }}
              format={process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"}
              value={
                defaultValues.insuranceExpiryDate
                  ? new Date(defaultValues.insuranceExpiryDate)
                  : null
              }
              renderInput={(params) => <TextField {...params} />}
            />
            <RHFTextField name="insuranceDetails" label="Insurance Details" />
          </Box>
        </Accordion>
        <Accordion
          expanded={true}
          sx={{
            mb: 2,
            border: "1px solid #BDC1E4",
            borderRadius: "9px",
          }}
        >
          <AccordionSummary
            aria-controls="Vehicle Creation"
            id="panel1a-header"
            sx={cursorDefault}
          >
            <Typography variant="body1" sx={{ ml: 5, fontWeight: 500 }}>
              Vehicle Assigned to
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
              name="distributorUId"
              placeholder="Distributor*"
              options={distributorMap}
              control={control}
              inputProps={{
                form: {
                  autocomplete: "off",
                },
              }}
              onChange={(newValue) => {
                if (typeof newValue === "number" || newValue === null) {
                  setSelectedDistributorUId(newValue);
                }
              }}
            />
            <RHFAutocompleteField
              name="representativeUId"
              placeholder="Sales Rep"
              options={representativeByDistributorMap}
              disabled={isDistributorDisabled}
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
