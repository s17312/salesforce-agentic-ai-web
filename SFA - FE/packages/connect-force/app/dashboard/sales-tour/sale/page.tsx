"use client";

import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { RHFAutocompleteField } from "@/components/hook-form";
import CloneNewInvoice from "@/components/popup/clone-new-invoice-dialog";
import ConfirmBulkSubmitDialog from "@/components/popup/ConfirmBulkSubmitDialog";
import ConfirmDeleteDialog from "@/components/popup/ConfirmDeleteDialog";
import ConfirmSubmitDialog from "@/components/popup/ConfirmSubmitDialog";
import DeleteTempPaymentsDialog from "@/components/popup/delete-temp-payments-dialog";
import {
  setSalesBulkUpload,
  setTourSalesCall,
} from "@/redux/slices/tour/tour-sales-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllLostCallReasons } from "@/service/lostCallReason.service";
import { createLostCallBulk } from "@/service/tour-service/lostCall.service";
import { updateTourjourneyStatus } from "@/service/tour-service/tourSchedule.service";
import {
  addSameValueSaleInvoiceView,
  deleteValueSaleInvoiceView,
  getAllValueTourLoadings,
  submitValueSaleInvoiceView,
  updateValueSaleInvoiceView,
} from "@/service/value-sale/valueSaleinvoice.service";
import { editabledataGridStyles } from "@/styles/tableStyles/dataGridStyles";
import {
  focusDataGridStyle,
  tableIconColors,
} from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { mapListToOptions } from "@/utils/sortUtils";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PaidIcon from "@mui/icons-material/Paid";
import PostAddIcon from "@mui/icons-material/PostAdd";
import SaveIcon from "@mui/icons-material/Save";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import {
  DataGrid,
  GridActionsCellItem,
  GridCellParams,
  GridColDef,
  GridColumnGroupHeaderParams,
  GridColumnGroupingModel,
  gridColumnVisibilityModelSelector,
  GridRowModel,
  useGridApiContext,
} from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Sale_Payment_StatusChip } from "./components/salePaymentStatusChip";
import { Sales_StatusChip } from "./components/tourStatusChip";
import {
  setLostCallError,
  setLostCallMessage,
} from "@/redux/slices/tour/lost-call/lost-call-slice";
import { formatCurrency } from "@/utils/formatCurrency";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";
import SaleJourneyUploadPopUp from "./components/salesUploadPopUp";

interface SaleRepTourProps {
  schedule: any;
  fetchTourScheduleID: () => void;
}

const SaleRepTour: React.FC<SaleRepTourProps> = ({
  schedule,
  fetchTourScheduleID,
}) => {
  const router = useRouter();
  const theme = useTheme();
  const [rows, setRows] = useState([] as any[]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [rowDeletedialogOpen, setRowDeletedialogOpen] = useState(false);
  const [deletePaymentsDialogOpen, setDeletePaymentsDialogOpen] =
    useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpenOpen] = useState(false);
  const [confirmBulkSubmitOpen, setConfirmBulkSubmitOpen] = useState(false);
  const [uploadPopUpOpen, setUploadPopUpOpenOpen] = useState(false);
  const [invoiceUID, setInvoiceUID] = useState(null);
  const [isCellEditable, setIsCellEditable] = useState(false);
  const [editableRowId, setEditableRowId] = useState<string | null>(null);
  const [deleteRowData, setDeleteRowData] = useState<any | null>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [lostCallModalOpen, setLostCallModalOpen] = useState(false);
  const [isLostCallSubmitting, setIsLostCallSubmitting] = useState(false);
  const [hasBulkUploadError, setHasBulkUploadError] = useState(false);
  const [uploadAttempted, setUploadAttempted] = useState(false);
  const [isBulkValidated, setIsBulkValidated] = useState(false);
  const [persistedBulkMap, setPersistedBulkMap] = useState<
    Record<string, any[]>
  >({});

  const tourSalesList = useSelector(
    (state) => state.tourValueSalesSlice.TourValueSales
  );

  const lostCallReasonList = useSelector(
    (state) => state.lostCallReasonSlice.lostCallReasonDetails
  );

  const responseMessage = useSelector((state) => state.lostCallSlice.message);
  const responseError = useSelector((state) => state.lostCallSlice.error);
  const salesBulk = useSelector((state) => state.tourSalesSlice.SalesBulk);

  const methods = useForm<any>({
    //@ts-ignore
    mode: "all",
  });
  const { control, reset, getValues, watch } = methods;

  // useEffect(() => {
  //   fetchGetAllTourLoadings();
  // }, []);

  useEffect(() => {
    fetchGetAllTourLoadings();
  }, [schedule]);

  useEffect(() => {
    return () => {
      dispatch(setSalesBulkUpload([]));
    };
  }, []);

  const handleUploadBtnClick = () => {
    const hasUnsaved = rows.some(
      (row) => row.saleStatus == null && row.totalAmount > 0
    );
    if (hasUnsaved) {
      enqueueSnackbar("Please save unsaved sales", { variant: "warning" });
      return;
    }
    setUploadPopUpOpenOpen(true);
  };

  const handleUploadPopUpClose = () => {
    setUploadPopUpOpenOpen(false);
  };

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

  const handleNewClick = () => {
    dispatch(setTourSalesCall([]));
    const query = new URLSearchParams({ scheduleId: schedule.uId }).toString();
    router.push(`${PATH_DASHBOARD.salesTour.createNewInvoice}?${query}`);
  };

  const handlePaymentClick = (rowData: any) => {
    dispatch(setTourSalesCall(rowData));
    const query = new URLSearchParams({ scheduleId: schedule.uId }).toString();
    router.push(
      `${PATH_DASHBOARD.salesTour.payment.list}/${rowData.outletUId}?${query}`
    );
  };

  const handlePaymentDeleteClick = (rowData: any) => {
    dispatch(setTourSalesCall(rowData));
    const query = new URLSearchParams({ scheduleId: schedule.uId }).toString();
    router.push(
      `${PATH_DASHBOARD.salesTour.payment.delete}/${rowData.outletUId}?${query}`
    );
  };

  const handleSaveTableClick = async () => {
    try {
      const resMsg = await submitValueSaleInvoiceView(schedule.uId);
      await fetchGetAllTourLoadings();
      await updateTourjourneyStatus(schedule.uId, 4);
      fetchTourScheduleID();
      enqueueSnackbar(resMsg, { variant: "success" });
      dispatch(setSalesBulkUpload([]));
    } catch (error) {
      enqueueSnackbar("Error while submitting sales invoice", {
        variant: "error",
      });
    } finally {
      setConfirmSubmitOpenOpen(false);
    }
  };

  const handleSaveClick = async (rowData: any) => {
    const payload = {
      saleInvoiceView: {
        salesDate: rowData.salesDate,
        tourScheduleUId: rowData.tourScheduleUId,
        invoiceIDOrLostCallID: rowData.invoiceIDOrLostCallID,
        paymentModeUId: rowData.paymentModeUId,
        manualInvoiceNumber: rowData.manualInvoiceNumber,
        repUId: rowData.repUId,
        routeUId: rowData.routeUId,
        outletUId: rowData.outletUId,
        invoiceAmount: rowData.invoiceAmount,
        discountAmount: rowData.discountAmount,
        returnAmount: rowData.returnAmount,
        totalAmount: rowData.totalAmount,
        saleStatus: 1,
        saleInvoiceTypeUId: 2,
      },
    };

    try {
      const responceMsg = await updateValueSaleInvoiceView(
        rowData.uId,
        payload
      );
      setEditableRowId(null);
      setIsCellEditable(false);
      fetchGetAllTourLoadings();
      enqueueSnackbar(responceMsg, { variant: "success" });
      removeBulkEntry(rowData.outlet.outletID, rowData.manualInvoiceNumber);
    } catch (error) {
      enqueueSnackbar("Error while updating sales invoice", {
        variant: "error",
      });
    }
  };

  const handleEditClick = async (rowData: any) => {
    if (rowData.paymentStatus !== 0) {
      setDeletePaymentsDialogOpen(true);
      setDeleteRowData(rowData);
      setIsEdit(true);
      return;
    }

    if (rowData.saleStatus === 1 || rowData.saleStatus === 2) {
      setIsCellEditable(true);
      setEditableRowId(rowData.uId);
      return;
    }

    const payload = {
      saleInvoiceView: {
        salesDate: rowData.salesDate,
        tourScheduleUId: rowData.tourScheduleUId,
        invoiceIDOrLostCallID: rowData.invoiceIDOrLostCallID,
        paymentModeUId: rowData.paymentModeUId,
        manualInvoiceNumber: rowData.manualInvoiceNumber,
        repUId: rowData.repUId,
        routeUId: rowData.routeUId,
        outletUId: rowData.outletUId,
        invoiceAmount: rowData.invoiceAmount,
        discountAmount: rowData.discountAmount,
        returnAmount: rowData.returnAmount,
        totalAmount: rowData.totalAmount,
        saleStatus: 1,
        saleInvoiceTypeUId: 2,
      },
    };

    try {
      const responceMsg = await updateValueSaleInvoiceView(
        rowData.uId,
        payload
      );
      fetchGetAllTourLoadings();
      enqueueSnackbar(responceMsg, { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Error while updating sales invoice", {
        variant: "error",
      });
    }
  };

  const handleSubmitDialog = () => {
    const TodoRows = searchedRows.filter(
      (row) => row.saleStatus == null && row.salesAction == null
    ).length;

    if (TodoRows == 0) {
      setConfirmSubmitOpenOpen(true);
    } else {
      enqueueSnackbar("Please complete all outlets", {
        variant: "error",
      });
    }
  };

  const confirmDelete = async () => {
    if (deleteRowData !== null) {
      try {
        const responceMsg = await deleteValueSaleInvoiceView(
          schedule.uId,
          deleteRowData.outletUId,
          deleteRowData.uId,
          deleteRowData.saleInvoiceTypeUId
        );
        fetchGetAllTourLoadings();
        enqueueSnackbar(responceMsg, { variant: "success" });
        setDeleteRowData(null);
      } catch (error) {
      } finally {
        setRowDeletedialogOpen(false);
        setDeleteRowData(null);
      }
    }
  };

  const handleDeletedRowClick = async (rowData: any) => {
    if (rowData.paymentStatus !== 0) {
      setDeletePaymentsDialogOpen(true);
      setDeleteRowData(rowData);
      setIsEdit(false);
      return;
    }
    setRowDeletedialogOpen(true);
    setDeleteRowData(rowData);
  };

  const removeBulkEntry = (outletID: string, manualInvoiceNumber?: string) => {
    setPersistedBulkMap((prev) => {
      if (!prev[outletID]) return prev;

      const filtered = prev[outletID].filter(
        (b) => b.ManualInvoiceNumber !== manualInvoiceNumber
      );

      const updated = { ...prev };
      if (filtered.length > 0) {
        updated[outletID] = filtered;
      } else {
        delete updated[outletID];
      }
      return updated;
    });
  };

  useEffect(() => {
    if (tourSalesList?.length > 0) {
      const bulkMap: Record<string, any[]> = {};
      //Run bulk validation first upload attempt
      if (!isBulkValidated && salesBulk?.length !== 0) {
        // Group bulk data by OutletID
        salesBulk.forEach((bulk) => {
          if (!bulkMap[bulk.OutletID]) bulkMap[bulk.OutletID] = [];
          bulkMap[bulk.OutletID].push(bulk);
        });

        let hasError = false;

        salesBulk.forEach((bulk) => {
          const duplicate = tourSalesList.find(
            (tourSale) =>
              tourSale.outlet?.outletID === bulk.OutletID &&
              tourSale.manualInvoiceNumber === bulk.ManualInvoiceNumber
          );

          if (duplicate) {
            enqueueSnackbar(
              `Outlet ID ${bulk.OutletID} with Manual Invoice No ${bulk.ManualInvoiceNumber} already exists.`,
              { variant: "error" }
            );
            hasError = true;
          }

          const lostCall = tourSalesList.find(
            (tourSale) =>
              tourSale.outlet?.outletID === bulk.OutletID &&
              tourSale.saleStatus === 4
          );
          if (lostCall) {
            enqueueSnackbar(
              `Outlet ID ${bulk.OutletID} already has a Lost Call.`,
              { variant: "error" }
            );
            hasError = true;
          }

          const existsInSalesList = tourSalesList.some(
            (tourSale) => tourSale.outlet?.outletID === bulk.OutletID
          );
          if (!existsInSalesList) {
            enqueueSnackbar(
              `Outlet ID ${bulk.OutletID} does not exist in the sales list.`,
              { variant: "error" }
            );
            hasError = true;
          }
        });

        if (hasError) {
          setHasBulkUploadError(true);
          setUploadAttempted(false);
          return;
        } else {
          setHasBulkUploadError(false);
          enqueueSnackbar("Sales list uploaded successfully", {
            variant: "success",
          });
          handleUploadPopUpClose();
        }
        setPersistedBulkMap(bulkMap);
        setIsBulkValidated(true);
      }

      const outletBulkIndex: Record<string, number> = {};
      const effectiveBulkMap = isBulkValidated ? persistedBulkMap : bulkMap;

      const mappedTourSalesList = tourSalesList.map((tourSale) => {
        const outletID = tourSale.outlet?.outletID;
        let uploadedMatch = null;

        if (
          outletID &&
          effectiveBulkMap[outletID] &&
          effectiveBulkMap[outletID].length > 0 &&
          !tourSale.invoiceIDOrLostCallID
        ) {
          const index = outletBulkIndex[outletID] || 0;
          uploadedMatch = effectiveBulkMap[outletID][index] || null;
          outletBulkIndex[outletID] = index + 1;
        }

        const manualInvoiceNumber =
          tourSale.manualInvoiceNumber ??
          uploadedMatch?.ManualInvoiceNumber ??
          "";

        const invoiceAmount = tourSale.manualInvoiceNumber
          ? tourSale.invoiceAmount
          : uploadedMatch?.Sale ?? tourSale.invoiceAmount ?? 0.0;

        const discountAmount = tourSale.manualInvoiceNumber
          ? tourSale.discountAmount
          : uploadedMatch?.Discount ?? tourSale.discountAmount ?? 0.0;

        const returnAmount = tourSale.manualInvoiceNumber
          ? tourSale.returnAmount
          : uploadedMatch?.Return ?? tourSale.returnAmount ?? 0.0;

        const totalAmount =
          tourSale.totalAmount ||
          invoiceAmount - (discountAmount + returnAmount);

        return {
          ...tourSale,
          manualInvoiceNumber,
          invoiceAmount,
          discountAmount,
          returnAmount,
          totalAmount,
        };
      });

      setRows(mappedTourSalesList);
    }
  }, [tourSalesList, salesBulk, isBulkValidated, persistedBulkMap]);

  const handleRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = {
      ...newRow,
      salesDate: newRow.salesDate
        ? dayjs(newRow.salesDate).format("YYYY-MM-DDTHH:mm:ss.SSS")
        : null,
      manualInvoiceNumber: newRow.manualInvoiceNumber || "",
      invoiceAmount: Number(newRow.invoiceAmount),
      discountAmount: Number(newRow.discountAmount),
      returnAmount: Number(newRow.returnAmount),
      totalAmount:
        Number(newRow.invoiceAmount) -
        Number(newRow.discountAmount) -
        Number(newRow.returnAmount),
    };

    setRows((prevRows) =>
      // @ts-ignore
      prevRows.map((row) => (row.uId === updatedRow.uId ? updatedRow : row))
    );

    return updatedRow;
  };

  const fetchGetAllTourLoadings = async () => {
    setIsLoading(true);
    try {
      await getAllValueTourLoadings(schedule.uId);
    } catch {
      enqueueSnackbar("Error while fetching sales invoice", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleNewInvoiceClick = async (rowID: any) => {
    try {
      const responceMSG = await addSameValueSaleInvoiceView(rowID);
      fetchGetAllTourLoadings();
      setOpen(false);
      enqueueSnackbar(responceMSG, { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Error while creating new sales invoice", {
        variant: "error",
      });
    }
  };

  const handleCloneInvoiceConfirmation = (id: any) => {
    setOpen(true);
    setInvoiceUID(id);
  };

  const handleCancelClick = () => {
    setEditableRowId(null);
    setIsCellEditable(false);
    fetchGetAllTourLoadings();
  };

  const columns: any[] = [
    {
      field: "invoiceIDOrLostCallID",
      headerName: "Invoice",
      width: 120,
      disableColumnMenu: true,
    },
    {
      field: "salesDate",
      headerName: "Date",
      minWidth: 100,
      flex: 1,
      disableColumnMenu: true,
      editable: true,
      valueGetter: (params: any) => {
        const date = params.row.salesDate;
        return date ? dayjs(date).format("MM/DD/YYYY") : "-";
      },
      renderEditCell: (params: GridCellParams) => {
        return (
          <DatePicker
            // @ts-ignore
            value={params.value ? dayjs(params.value) : null}
            disableFuture
            onChange={(newValue) => {
              // @ts-ignore
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: newValue ? newValue.toISOString() : null,
              });
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        );
      },
    },
    {
      field: "paymentMode.paymentModeType",
      headerName: "Payment Type",
      minWidth: 130,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: (params: any) =>
        params.row.paymentMode?.paymentModeType || "-",
    },
    {
      field: "representative.name",
      headerName: "Sales Rep",
      minWidth: 130,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: (params: any) => params.row.representative?.name || "-",
    },
    {
      field: "route.routeName",
      headerName: "Route",
      minWidth: 130,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: (params: any) => params.row.route?.routeName || "-",
    },
    {
      field: "outlet.outletID",
      headerName: "Outlet ID",
      minWidth: 130,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: (params: any) => params.row.outlet?.outletID,
    },
    {
      field: "outlet.name",
      headerName: "Outlet",
      minWidth: 130,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: (params: any) => params.row.outlet?.name,
    },
    {
      field: "manualInvoiceNumber",
      headerName: "Manual Inv No",
      minWidth: 120,
      flex: 1,
      disableColumnMenu: true,
      editable: true,
      sortable: false,
    },
    {
      field: "invoiceAmount",
      headerName: "Sale",
      minWidth: 100,
      flex: 1,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      type: "number",
      editable: true,
      sortable: false,
      valueGetter: (params: any) => {
        return params.row.invoiceAmount
          ? `${formatCurrency(Number(params.row.invoiceAmount))}`
          : "-";
      },
      preProcessEditCellProps: (params: any) => {
        const hasError =
          params.props.value < 0 || params.props.value.toString().includes("e");
        return { ...params.props, error: hasError };
      },
    },
    {
      field: "discountAmount",
      headerName: "Discount",
      minWidth: 100,
      flex: 1,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      type: "number",
      editable: true,
      sortable: false,
      valueGetter: (params: any) => {
        return params.row.discountAmount
          ? `${formatCurrency(Number(params.row.discountAmount))}`
          : "-";
      },
      preProcessEditCellProps: (params: any) => {
        const hasError =
          params.props.value < 0 || params.props.value.toString().includes("e");
        return { ...params.props, error: hasError };
      },
    },
    {
      field: "returnAmount",
      headerName: "Return",
      minWidth: 100,
      flex: 1,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      type: "number",
      editable: true,
      sortable: false,
      valueGetter: (params: any) => {
        return params.row.returnAmount
          ? `${formatCurrency(Number(params.row.returnAmount))}`
          : "-";
      },
      preProcessEditCellProps: (params: any) => {
        const hasError =
          params.props.value < 0 || params.props.value.toString().includes("e");
        return { ...params.props, error: hasError };
      },
    },
    {
      field: "totalAmount",
      headerName: "Total",
      minWidth: 100,
      flex: 1,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      sortable: false,
      valueGetter: (params: any) => {
        return params.row.totalAmount
          ? `${formatCurrency(Number(params.row.totalAmount))}`
          : "-";
      },
    },
    {
      field: "saleStatus",
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
      field: "paymentStatus",
      headerName: "Paid",
      minWidth: 80,
      flex: 1,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        return <Sale_Payment_StatusChip status={params.row.paymentStatus} />;
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      headerAlign: "center",
      align: "right",
      sortable: false,
      renderCell: (params: any) => {
        if (params.row.uId === editableRowId) {
          return (
            <>
              <GridActionsCellItem
                icon={<SaveAsIcon />}
                label="Save"
                sx={{
                  color: "primary.main",
                }}
                onClick={() => handleSaveClick(params.row)}
              />
              <GridActionsCellItem
                icon={<CloseIcon />}
                label="Cancel"
                sx={{
                  color: tableIconColors.deleteIcon,
                }}
                onClick={() => handleCancelClick()}
              />
            </>
          );
        }

        if (schedule.statusUId >= 4) {
          return null;
        }

        return (
          <>
            {params.row.saleStatus == 2 || params.row.saleStatus == 3 ? null : (
              <>
                {params.row.saleStatus === 1 ? (
                  <>
                    <GridActionsCellItem
                      icon={<EditIcon />}
                      label="Edit"
                      sx={{
                        color: tableIconColors.editIconColor,
                      }}
                      onClick={() => handleEditClick(params.row)}
                      color="inherit"
                    />
                    <GridActionsCellItem
                      icon={<DeleteIcon />}
                      label="Delete"
                      sx={{
                        color: tableIconColors.deleteIcon,
                      }}
                      onClick={() => handleDeletedRowClick(params.row)}
                    />
                    <Divider orientation="vertical" flexItem />
                  </>
                ) : (
                  <GridActionsCellItem
                    icon={<SaveIcon />}
                    label="Save"
                    sx={{
                      color: "primary.main",
                    }}
                    onClick={() => handleSaveClick(params.row)}
                    disabled={
                      params.row.invoiceAmount === 0 &&
                      params.row.discountAmount === 0 &&
                      params.row.returnAmount === 0
                    }
                  />
                )}
              </>
            )}
            <IconButton
              size="small"
              onClick={() => handlePaymentClick(params.row)}
              disabled={schedule.statusUId >= 4}
            >
              <PaidIcon
                fontSize="small"
                sx={{ color: theme.palette.primary.main }}
              />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleCloneInvoiceConfirmation(params.row.uId)}
            >
              <PostAddIcon
                fontSize="small"
                sx={{ color: theme.palette.primary.main }}
              />
            </IconButton>
          </>
        );
      },
    },
  ];

  const COLLAPSIBLE_COLUMN_GROUPS: Record<string, Array<string>> = {
    collapseColumn: ["paymentMode.paymentModeType", "representative.name"],
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
        { field: "invoiceIDOrLostCallID" },
        { field: "paymentMode.paymentModeType" },
        { field: "representative.name" },
      ],
    },
  ];

  const initialColumnVisibilityModel = {
    invoiceIDOrLostCallID: true,
    "paymentMode.paymentModeType": false,
    "representative.name": false,
  };

  const isCellEditableFunction = (params: GridCellParams) => {
    if (schedule.statusUId >= 4 || params.row.saleStatus === 4) {
      return false;
    }
    return (
      (params.row.paymentStatus !== 1 &&
        params.row.saleStatus !== 1 &&
        params.row.saleStatus !== 3) ||
      params.row.uId === editableRowId
    );
  };

  const handleClose = () => {
    setConfirmBulkSubmitOpen(false);
  };

  const handleCancelButtonClick = () => {
    setLostCallModalOpen(false);
    reset({ lostCallReasonUId: null });
  };

  useEffect(() => {});

  useEffect(() => {
    if (responseMessage) {
      enqueueSnackbar(responseMessage, { variant: "success" });
      dispatch(setLostCallMessage(null));
    }
    if (responseError) {
      enqueueSnackbar(responseError, { variant: "error" });
      dispatch(setLostCallError(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseMessage, responseError]);

  const lostCallReasonUId = watch("lostCallReasonUId");

  const handleSubmitLostCallBulk = async () => {
    setIsLostCallSubmitting(true);
    const lostCallReasonUId = getValues("lostCallReasonUId");

    try {
      const payload = {
        saleInvoiceViewUId: selectedRows,
        lostCallDate: new Date().toISOString(),
        tourScheduleUId: schedule.uId,
        lostCallReasonUId: lostCallReasonUId,
        saleInvoiceTypeUId: 2,
      };
      await createLostCallBulk(payload);
      setLostCallModalOpen(false);
      setConfirmBulkSubmitOpen(false);
      fetchGetAllTourLoadings();
      setSelectedRows([]);
      reset({ lostCallReasonUId: null });
    } catch (error) {
    } finally {
      setIsLostCallSubmitting(false);
    }
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

  const handleCloseModal = () => {
    setLostCallModalOpen(false);
    reset({ lostCallReasonUId: null });
  };

  const {
    searchedRows,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
  } = useColumnFilter(rows, columns);

  return (
    <>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <Box sx={editabledataGridStyles(theme)}>
          <DataGrid
            sx={{ ...focusDataGridStyle }}
            getRowId={(row) => row.uId}
            rows={searchedRows}
            columns={getColumnsWithTooltip(columns)}
            checkboxSelection
            onRowSelectionModelChange={(newSelection) => {
              setSelectedRows(newSelection);
            }}
            isRowSelectable={(params) =>
              params.row.saleStatus !== 3 &&
              params.row.saleStatus !== 4 &&
              params.row.invoiceAmount === 0
            }
            slots={{
              noRowsOverlay: CustomNoRowsOverlay,
              toolbar: () => (
                <QuickSearchToolbar
                  handleUploadClick={handleUploadBtnClick}
                  handleNewClick={handleNewClick}
                  newBtnText={"Add sales invoice"}
                  handleRegisterBtnClick={handleRegisterBtnClick}
                  registerButtonText={"Lost Call"}
                  isNewButtonDisabled={schedule.statusUId >= 4}
                  handleSaveClick={handleSubmitDialog}
                  saveBtnText={"Submit"}
                  isDisabled={schedule.statusUId >= 4}
                  isRegisterButtonDisabled={schedule.statusUId >= 4}
                  columns={columns.filter(
                    (col) =>
                      col.field !== "saleStatus" &&
                      col.field !== "paymentStatus" &&
                      col.field !== "action"
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
            isCellEditable={isCellEditableFunction}
            processRowUpdate={handleRowUpdate}
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={columnGroupingModel}
            density="compact"
            // hideFooter
            disableRowSelectionOnClick
            disableColumnMenu
            initialState={{
              columns: {
                columnVisibilityModel: initialColumnVisibilityModel,
              },
            }}
          />
        </Box>
      )}
      <CloneNewInvoice
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => handleNewInvoiceClick(invoiceUID)}
      />
      <DeleteTempPaymentsDialog
        open={deletePaymentsDialogOpen}
        onClose={() => setDeletePaymentsDialogOpen(false)}
        onConfirm={() => handlePaymentDeleteClick(deleteRowData)}
        isEdit={isEdit}
      />
      <ConfirmDeleteDialog
        open={rowDeletedialogOpen}
        onClose={() => setRowDeletedialogOpen(false)}
        onConfirm={confirmDelete}
      />
      <ConfirmSubmitDialog
        open={confirmSubmitOpen}
        onClose={() => setConfirmSubmitOpenOpen(false)}
        onConfirm={handleSaveTableClick}
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
      <SaleJourneyUploadPopUp
        open={uploadPopUpOpen}
        handleClose={handleUploadPopUpClose}
        hasError={hasBulkUploadError}
        setUploadAttempted={setUploadAttempted}
      />
    </>
  );
};

export default SaleRepTour;
