"use client";

import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { RHFAutocompleteField } from "@/components/hook-form";
import CloneNewInvoice from "@/components/popup/clone-new-invoice-dialog";
import ConfirmBulkSubmitDialog from "@/components/popup/ConfirmBulkSubmitDialog";
import ConfirmSubmitDialog from "@/components/popup/ConfirmSubmitDialog";
import {
  resetTourSalesInvoiceSlice,
  setSalesInvoiceByID,
} from "@/redux/slices/tour/tour-sales-invoice";
import {
  resetTourSalesSlice,
  setScheduleData,
  setTourLostCall,
  setTourSalesCall,
} from "@/redux/slices/tour/tour-sales-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllLostCallReasons } from "@/service/lostCallReason.service";
import { createLostCallBulk } from "@/service/tour-service/lostCall.service";
import {
  addSameProductSaleInvoiceView,
  createSalesInvoices,
  getAllTourLoadings,
} from "@/service/tour-service/sale.service";
import {
  getTourScheduleById,
  updateTourjourneyStatus,
} from "@/service/tour-service/tourSchedule.service";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { mapListToOptions } from "@/utils/sortUtils";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PaidIcon from "@mui/icons-material/Paid";
import PostAddIcon from "@mui/icons-material/PostAdd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  styled,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridColumnGroupHeaderParams,
  GridColumnGroupingModel,
  gridColumnVisibilityModelSelector,
  useGridApiContext,
} from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Sales_StatusChip } from "./components/tourStatusChip";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";
import InvoicePrintPopup from "@/components/popup/InvoicePrintPopup";

interface SaleRepTourProps {
  schedule: any;
}

const SaleRepTour: React.FC<SaleRepTourProps> = ({ schedule }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [invoiceUID, setInvoiceUID] = useState(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [lostCallModalOpen, setLostCallModalOpen] = useState(false);
  const [confirmBulkSubmitOpen, setConfirmBulkSubmitOpen] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpenOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [printIncoiceOpen, setPrintIncoiceOpen] = useState(false);
  const [isLostCallSubmitting, setIsLostCallSubmitting] = useState(false);
  const [invoiceIDOrLostCallID, setInvoiceIDOrLostCallID] = useState<string | undefined>(undefined);
  const [invoiceIDOrLostCallIDFileName, setInvoiceIDOrLostCallIDFileName] = useState<string>("");
  const tourSalesList = useSelector((state) => state.tourSalesSlice.TourSales);
  const lostCallReasonList = useSelector(
    (state) => state.lostCallReasonSlice.lostCallReasonDetails
  );

  useEffect(() => {
    fetchGetAllTourLoadings();
    dispatch(resetTourSalesSlice());
    dispatch(resetTourSalesInvoiceSlice());
    localStorage.removeItem("invoiceID");
  }, []);

  const handleNewClick = () => {
    dispatch(setScheduleData(schedule));
    const query = new URLSearchParams({ scheduleId: schedule.uId }).toString();
    router.push(`${PATH_DASHBOARD.repTour.createNewInvoice}?${query}`);
  };

  const methods = useForm<any>({
    //@ts-ignore
    mode: "all",
  });
  const { control, reset, getValues, watch } = methods;

  const lostCallReasonsMap = lostCallReasonList
    ? mapListToOptions(lostCallReasonList, "reason", "uId")
    : [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getAllLostCallReasons(
            undefined,
            undefined,
            undefined,
            "reason",
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

  const handleRegisterBtnClick = () => {
    if (selectedRows.length === 0) {
      enqueueSnackbar("Please select at least one invoice", {
        variant: "error",
      });
      return;
    } else {
      setLostCallModalOpen(true);
    }
  };

  const handleClose = () => {
    setConfirmBulkSubmitOpen(false);
  };

  const handleSaleClick = (rowData: any) => {
    dispatch(setSalesInvoiceByID({}));
    createSalesInvoicesFn(schedule.vehicleUId);
    dispatch(setTourSalesCall(rowData));

    const query = new URLSearchParams({
      scheduleId: schedule.uId,
      saleViewUId: rowData.uId,
      invoiceIDOrLostCallID: rowData.invoiceIDOrLostCallID,
      routeName: rowData.route?.routeName,
      outlet: rowData.outlet?.name,
      outletID: rowData.outletUId,
      paymentMode: rowData.paymentMode?.paymentModeType,
      distributorID: schedule.distributorUId,
      representativeID: schedule.representativeUId,
      routeID: rowData.routeUId,
    }).toString();
    router.push(`${PATH_DASHBOARD.repTour.salesInvoice}?${query}`);
  };

  const handleContinueSaleClick = (rowData: any) => {
    dispatch(setTourSalesCall(rowData));

    const query = new URLSearchParams({
      scheduleId: schedule.uId,
      saleStatus: rowData.saleStatus,
      invoiceIDOrLostCallID: rowData.invoiceIDOrLostCallID,
      routeName: rowData.route?.routeName,
      outlet: rowData.outlet?.name,
      outletID: rowData.outletUId,
      paymentMode: rowData.paymentMode?.paymentModeType,
      distributorID: schedule.distributorUId,
      representativeID: schedule.representativeUId,
      routeID: rowData.routeUId,
      saleViewUId: rowData.uId,
      vehicleUId: rowData.tourSchedule.vehicleUId,
    }).toString();
    localStorage.setItem("invoiceID", rowData.invoiceIDOrLostCallID);
    if (rowData.saleStatus === 3 || rowData.saleStatus === 4) {
      router.push(`${PATH_DASHBOARD.repTour.return}?${query}`);
    } else {
      router.push(`${PATH_DASHBOARD.repTour.salesInvoice}?${query}`);
    }
  };

  const handlePaymentClick = (rowData: any) => {
    dispatch(setTourSalesCall(rowData));
    const query = new URLSearchParams({ scheduleId: schedule.uId }).toString();
    router.push(
      `${PATH_DASHBOARD.repTour.payment.list}/${rowData.outletUId}?${query}`
    );
  };

  const handleLostClick = (rowData: any) => {
    dispatch(setTourLostCall(rowData));
    const query = new URLSearchParams({
      scheduleId: schedule.uId,
      saleViewUId: rowData.uId,
    }).toString();
    router.push(`${PATH_DASHBOARD.repTour.lostCall.add}?${query}`);
  };

  const handleReturnClick = (rowData: any) => {
    dispatch(setSalesInvoiceByID({}));
    createSalesInvoicesFn(schedule.vehicleUId);
    dispatch(setTourSalesCall(rowData));

    const query = new URLSearchParams({
      scheduleId: schedule.uId,
      saleViewUId: rowData.uId,
      invoiceIDOrLostCallID: rowData.invoiceIDOrLostCallID,
      routeName: rowData.route?.routeName,
      outlet: rowData.outlet?.name,
      outletID: rowData.outletUId,
      paymentMode: rowData.paymentMode?.paymentModeType,
      distributorID: schedule.distributorUId,
      representativeID: schedule.representativeUId,
      routeID: rowData.routeUId,
    }).toString();
    router.push(`${PATH_DASHBOARD.repTour.return}?${query}`);
  };

  const createSalesInvoicesFn = async (vehicleID: any) => {
    try {
      await createSalesInvoices(vehicleID);
    } catch {
      enqueueSnackbar("Error while creating sales invoice", {
        variant: "error",
      });
    }
  };

  const handlePrintInvoice = (rowData: any) => {
    setInvoiceIDOrLostCallID(rowData.invoiceIDOrLostCallID);
    setInvoiceIDOrLostCallIDFileName(rowData.invoiceIDOrLostCallID);
    setPrintIncoiceOpen(true);
  };

  const lostCallReasonUId = watch("lostCallReasonUId");

  const handleCloseModal = () => {
    setLostCallModalOpen(false);
    reset({ lostCallReasonUId: null });
  };

  const handleConfirm = () => {
    if (!lostCallReasonUId) {
      enqueueSnackbar("Please select a Lost Call Reason", {
        variant: "error",
      });
      return;
    } else {
      setConfirmBulkSubmitOpen(true);
    }
  };

  const handleCancelButtonClick = () => {
    setLostCallModalOpen(false);
    reset({ lostCallReasonUId: null });
  };

  const handleSubmitLostCallBulk = async () => {
    setIsLostCallSubmitting(true);
    const lostCallReasonUId = getValues("lostCallReasonUId");

    try {
      const payload = {
        saleInvoiceViewUId: selectedRows,
        lostCallDate: new Date().toISOString(),
        tourScheduleUId: schedule.uId,
        lostCallReasonUId: lostCallReasonUId,
        saleInvoiceTypeUId: 1,
      };
      await createLostCallBulk(payload);
      setLostCallModalOpen(false);
      setConfirmBulkSubmitOpen(false);
      fetchGetAllTourLoadings();
      setSelectedRows([]);
      reset({ lostCallReasonUId: null });
    } catch (error) { }
    finally {
      setIsLostCallSubmitting(false);
    }
  };

  const fetchGetAllTourLoadings = async () => {
    setIsLoading(true);
    try {
      await getAllTourLoadings(schedule.uId);
    } catch { }
    finally {
      setIsLoading(false);
    }
  };

  const handleCloneInvoiceConfirmation = (id: any) => {
    setOpen(true);
    setInvoiceUID(id);
  };

  const handleNewInvoiceClick = async (rowID: any) => {
    try {
      const responceMSG = await addSameProductSaleInvoiceView(rowID);
      fetchGetAllTourLoadings();
      setOpen(false);
      enqueueSnackbar(responceMSG, { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Error while creating new sales invoice", {
        variant: "error",
      });
    }
  };

  const hasOngoingSale = tourSalesList.some((row) => row.saleStatus === 1);

  const columns: any[] = [
    {
      field: "salesDate",
      headerName: "Date",
      minWidth: 100,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: (params: any) => {
        const date = params.row.salesDate;
        return date ? dayjs(date).format("MM/DD/YYYY") : "-";
      },
    },
    {
      field: "invoiceIDOrLostCallID",
      headerName: "Invoice/ Lost Call/ Return ID",
      minWidth: 200,
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: "paymentModeType",
      headerName: "Payment Type",
      minWidth: 110,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: (params: any) =>
        params.row.paymentMode?.paymentModeType || "-",
    },
    {
      field: "manualInvoiceNumber",
      headerName: "Manual Invoice Number",
      minWidth: 170,
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: "representative.name",
      headerName: "Sales Rep",
      minWidth: 120,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: (params: any) => params.row.representative?.name || "-",
    },
    {
      field: "route.routeName",
      headerName: "Route",
      minWidth: 120,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: (params: any) => params.row.route?.routeName || "-",
    },
    {
      field: "outlet.outletID",
      headerName: "Outlet ID",
      minWidth: 100,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: (params: any) => params.row.outlet?.outletID || "-",
    },
    {
      field: "outlet.name",
      headerName: "Outlet Name",
      minWidth: 130,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: (params: any) => params.row.outlet?.name || "-",
    },
    {
      field: "salesAction",
      headerName: "Status",
      minWidth: 100,
      flex: 1,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const saleOrLoststatus = params.value ?? "null";
        const saleStatus = params.row.saleStatus ?? "null";
        return (
          <Sales_StatusChip status={saleOrLoststatus} saleStatus={saleStatus} />
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 280,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params: any) => {
        const status = params.row.salesAction;
        if (schedule.statusUId >= 4) {
          return (
            <IconButton
              sx={{ color: "blue", mr: 1 }}
              onClick={() => handleContinueSaleClick(params.row)}
            >
              <VisibilityIcon />
            </IconButton>
          )
        }

        if (params.row.saleStatus === 1 && hasOngoingSale) {
          // Don't render "Sale" or "Lost" buttons
          return (
            <Button
              size="small"
              variant="contained"
              color="primary"
              sx={{
                bgcolor: "green",
                mr: 1,
                "&:hover": { bgcolor: "darkgreen" },
              }}
              onClick={() => handleContinueSaleClick(params.row)}
              disabled={status === true || status === false}
            >
              Continue Sale
            </Button>
          );
        } else if (!hasOngoingSale && params.row.saleStatus == null) {


          return (
            <>
              <Button
                size="small"
                variant="contained"
                color="primary"
                sx={{
                  bgcolor: "green",
                  mr: 1,
                  "&:hover": { bgcolor: "darkgreen" },
                }}
                onClick={() => handleSaleClick(params.row)}
                disabled={status === true || status === false}
              >
                Sale
              </Button>
              <Button
                size="small"
                variant="contained"
                sx={{
                  bgcolor: "red",
                  mr: 1,
                  "&:hover": { bgcolor: "darkred" },
                }}
                onClick={() => handleLostClick(params.row)}
                disabled={status === true || status === false}
              >
                Lost
              </Button>
              <Button
                size="small"
                variant="contained"
                color="primary"
                sx={{
                  bgcolor: "#205781",
                  mr: 1,
                  "&:hover": { bgcolor: "#205781" },
                }}
                onClick={() => handleReturnClick(params.row)}
                disabled={status === true || status === false}
              >
                Return
              </Button>
              <IconButton
                sx={{ color: "orange", mr: 1 }}
                onClick={() => handlePaymentClick(params.row)}
              >
                <PaidIcon />
              </IconButton>
            </>
          );
        }

        if (params.row.saleStatus === 2 || params.row.saleStatus === 4) {
          return (
            <>
              <IconButton
                sx={{ color: "black", mr: 1 }}
                onClick={() => handlePrintInvoice(params.row)}
              >
                <LocalPrintshopIcon />
              </IconButton>
              <IconButton
                sx={{ color: "blue", mr: 1 }}
                onClick={() => handleContinueSaleClick(params.row)}
              >
                <VisibilityIcon />
              </IconButton>
              <IconButton
                sx={{ color: "orange", mr: 1 }}
                onClick={() => handlePaymentClick(params.row)}
              >
                <PaidIcon />
              </IconButton>
              <IconButton
                sx={{ color: "green" }}
                onClick={() => handleCloneInvoiceConfirmation(params.row.uId)}
              >
                <PostAddIcon />
              </IconButton>
            </>
          );
        }
        if (params.row.saleStatus === 3) {
          return (
            <>
              <Button
                size="small"
                variant="contained"
                color="primary"
                sx={{
                  bgcolor: "#205781",
                  mr: 1,
                  "&:hover": { bgcolor: "#205781" },
                }}
                onClick={() => handleReturnClick(params.row)}
                disabled={status === true || status === false}
              >
                Continue Return
              </Button>
            </>
          );
        }
      },
    },
  ];

  const {
    searchedRows,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
  } = useColumnFilter(tourSalesList, columns);

  const COLLAPSIBLE_COLUMN_GROUPS: Record<string, Array<string>> = {
    collapseColumn: [
      "invoiceIDOrLostCallID",
      "paymentModeType",
      "manualInvoiceNumber",
      "name",
    ],
  };

  const ColumnGroupRoot = styled("div")({
    overflow: "hidden",
    display: "flex",
    alignItems: "left",
  });

  const ColumnGroupTitle = styled("span")({
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontWeight: "bold",
    color: "#212b36",
  });

  function CollapsibleHeaderGroup({
    groupId,
    headerName,
  }: GridColumnGroupHeaderParams) {
    const apiRef = useGridApiContext();
    const columnVisibilityModel = gridColumnVisibilityModelSelector(apiRef);

    if (!groupId) {
      return null;
    }

    const isCollapsible = Boolean(COLLAPSIBLE_COLUMN_GROUPS[groupId]);
    const isGroupCollapsed = COLLAPSIBLE_COLUMN_GROUPS[groupId].every(
      (field: any) => columnVisibilityModel[field] === false
    );

    return (
      <ColumnGroupRoot>
        <ColumnGroupTitle>{headerName ?? groupId}</ColumnGroupTitle>{" "}
        {isCollapsible && (
          <IconButton
            sx={{ ml: 0.5 }}
            onClick={() => {
              const newModel = { ...columnVisibilityModel };
              COLLAPSIBLE_COLUMN_GROUPS[groupId].forEach((field: any) => {
                newModel[field] = !!isGroupCollapsed;
              });
              apiRef.current.setColumnVisibilityModel(newModel);
            }}
          >
            {isGroupCollapsed ? (
              <KeyboardArrowRightIcon fontSize="small" />
            ) : (
              <KeyboardArrowDownIcon fontSize="small" />
            )}
          </IconButton>
        )}
      </ColumnGroupRoot>
    );
  }

  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: "collapseColumn",
      headerName: "Collapse Columns",
      headerAlign: "left",
      renderHeaderGroup: (params) => <CollapsibleHeaderGroup {...params} />,
      children: [
        { field: "salesDate" },
        { field: "invoiceIDOrLostCallID" },
        { field: "paymentModeType" },
        { field: "manualInvoiceNumber" },
        { field: "name" },
      ],
    },
  ];

  const initialColumnVisibilityModel = {
    invoiceIDOrLostCallID: false,
    paymentModeType: false,
    manualInvoiceNumber: false,
    name: false,
  };
  console.log('searchedRows', searchedRows);

  const handleSubmitDialog = () => {
    const TodoRows = (searchedRows.filter(row => row.saleStatus == null && row.salesAction == null)).length;

    if (TodoRows == 0) {
      setConfirmSubmitOpenOpen(true);
    } else {
      enqueueSnackbar("Please complete all outlets", {
        variant: "error",
      });
    }
  };

  const handleSaveTableClick = async () => {
    try {
      const resMsg = await updateTourjourneyStatus(schedule.uId, 4);
      fetchGetAllTourLoadings();
      getTourScheduleById(schedule.uId);
      enqueueSnackbar(resMsg, { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Error while submitting sales invoice", {
        variant: "error",
      });
    } finally {
      setConfirmSubmitOpenOpen(false);
    }
  };

  const shouldDisable = tourSalesList.some(
    (row) =>
      (row.saleStatus === null && row.salesAction === null) ||
      row.saleStatus === 1 ||
      row.saleStatus === 3 ||
      schedule.statusUId >= 4
  );

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
    );
  }

  return (
    <>
      <DataGrid
        sx={{ height: "65vh" }}
        getRowId={(row) => row.uId}
        rows={searchedRows}
        columns={getColumnsWithTooltip(columns)}
        checkboxSelection
        rowSelectionModel={selectedRows}
        onRowSelectionModelChange={(newSelection) => {
          setSelectedRows(newSelection);
        }}
        isRowSelectable={(params) =>
          params.row.saleStatus === null && params.row.salesAction !== false
        }
        slots={{
          noRowsOverlay: CustomNoRowsOverlay,
          toolbar: () => (
            <QuickSearchToolbar
              handleNewClick={handleNewClick}
              newBtnText={"Add sales invoice"}
              handleRegisterBtnClick={handleRegisterBtnClick}
              registerButtonText={"Lost Call"}
              isRegisterButtonDisabled={schedule.statusUId >= 4}
              handleSaveClick={handleSubmitDialog}
              saveBtnText={"Submit"}
              saveBtnDisabled={schedule.statusUId >= 4}
              isDisabled={shouldDisable}
              isNewButtonDisabled={schedule.statusUId >= 4}
              columns={columns.filter(
                (col) =>
                  col.field !== "salesAction" &&
                  col.field !== "action" &&
                  col.field !== "vehicle"
              )}
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
        density="compact"
        disableRowSelectionOnClick
        disableColumnMenu
        experimentalFeatures={{ columnGrouping: true }}
        columnGroupingModel={columnGroupingModel}
        initialState={{
          columns: {
            columnVisibilityModel: initialColumnVisibilityModel,
          },
        }}
      />
      <CloneNewInvoice
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => handleNewInvoiceClick(invoiceUID)}
      />
      <Modal
        open={lostCallModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="lost-call-modal-title"
        aria-describedby="lost-call-modal-description"
        sx={{ height: "100%" }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="lost-call-modal-description" sx={{ mt: 2, mb: 3 }}>
            Please select a Lost Call Reason
          </Typography>
          <RHFAutocompleteField
            name="lostCallReasonUId"
            placeholder="Lost Call Reason*"
            options={lostCallReasonsMap}
            control={control}
            inputProps={{
              form: {
                autocomplete: "off",
              },
            }}
          />
          <Box sx={{ mt: 5, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleCancelButtonClick}>Cancel</Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ ml: 2 }}
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>
      <ConfirmBulkSubmitDialog
        open={confirmBulkSubmitOpen}
        onClose={handleClose}
        onConfirm={handleSubmitLostCallBulk}
        isSubmitting={isLostCallSubmitting}
      />
      <ConfirmSubmitDialog
        open={confirmSubmitOpen}
        onClose={() => setConfirmSubmitOpenOpen(false)}
        onConfirm={handleSaveTableClick}
      />
      <InvoicePrintPopup
        open={printIncoiceOpen}
        onClose={() => setPrintIncoiceOpen(false)}
        invoiceIDOrLostCallID={invoiceIDOrLostCallID}
        fileName={invoiceIDOrLostCallIDFileName}
        reportName="Sales Invoice"
      />
    </>
  );
};

export default SaleRepTour;
