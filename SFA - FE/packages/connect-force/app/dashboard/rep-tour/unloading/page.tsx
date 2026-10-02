"use client";

import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import FormProvider, { RHFAutocompleteField } from "@/components/hook-form";
import { setTourUnloadingDetails } from "@/redux/slices/tour/tour-sales-unloading";
import { dispatch, useSelector } from "@/redux/store";
import {
  createUnloading,
  getDamageWarehouseByDistributor,
  getPrimaryWarehouseByDistributor,
  getTourUnloadingByScheduleId,
  getUnloadingReasons,
  submitUnloading,
} from "@/service/tour-service/tourUnloading.service";
import {
  dataGridStyle,
  focusDataGridStyle,
} from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { mapListToOptions } from "@/utils/sortUtils";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LoadingButton } from "@mui/lab";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridColumnGroupingModel,
  GridRowModel,
} from "@mui/x-data-grid";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import "../../../../styles/tableStyles/editableTableStyles.css";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";
import { updateTourjourneyStatus } from "@/service/tour-service/tourSchedule.service";

interface UnloadingRepTourProps {
  schedule: any;
  setTabValue: (value: string) => void;
  fetchTourScheduleID: () => void;
}

const UnloadingRepTour: React.FC<UnloadingRepTourProps> = ({
  schedule,
  setTabValue,
  fetchTourScheduleID,
}) => {
  const theme = useTheme();
  const [rows, setRows] = React.useState([] as any[]);
  const [expand1, setExpand1] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const unloading = useSelector(
    (state) => state.tourUnloadingSlice.TourUnloadingDetails
  );

  const primaryWarehouseOptionsList = useSelector(
    (state) => state.tourUnloadingSlice.PrimaryWarehousesList
  );

  const DamageWarehouseOptionsList = useSelector(
    (state) => state.tourUnloadingSlice.DamageWarehousesList
  );

  const unloadingReasons = useSelector(
    (state) => state.tourUnloadingSlice.UnloadUnloadingReason
  );

  const unloadingHeader = unloading.unloadingHeader;
  const unloadingDetails = unloading.unloadingDetail;

  const columnNames = [
    { field: "productId", headerName: "PID" },
    { field: "productName", headerName: "Product Name" },
    { field: "mrp", headerName: "MRP" },
    { field: "loadingQuantity", headerName: "Loading" },
    { field: "saleQuantity", headerName: "Sale" },
    { field: "discountQuantity", headerName: "Discount" },
    { field: "sellableQuantity", headerName: "Salable Return" },
    { field: "nonSellableQuantity", headerName: "Non Salable Return" },
    { field: "goodsQuantity", headerName: "System Unloading Goods" },
    { field: "damagedQuantity", headerName: "System Unloading Returns" },
    { field: "repGoodsQuantity", headerName: "Rep Unloading Goods" },
    { field: "repDamagedQuantity", headerName: "Rep Unloading Returns" },
    { field: "actualGoodsQuantity", headerName: "Actual Unloading Goods" },
    { field: "actualDamagedQuantity", headerName: "Actual Unloading Returns" },
  ];

  const {
    searchedRows,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
  } = useColumnFilter(rows, columnNames);

  const defaultValues = useMemo(
    () => ({
      distributorPrimaryWarehouseUId:
        unloadingHeader?.distributorWarehouseUId || null,
      distributorDamageWarehouseUId:
        unloadingHeader?.damagedWarehouseUId || null,
    }),
    [unloading]
  );

  const methods = useForm<any>({
    mode: "all",
    defaultValues,
  });

  const { reset, control, getValues } = methods;

  useWatch({
    control,
    name: ["distributorPrimaryWarehouseUId", "distributorDamageWarehouseUId"],
  });

  useEffect(() => {
    fetchGetTourUnloadingByScheduleId();
    fetchTourLoadingWarehouses();
    fetchUnloadingReasons();
  }, []);

  //Set the unloading details when unloading arrives
  useEffect(() => {
    if (unloadingDetails) {
      const mappedRows = unloadingDetails.map((detail: any, index: any) => ({
        ...detail,
        id: index + 1,
        actualGoodsQuantity: detail.repGoodsQuantity,
        actualDamagedQuantity: detail.repDamagedQuantity,
        unloadingReasonUId:
          detail?.unloadingReasonUId || "-- Select a reason --",
      }));
      setRows(mappedRows);
    }
  }, [unloading]);

  useEffect(() => {
    if (
      unloadingHeader?.distributorWarehouseUId !== 0 ||
      unloadingHeader?.damagedWarehouseUId !== 0
    ) {
      reset({
        distributorPrimaryWarehouseUId:
          unloadingHeader?.distributorWarehouseUId,
        distributorDamageWarehouseUId: unloadingHeader?.damagedWarehouseUId,
      });
    }
  }, [unloading]);

  const fetchGetTourUnloadingByScheduleId = async () => {
    setIsLoading(true);
    dispatch(setTourUnloadingDetails([]));
    try {
      await getTourUnloadingByScheduleId(schedule.uId);
    } catch {
      enqueueSnackbar("Error fetching tour unloading", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTourLoadingWarehouses = async () => {
    await getPrimaryWarehouseByDistributor(schedule.distributorUId);
    await getDamageWarehouseByDistributor(schedule.distributorUId);
  };

  const fetchUnloadingReasons = async () => {
    await getUnloadingReasons();
  };

  const primaryWarehousesOptions = useMemo(
    () =>
      mapListToOptions(
        primaryWarehouseOptionsList,
        "warehouseName",
        "warehouseUId"
      ),
    [primaryWarehouseOptionsList, mapListToOptions]
  );

  const damageWarehousesOptions = useMemo(
    () =>
      mapListToOptions(
        DamageWarehouseOptionsList,
        "warehouseName",
        "warehouseUId"
      ),
    [DamageWarehouseOptionsList, mapListToOptions]
  );

  const unloadingReasonsOptions = useMemo(
    () => mapListToOptions(unloadingReasons, "unloadingReasonName", "uId"),
    [unloadingReasons, mapListToOptions]
  );

  const handleRowUpdate = (newRow: GridRowModel) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === newRow.id ? newRow : row))
    );
    return newRow;
  };

  let disPrimaryWarehouseUId = getValues("distributorPrimaryWarehouseUId");
  let disSecondaryWarehouseUId = getValues("distributorDamageWarehouseUId");

  const handleSaveAsDraft = async () => {
    setIsSubmitting(true)
    const invalidRow = rows.find(
      (row) =>
        row.actualGoodsQuantity === "" ||
        row.actualDamagedQuantity === "" ||
        row.unloadingReasonUId === ""
    );

    if (invalidRow) {
      enqueueSnackbar("Please fill all required fields before submitting.", {
        variant: "error",
      });
      return;
    }

    // const missingReasonRow = rows.find(
    //   (row) =>
    //     (row.actualGoodsQuantity > 0 || row.actualDamagedQuantity > 0) &&
    //     (!row.unloadingReasonUId ||
    //       row.unloadingReasonUId === "-- Select a reason --")
    // );

    // if (missingReasonRow) {
    //   enqueueSnackbar("Please select Unloading reason for relevant products", {
    //     variant: "error",
    //   });
    //   return;
    // }

    const unloadingDetail = rows.map((row) => ({
      productUId: row.productUId,
      mrp: row.mrp,
      uom: row.uom,
      unitVolume: row.unitVolume,
      loadingQuantity: row.loadingQuantity,
      saleQuantity: row.saleQuantity,
      discountQuantity: row.discountQuantity,
      sellableQuantity: row.sellableQuantity,
      nonSellableQuantity: row.nonSellableQuantity,
      goodsQuantity: row.goodsQuantity,
      damagedQuantity: row.damagedQuantity,
      repGoodsQuantity: row.repGoodsQuantity,
      repDamagedQuantity: row.repDamagedQuantity,
      actualGoodsQuantity: row.actualGoodsQuantity ?? 0,
      actualDamagedQuantity: row.actualDamagedQuantity ?? 0,
      goodsValue: row.actualGoodsQuantity * row.mrp,
      damagedValue: row.actualDamagedQuantity * row.mrp,
      goodsVolume: row.actualGoodsQuantity * row.unitVolume,
      damagedVolume: row.actualDamagedQuantity * row.unitVolume,
      unloadingReasonUId:
        row.unloadingReasonUId == "-- Select a reason --"
          ? 0
          : row.unloadingReasonUId,
    }));

    const payload = {
      unloadingHeader: {
        unloadingDate: new Date().toISOString().split("T")[0],
        unloadingNo: "",
        tourScheduleUId: schedule.uId,
        vehicleUId: schedule.vehicleUId,
        disPrimaryWarehouseUId: disPrimaryWarehouseUId,
        disSecondaryWarehouseUId: disSecondaryWarehouseUId,
      },
      unloadingDetail: unloadingDetail,
    };

    if (unloadingDetail.length >= 0) {
      const response = await createUnloading(payload);
      enqueueSnackbar(`${response.message} | ${response.number}`, {
        variant: "success",
      });
      fetchGetTourUnloadingByScheduleId();
      setIsSubmitting(false);
    } else {
      enqueueSnackbar("Please add atleast one product.", {
        variant: "error",
      });
      setIsSubmitting(false);
    }
  };

  let submitType = unloadingHeader?.statusId === 1 ? 2 : 1;

  const handleSubmitForm = async () => {
    setIsSubmitting(true);
    const invalidRow = rows.find(
      (row) =>
        row.actualGoodsQuantity === "" ||
        row.actualDamagedQuantity === "" ||
        row.unloadingReasonUId === ""
    );

    if (invalidRow) {
      enqueueSnackbar("Please fill all required fields before submitting.", {
        variant: "error",
      });
      return;
    }

    const unloadingDetail = rows.map((row) => ({
      productUId: row.productUId,
      mrp: row.mrp,
      uom: row.uom,
      unitVolume: row.unitVolume,
      loadingQuantity: row.loadingQuantity,
      saleQuantity: row.saleQuantity,
      discountQuantity: row.discountQuantity,
      sellableQuantity: row.sellableQuantity,
      nonSellableQuantity: row.nonSellableQuantity,
      goodsQuantity: row.goodsQuantity,
      damagedQuantity: row.damagedQuantity,
      repGoodsQuantity: row.repGoodsQuantity,
      repDamagedQuantity: row.repDamagedQuantity,
      actualGoodsQuantity: row.actualGoodsQuantity ?? 0,
      actualDamagedQuantity: row.actualDamagedQuantity ?? 0,
      goodsValue: row.actualGoodsQuantity * row.mrp,
      damagedValue: row.actualDamagedQuantity * row.mrp,
      goodsVolume: row.actualGoodsQuantity * row.unitVolume,
      damagedVolume: row.actualDamagedQuantity * row.unitVolume,
      unloadingReasonUId:
        row.unloadingReasonUId == "-- Select a reason --"
          ? 0
          : row.unloadingReasonUId,
    }));

    const payload = {
      unloadingHeader: {
        unloadingDate: new Date().toISOString().split("T")[0],
        unloadingNo: unloadingHeader?.unloadingNo,
        tourScheduleUId: schedule.uId,
        vehicleUId: schedule.vehicleUId,
        disPrimaryWarehouseUId: disPrimaryWarehouseUId,
        submitType: submitType,
        disSecondaryWarehouseUId: disSecondaryWarehouseUId,
        distributorUId: schedule.distributorUId,
      },
      unloadingDetail: unloadingDetail,
    };

    if (unloadingDetail.length >= 0) {
      const response = await submitUnloading(payload);
      enqueueSnackbar(`${response.message} | ${response.number}`, {
        variant: "success",
      });

      fetchGetTourUnloadingByScheduleId();
      await updateTourjourneyStatus(schedule.uId, 5);
      setIsSubmitting(false);
      fetchTourScheduleID();
      setTabValue("5");
    } else {
      enqueueSnackbar("Please add at least one product.", {
        variant: "error",
      });
      setIsSubmitting(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "productId",
      headerName: "PID",
      minWidth: 73,
      maxWidth: 73,
      sortable: false,
      flex: 1,
    },
    {
      field: "productName",
      headerName: "Product Name",
      minWidth: 200,
      sortable: false,
      flex: 1,
    },
    {
      field: "mrp",
      headerName: "MRP",
      minWidth: 73,
      maxWidth: 73,
      sortable: false,
      flex: 1,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "loadingQuantity",
      headerName: "Loading",
      minWidth: 75,
      maxWidth: 75,
      sortable: false,
      flex: 1,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "saleQuantity",
      headerName: "Sale",
      minWidth: 73,
      maxWidth: 73,
      sortable: false,
      flex: 1,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "discountQuantity",
      headerName: "Discount",
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      flex: 1,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "sellableQuantity",
      headerName: "Salable Return",
      minWidth: 120,
      maxWidth: 120,
      sortable: false,
      flex: 1,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "nonSellableQuantity",
      headerName: "Non Salable Return",
      minWidth: 150,
      maxWidth: 150,
      sortable: false,
      flex: 1,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "goodsQuantity",
      headerName: "Goods",
      minWidth: 73,
      maxWidth: 73,
      sortable: false,
      flex: 1,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "damagedQuantity",
      headerName: "Returns",
      minWidth: 73,
      maxWidth: 73,
      sortable: false,
      flex: 1,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "repGoodsQuantity",
      headerName: "Goods",
      minWidth: 73,
      maxWidth: 73,
      sortable: false,
      flex: 1,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "repDamagedQuantity",
      headerName: "Returns",
      minWidth: 73,
      maxWidth: 73,
      sortable: false,
      flex: 1,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "actualGoodsQuantity",
      headerName: "Goods",
      width: 150,
      sortable: false,
      flex: 1,
      headerAlign: "right",
      align: "right",
      type: "number",
      minWidth: 73,
      maxWidth: 73,
      editable: unloadingHeader?.statusId == 2 ? false : true,
      cellClassName: "editable-cell",
      preProcessEditCellProps: (params) => {
        const hasError =
          params.props.value < 0 || params.props.value.toString().includes("e");
        if (hasError)
          enqueueSnackbar("Value cannot be negative", {
            variant: "error",
          });
        return { ...params.props, error: hasError };
      },
    },
    {
      field: "actualDamagedQuantity",
      headerName: "Returns",
      width: 150,
      sortable: false,
      flex: 1,
      headerAlign: "right",
      align: "right",
      type: "number",
      minWidth: 73,
      maxWidth: 73,
      editable: unloadingHeader?.statusId == 2 ? false : true,
      cellClassName: "editable-cell",
      preProcessEditCellProps: (params) => {
        const hasError =
          params.props.value < 0 || params.props.value.toString().includes("e");
        if (hasError)
          enqueueSnackbar("Value cannot be negative", {
            variant: "error",
          });
        return { ...params.props, error: hasError };
      },
    },
    {
      field: "unloadingReasonUId",
      headerName: "Unloading Reason",
      minWidth: 150,
      sortable: false,
      flex: 1,
      disableColumnMenu: true,
      editable: unloadingHeader?.statusId == 2 ? false : true,
      type: "singleSelect",
      valueOptions: unloadingReasonsOptions.map((option) => ({
        label: option.label,
        value: option.value,
      })),
      renderCell: (params) => {
        const option = unloadingReasonsOptions.find(
          (option) => option.value === params.value
        );
        return option ? option.label : params.value;
      },
      cellClassName: "editable-cell",
    },
  ];

  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: "systemUnloading",
      headerName: "System Unloading",
      headerAlign: "center",
      children: [{ field: "goodsQuantity" }, { field: "damagedQuantity" }],
    },
    {
      groupId: "repUnloading",
      headerName: "Rep Unloading",
      headerAlign: "center",
      children: [
        { field: "repGoodsQuantity" },
        { field: "repDamagedQuantity" },
      ],
    },
    {
      groupId: "actualUnloading",
      headerName: "Actual Unloading",
      headerAlign: "center",
      children: [
        { field: "actualGoodsQuantity" },
        { field: "actualDamagedQuantity" },
      ],
    },
  ];

  if (isLoading) {
    return (
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
    )
  }

  return (
    <>
      <FormProvider methods={methods}>
        <Accordion
          expanded={expand1}
          onChange={() => setExpand1(!expand1)}
          sx={{
            mb: 2,
            borderRadius: "9px",
            backgroundColor: "white",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{
              flexDirection: "row-reverse",
              alignItems: "center",
              borderTopLeftRadius: "9px",
              borderTopRightRadius: "9px",
              borderBottomLeftRadius: expand1 ? "0px" : "9px",
              borderBottomRightRadius: expand1 ? "0px" : "9px",
              backgroundColor: "white",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                color: theme.palette.primary.main,
                ml: 1,
              }}
            >
              Tour Unloading Warehouse Details
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              backgroundColor: "white",
              borderTopLeftRadius: expand1 ? "0px" : "9px",
              borderTopRightRadius: expand1 ? "0px" : "9px",
              borderBottomLeftRadius: "9px",
              borderBottomRightRadius: "9px",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Divider sx={{ borderColor: "#e8eaef", mt: 0.5, mb: 2 }} />
              <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Grid item xs={3}>
                  <RHFAutocompleteField
                    name="distributorPrimaryWarehouseUId"
                    placeholder="Primary Warehouse"
                    // @ts-ignore
                    options={primaryWarehousesOptions}
                    control={control}
                  />
                </Grid>
                <Grid item xs={3}>
                  <RHFAutocompleteField
                    name="distributorDamageWarehouseUId"
                    placeholder="Damage Warehouse"
                    // @ts-ignore
                    options={damageWarehousesOptions}
                    control={control}
                  />
                </Grid>
              </Grid>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                {unloadingHeader?.statusId === 2 ? null : (
                  <>
                    <LoadingButton
                      variant="outlined"
                      sx={{ mr: 2 }}
                      loading={isSubmitting}
                      onClick={handleSaveAsDraft}
                      disabled={
                        disPrimaryWarehouseUId === null ||
                        disPrimaryWarehouseUId === 0 ||
                        disSecondaryWarehouseUId === 0 ||
                        disSecondaryWarehouseUId === null
                      }
                    >
                      {unloadingHeader?.statusId === 1 ? "Update" : "Save"}
                    </LoadingButton>
                    <LoadingButton
                      variant="contained"
                      onClick={handleSubmitForm}
                      loading={isSubmitting}
                      disabled={
                        disPrimaryWarehouseUId === null ||
                        disPrimaryWarehouseUId === 0 ||
                        disSecondaryWarehouseUId === 0 ||
                        disSecondaryWarehouseUId === null
                      }
                    >
                      Submit
                    </LoadingButton>
                  </>
                )}
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        <DataGrid
          sx={{ height: "60vh", ...focusDataGridStyle }}
          rows={searchedRows}
          columns={getColumnsWithTooltip(columns)}
          experimentalFeatures={{ columnGrouping: true }}
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
            toolbar: () => (
              <QuickSearchToolbar
                columns={columnNames}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                menuItem={{
                  field: "searchColumn",
                  headerName: "Search By",
                }}
              />
            ),
          }}
          columnGroupingModel={columnGroupingModel}
          processRowUpdate={handleRowUpdate}
          density="compact"
          disableRowSelectionOnClick
          disableColumnMenu
        />
      </FormProvider>
    </>
  );
};

export default UnloadingRepTour;
