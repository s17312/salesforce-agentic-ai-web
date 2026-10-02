"use client";

import { useSnackbar } from "notistack";
import { yupResolver } from "@hookform/resolvers/yup";
import { SetStateAction, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { warehouseValidationSchema } from "@/utils/schemas/warehouseSchema";
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
import { RHFAutocompleteField, RHFTextField } from "@/components/hook-form";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@mui/lab";
import { SaveIcon } from "@/components/icons/saveIcon";
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { getAllWarehouseTypes } from "@/service/warehouseType.service";
import { RegisterWarehouse, WarehouseProps } from "@/types/warehouse";
import { useSelector } from "@/redux/store";
import { getAllWarehouseCategoryDetails } from "@/service/warehouse-category.service";
import {
  createWarehouse,
  getAllAssignmentsByWarehouseCategory,
  updateWarehouse,
} from "@/service/warehouse";

export default function WarehouseAddEditForm({
  currentWarehouse,
  isEdit = false,
}: WarehouseProps) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedWarehouseCategoryUId, setSelectedWarehouseCategoryUId] =
    useState<number | null>(null);
  const [isAssignmentDisabled, setIsAssignmentDisabled] = useState(true);
  const { warehouseTypes: warehouseTypes } = useSelector(
    (state) => state.warehouseTypeSlice
  );
  const { warehouseAssignments: warehouseAssignments } = useSelector(
    (state) => state.warehouseSlice
  );
  const { warehouseCategoryDetails: warehouseCategoryList } = useSelector(
    (state) => state.warehouseCategorySlice
  );

  const defaultValues = useMemo(
    () => ({
      warehouseID: currentWarehouse?.warehouseID || "",
      name: currentWarehouse?.name || "",
      description: currentWarehouse?.description || "",
      warehouseTypeUId: currentWarehouse?.warehouseTypeUId || null,
      warehouseCategoryUId: currentWarehouse?.warehouseCategoryUId || null,
      warehouseAssinmentUId: currentWarehouse?.warehouseAssinmentUId || null,
    }),
    [currentWarehouse]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getAllWarehouseTypes(
            undefined,
            undefined,
            undefined,
            "warehouseTypeName",
            "asc",
            true
          ),
          getAllWarehouseCategoryDetails(
            undefined,
            undefined,
            undefined,
            "category",
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
    if (isEdit && currentWarehouse) {
      reset(defaultValues);
      setValue("warehouseAssinmentUId", defaultValues.warehouseAssinmentUId);
    }
    if (!isEdit) {
      reset(defaultValues);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentWarehouse, defaultValues]);

  useEffect(() => {
    // Determine which category ID to send: prioritize selectedWarehouseCategoryUId if available
    const warehouseCategoryUIdToSend =
      selectedWarehouseCategoryUId || currentWarehouse?.warehouseCategoryUId;

    if (warehouseCategoryUIdToSend) {
      const fetchAssignments = async () => {
        try {
          await getAllAssignmentsByWarehouseCategory(
            warehouseCategoryUIdToSend
          );
        } catch (error) {
          enqueueSnackbar("Error in fetching assignments", {
            variant: "error",
          });
        }
      };
      fetchAssignments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWarehouseCategoryUId, currentWarehouse?.warehouseCategoryUId]);

  const methods = useForm<RegisterWarehouse>({
    //@ts-ignore
    resolver: yupResolver(warehouseValidationSchema),
    defaultValues,
    mode: "all",
  });

  const mapListToOptions = (list: any[], labelKey: string, valueKey: string) =>
    list.map((item) => ({
      label: item[labelKey],
      value: item[valueKey],
    }));

  const warehouseTypesMap = mapListToOptions(
    warehouseTypes,
    "warehouseTypeName",
    "uId"
  );

  const warehouseCategoryMap = mapListToOptions(
    warehouseCategoryList,
    "category",
    "uId"
  );

  const warehouseAssignmentMap = mapListToOptions(
    warehouseAssignments,
    "assingmentName",
    "uId"
  );

  const {
    handleSubmit,
    reset,
    formState,
    control,
    setFocus,
    watch,
    setValue,
    getValues,
  } = methods;

  const warehouseCategoryName = watch("warehouseCategoryUId");

  const handleWareHouseCategoryChange = (newValue: any) => {
    if (typeof newValue === "number" || newValue === null) {
      setSelectedWarehouseCategoryUId(newValue);
    }
    const currentValues = getValues();
    reset({
      ...currentValues,
      warehouseAssinmentUId: null,
    });
  };

  useEffect(() => {
    if (warehouseCategoryName) {
      setIsAssignmentDisabled(false);
    } else {
      setIsAssignmentDisabled(true);
    }
  }, [warehouseCategoryName, setValue]);

  const onError = (errors: any) => {
    const firstErrorField: any = Object.keys(errors)[0];
    setFocus(firstErrorField);
  };

  const handleCreateWarehouse = async (data: RegisterWarehouse) => {
    await createWarehouse(data);
    enqueueSnackbar("Warehouse successfully registered", {
      variant: "success",
    });
    reset(defaultValues);
    router.push(PATH_DASHBOARD.warehouse.list);
  };

  const handleUpdateWarehouse = async (data: RegisterWarehouse) => {
    await updateWarehouse(currentWarehouse?.uId, data);
    enqueueSnackbar("Warehouse successfully updated", {
      variant: "success",
    });
    router.push(PATH_DASHBOARD.warehouse.list);
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.warehouse.list);
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={
        !isEdit
          ? handleSubmit(handleCreateWarehouse, onError)
          : handleSubmit(handleUpdateWarehouse, onError)
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
              Warehouse Details
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
            <RHFTextField name="warehouseID" label="Code*" />
            <RHFTextField name="name" label="Name*" />
            <RHFTextField name="description" label="Description" />
            <RHFAutocompleteField
              name="warehouseTypeUId"
              placeholder="Warehouse Type*"
              options={warehouseTypesMap}
              control={control}
              disabled={isEdit}
              inputProps={{
                form: {
                  autocomplete: "off",
                },
              }}
            />
            <RHFAutocompleteField
              name="warehouseCategoryUId"
              placeholder="Warehouse Category*"
              options={warehouseCategoryMap}
              control={control}
              disabled={isEdit}
              inputProps={{
                form: {
                  autocomplete: "off",
                },
              }}
              // onChange={(newValue) => {
              //   if (typeof newValue === "number" || newValue === null) {
              //     setSelectedWarehouseCategoryUId(newValue);
              //   }
              // }}
              onChange={handleWareHouseCategoryChange}
            />

            <RHFAutocompleteField
              name="warehouseAssinmentUId"
              placeholder="Warehouse Assignment*"
              options={warehouseAssignmentMap}
              control={control}
              disabled={isAssignmentDisabled || isEdit}
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
