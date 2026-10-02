import FormProvider, {
  RHFAutocompleteField,
  RHFTextField,
} from "@/components/hook-form";
import {
  cursorDefault,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dispatch, useSelector } from "@/redux/store";
import {
  AssetAllocation,
  FormValuesPropsAssetAllocation,
} from "@/types/asset-allocation-types";
import {
  Accordion,
  Grid,
  AccordionSummary,
  Typography,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { format } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import { getAllCompany } from "@/service/company.service";
import { createAssetAllocation } from "@/service/assetAllocation.service";
import { getAllAssetAllocationTypeDetails } from "@/service/assetAllocationType.service";
import { getAllDistributorsByCompanyIdIsChecked } from "@/service/mapping-service/distributorCompany.service";
import { getAllAllocationAssetDetails } from "@/service/asset.service";
import RHFDatePicker from "@/components/hook-form/RHFDatePicker";
import { getAllOutletByDistributorIdIsChecked } from "@/service/mapping-service/distributorOutlet.service";
import { LoadingButton } from "@mui/lab";
import { SaveIcon } from "@/components/icons/saveIcon";
import { yupResolver } from "@hookform/resolvers/yup";
import { assetAllocationValidationSchema } from "@/utils/schemas/assetAllocationScema";
import { DataGrid, GridRowId } from "@mui/x-data-grid";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import {
  AssetMapperTableHeadings,
  tableOptions,
} from "./table-component-assetMapper";
import { removeAllocatedAssets } from "@/redux/slices/asset-slice";
import { setAssetAllocationError, setAssetAllocationMessage } from "@/redux/slices/asset-allocation-slice";

type Props = {
  currentAssetAllocation?: AssetAllocation | undefined;
};

export default function AssetallocationForm({ currentAssetAllocation }: Props) {
  const [loading, setLoading] = useState(false);
  const { companies: companies } = useSelector((state) => state.companySlice);
  const { assetAllocationTypeDetails: assetAllocationTypeDetails } =
    useSelector((state) => state.assetAllocatioTypeSlice);
  const { distributorCompaniesIsTrue: distributorCompaniesIsTrue } =
    useSelector((state) => state.distributorCompanySlice);
  const { allocationAssetDetails: allocationAssetDetails } = useSelector(
    (state) => state.assetSlice
  );
  const { distributorOutletsIsTrue: distributorOutletsIsTrue } = useSelector(
    (state) => state.distributorOutletSlice
  );
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const responseMessage = useSelector((state) => state.assetAllocationSlice.message);
  const responseError = useSelector((state) => state.assetAllocationSlice.error);

  const defaultValues = useMemo(
    () => ({
      assetUIds: currentAssetAllocation?.assetUIds || [],
      allocationType: currentAssetAllocation?.allocationType || null,
      companyUId: currentAssetAllocation?.companyUId || null,
      comment: currentAssetAllocation?.comment || "",
      distributorUId: currentAssetAllocation?.distributorUId || null,
      outletUId: currentAssetAllocation?.outletUId || null,
      repairUId: currentAssetAllocation?.repairUId || null,
      disposalUId: currentAssetAllocation?.disposalUId || null,
      allocationDate: currentAssetAllocation?.allocationDate || null,
    }),
    [currentAssetAllocation]
  );

  const methods = useForm<FormValuesPropsAssetAllocation>({
    //@ts-ignore
    resolver: yupResolver(assetAllocationValidationSchema),
    defaultValues,
    mode: "all"
  });

  const {
    handleSubmit,
    reset,
    formState,
    setValue,
    control,
    watch,
    getValues,
  } = methods;

  const watchedAllocationType = watch("allocationType");
  const companyUId = watch("companyUId");
  const distributorUId = watch("distributorUId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getAllCompany(
            undefined,
            undefined,
            undefined,
            "companyName",
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
          getAllAssetAllocationTypeDetails(
            undefined,
            undefined,
            undefined,
            "allocationType",
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

  const fetchAssetDetails = async () => {
    setLoading(true);
    try {
      await Promise.all([
        getAllAllocationAssetDetails(
          undefined,
          undefined,
          undefined,
          "assetName",
          "asc",
          true,
          false,
          undefined,
          0
        ),
      ]);
    } catch (error) {
      enqueueSnackbar(`Error in getting data`, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssetDetails();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getAllDistributorsByCompanyIdIsChecked(companyUId ?? 0),
        ]);
      } catch (error) {
        enqueueSnackbar(`Error in getting data`, { variant: "error" });
      }
    };
    fetchData();
  }, [companyUId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getAllOutletByDistributorIdIsChecked(distributorUId ?? 0),
        ]);
      } catch (error) {
        enqueueSnackbar(`Error in getting data`, { variant: "error" });
      }
    };
    fetchData();
  }, [distributorUId]);

  useEffect(() => {
      if (responseMessage) {
        enqueueSnackbar(responseMessage, { variant: "success" });
        dispatch(setAssetAllocationMessage(null));
      }
      if (responseError) {
        enqueueSnackbar(responseError, { variant: "error" });
        dispatch(setAssetAllocationError(null));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [responseMessage, responseError]);

  const createPayload = (isCopy: boolean) => {
    const allocationDate = getValues("allocationDate");

    return {
      allocationType: getValues("allocationType"),
      assetUIds: getValues("assetUIds"),
      // assetUIds: selectedAssets.map((uId) => Number(uId)),
      companyUId: getValues("companyUId"),
      comment: getValues("comment"),
      distributorUId: getValues("distributorUId"),
      outletUId: getValues("outletUId"),
      repairUId: getValues("repairUId"),
      disposalUId: getValues("disposalUId"),
      allocationDate: allocationDate
        ? format(new Date(allocationDate), "yyyy-MM-dd")
        : null,
    };
  };

  const handleCreateAssetAllocation = async () => {
    if (!selectedAssets || selectedAssets.length === 0) {
      enqueueSnackbar("Please select at least one asset.", { variant: "error" });
      return;
    }

    const isValid = await methods.trigger();
    if (!isValid) {
      enqueueSnackbar("Please fill all required fields", { variant: "error" });
      return;
    }
    const formattedData = createPayload(false);

    try {
      const res = await createAssetAllocation(formattedData);
      dispatch(removeAllocatedAssets(selectedAssets));
      reset();
      setSelectedAssets([]);
      defaultValues.comment = "";

      await fetchAssetDetails();
    } catch (error: any) {
      console.error("Error transferring outlets:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "An unknown error occurred.";
      enqueueSnackbar(`Failed to create asset allocation: ${errorMessage}`, {
        variant: "error",
      });
    }
  };

  const mapListToOptions = (
    list: any[] = [],
    labelKey: string,
    valueKey: string
  ) =>
    list.map((item) => ({
      label: item[labelKey],
      value: item[valueKey],
    }));

  const companyMap = mapListToOptions(companies, "companyName", "uId");
  const allocationTypeMap = mapListToOptions(
    assetAllocationTypeDetails,
    "allocationType",
    "uId"
  );
  const distributorMap = mapListToOptions(
    distributorCompaniesIsTrue,
    "distributorName",
    "distributorUId"
  );
  const outletMap = mapListToOptions(
    distributorOutletsIsTrue,
    "name",
    "outletUId"
  );
  const filteredAllocationTypeMap = allocationTypeMap.filter(
    (item) => item.value === 2 || item.value === 3
  );

  return (
    <FormProvider
      methods={methods}
      onSubmit={handleSubmit(handleCreateAssetAllocation)}
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
            aria-controls="Asset Allocation"
            id="panel1a-header"
            sx={cursorDefault}
          >
            <Typography variant="body1" sx={{ ml: 5, fontWeight: 500 }}>
              Asset Allocation
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
            {/* <AssetAllocationFormFields /> */}
            <RHFAutocompleteField
              name="companyUId"
              placeholder="Company*"
              options={companyMap}
              control={control}
              inputProps={{
                form: {
                  autocomplete: "off",
                },
              }}
            />
            <RHFAutocompleteField
              name="allocationType"
              placeholder="Allocation Type*"
              options={filteredAllocationTypeMap}
              control={control}
              inputProps={{
                form: {
                  autocomplete: "off",
                },
              }}
            />
            <RHFDatePicker
              name="allocationDate"
              label="Allocation Date*"
              minDate={new Date()}
              onChange={(date: any) => {
                setValue("allocationDate", date);
              }}
              format={process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy"}
              value={
                defaultValues.allocationDate
                  ? new Date(defaultValues.allocationDate)
                  : null
              }
              renderInput={(params) => <TextField {...params} />}
            />
            <RHFTextField name="comment" label="Comment" />
          </Box>
          {watchedAllocationType &&
            (Number(watchedAllocationType) === 2 ||
              Number(watchedAllocationType) === 3) && (
              <hr
                style={{
                  margin: "16px 0",
                  border: "0",
                  borderTop: "1px solid #BDC1E4",
                }}
              />
            )}
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
            {/* Section 2: Conditional Fields based on Allocation Type */}
            {watchedAllocationType &&
              (Number(watchedAllocationType) === 2 ||
                Number(watchedAllocationType) === 3) && (
                <Grid item xs={24}>
                  <RHFAutocompleteField
                    name="distributorUId"
                    placeholder="Select Distributor*"
                    options={distributorMap}
                    control={control}
                    inputProps={{
                      form: {
                        autocomplete: "off",
                      },
                    }}
                  />
                </Grid>
              )}
            {watchedAllocationType && Number(watchedAllocationType) === 3 && (
              <Grid item xs={12}>
                <RHFAutocompleteField
                  name="outletUId"
                  placeholder="Select Outlet*"
                  options={outletMap}
                  control={control}
                  disabled={!watch("distributorUId")}
                  inputProps={{
                    form: {
                      autocomplete: "off",
                    },
                  }}
                />
              </Grid>
            )}
          </Box>
          {/* Section 3: Asset and Allocation Date */}
          <hr
            style={{
              margin: "16px 0",
              border: "0",
              borderTop: "1px solid #BDC1E4",
            }}
          />
          <TableContainer
            style={{
              marginBottom: "20px",
              overflow: "auto",
            }}
          >
            <DataGrid
              sx={{ ...dataGridStyle }}
              columns={getColumnsWithTooltip(AssetMapperTableHeadings)}
              rows={allocationAssetDetails}
              getRowId={(row) => row.uId}
              loading={loading}
              rowCount={allocationAssetDetails.length}
              pageSizeOptions={tableOptions.rowsPerPageOptions}
              checkboxSelection
              density="compact"
              onRowSelectionModelChange={(newSelection) => {
                const numericSelection = (newSelection as GridRowId[])
                  .map((id) => {
                    const numId = Number(id);
                    return !isNaN(numId) ? numId : null;
                  })
                  .filter((id): id is number => id !== null);

                setSelectedAssets(numericSelection.map((id) => id.toString()));
                setValue("assetUIds", numericSelection.map((id) => id.toString())); 
              }}
              rowSelectionModel={selectedAssets.map(Number)}
            />
          </TableContainer>
        </Accordion>
      </Grid>
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
            gap: 2,
            flexWrap: "wrap",
            width: "100%",
            maxWidth: "600px",
            justifyContent: "center",
          }}
        >
          <LoadingButton
            type="submit"
            variant="contained"
            loading={formState.isSubmitting}
            // onClick={handleCreateAssetAllocation}
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
            Save
          </LoadingButton>
          <Button
            type="reset"
            variant="outlined"
            onClick={() => {
              reset(defaultValues);
              setSelectedAssets([]);
            }}
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
        </Box>
      </Box>
    </FormProvider>
  );
}
