"use client";

import { useTheme } from "@mui/material";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { DataGrid } from "@mui/x-data-grid";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "@/redux/store";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { enqueueSnackbar } from "notistack";
import {
  getPayemntSummary,
  updateChequePayment,
} from "@/service/paymentSummary.service";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import { Payment_StatusChip } from "./components/paymentStatusChip";
import ChequeDepositedPopUp from "./components/ChequeDepositedPopUp";
import PaidIcon from "@mui/icons-material/Paid";

const PaymentSummary = () => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const payment_list = useSelector(
    (state) => state.paymentSummarySlice.paymentSummaryDetails
  );
  const [rows, setRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [selectedCheque, setSelectedCheque] = useState<any>(null);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    if (payment_list && payment_list.length > 0) {
      setRows(transformPaymentData(payment_list));
    }
  }, [payment_list]);

  useEffect(() => {
    fetchPaymentSummaryAll();
  }, []);

  const fetchPaymentSummaryAll = async () => {
    try {
      setIsLoading(true);
      await getPayemntSummary();
    } catch (error) {
      enqueueSnackbar("Error fetching tour schedules", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const transformPaymentData = (data: any[]) => {
    const rows: any[] = [];

    data.forEach((item) => {
      const { paymentHeader, chequeDetails, uId } = item;
      //   console.log("paymentHeader => ", paymentHeader);
      console.log("chequeDetails => ", chequeDetails);

      if (item.paymentDetail && item.paymentDetail.length > 0) {
        item.paymentDetail.forEach((detail: any) => {
          //   console.log("detail => ", detail);
          rows.push({
            uId: `${paymentHeader.paymentHeaderId}-${detail.paymentDetailUId}`, // unique ID
            paymentDate: paymentHeader.paymentDate,
            paymentId: paymentHeader.paymentId,
            invoiceId: detail.invoiceId,
            invoiceAmount: detail.invoiceAmount,
            payment: detail.payment,
            distributorName: detail.distributorName,
            representativeName: detail.representativeName,
            routeName: detail.routeName,
            outletName: detail.outletName,
            paymentType: paymentHeader.paymentType,
            chequeNo: chequeDetails?.[0]?.chequeNo || "",
            bankCode: chequeDetails?.[0]?.bankCode || "",
            branchCode: chequeDetails?.[0]?.branchCode || "",
            banked: chequeDetails?.[0]?.banked ?? false,
            chequeReturn: chequeDetails?.[0]?.chequeReturn ?? false,
            outletUId: chequeDetails[0]?.outletUId || 0,
            tourScheduleUId: chequeDetails[0]?.tourScheduleUId || 0,
            status: getStatus(paymentHeader.paymentType, chequeDetails?.[0]),
          });
        });
      } else {
        // handle rows with no paymentDetail
        rows.push({
          uId: `${paymentHeader.paymentHeaderId}-0`,
          paymentDate: paymentHeader.paymentDate,
          paymentId: paymentHeader.paymentId,
          invoiceId: "",
          invoiceAmount: 0,
          payment: 0,
          distributorName: "",
          representativeName: "",
          routeName: "",
          outletName: "",
          paymentType: 1,
          chequeNo: chequeDetails?.[0]?.chequeNo || "",
          banked: chequeDetails?.[0]?.banked ?? false,
          chequeReturn: chequeDetails?.[0]?.chequeReturn ?? false,
          status: getStatus(1, chequeDetails?.[0]),
        });
      }
    });

    return rows;
  };

  const getStatus = (
    paymentType: number,
    chequeDetail?: any
  ): 1 | 2 | 3 | 4 => {
    if (paymentType === 1) return 3; // Completed
    if (paymentType === 2) {
      if (!chequeDetail?.banked && !chequeDetail?.chequeReturn) return 1; // Deposited
      if (chequeDetail?.banked && !chequeDetail?.chequeReturn) return 4; // Clear
      if (chequeDetail?.banked && chequeDetail?.chequeReturn) return 2; // Bounced
    }
    return 3; // default
  };

  const handleOpenDialog = (row: any) => {
    setSelectedRow(row);
    setSelectedCheque(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRow(null);
    setSelectedCheque(null);
  };

  const handleConfirm = () => {
    // TODO: Call your API here to mark cheque as Cleared or Bounced
    console.log("Confirmed action for row:", selectedRow);
    setOpenDialog(false);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const paymentTypeMap: Record<number, string> = {
    1: "Cash",
    2: "Cheque",
    3: "OutStanding",
  };

  const columns = [
    {
      field: "paymentDate",
      headerName: "Payment Date",
      flex: 1,
      valueGetter: (params: any) =>
        String(params.row.paymentDate).split("T")[0] || "",
    },
    { field: "invoiceId", headerName: "Invoice ID", flex: 1 },
    { field: "paymentId", headerName: "Payment ID", flex: 1 },
    { field: "distributorName", headerName: "Distributor", flex: 1 },
    { field: "representativeName", headerName: "Representative", flex: 1 },
    { field: "routeName", headerName: "Route", flex: 1 },
    { field: "outletName", headerName: "Outlet", flex: 1 },
    {
      field: "paymentType",
      headerName: "Payment Type",
      flex: 1,
      valueGetter: (params: any) =>
        paymentTypeMap[params.row.paymentType] || "",
    },
    { field: "chequeNo", headerName: "Cheque No", flex: 1 },
    { field: "invoiceAmount", headerName: "Invoice Amount", flex: 1 },
    { field: "payment", headerName: "Payment", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => (
        <Payment_StatusChip
          status={params.value}
          onClick={() => handleOpenDialog(params.row)}
        />
      ),
    },
  ];

  const handleAction = async (action: "cleared" | "bounced") => {
    if (!selectedCheque) return;

    try {
      const payload = {
        chequeNo: selectedCheque.chequeNo,
        bankCode: selectedCheque.bankCode,
        branchCode: selectedCheque.branchCode,
        chequeReturn: action === "bounced", // true if bounced
        banked: true, // always true once processed
      };
      await updateChequePayment(
        selectedCheque.outletUId,
        selectedCheque.tourScheduleUId,
        payload
      );

      enqueueSnackbar(
        `Cheque updated as ${action === "cleared" ? "Cleared" : "Bounced"}`,
        { variant: "success" }
      );

      fetchPaymentSummaryAll(); // refresh grid
      handleCloseDialog();
    } catch (error: any) {
      enqueueSnackbar(error.message || "Failed to update cheque", {
        variant: "error",
      });
    }
  };

  const {
    searchedRows,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
  } = useColumnFilter(rows, columns);

  const isFiltered =
    searchQuery.trim() !== "" ||
    Object.values(selectedStatus).some((val) => val !== "All");

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Payment Summary"
        pageNavigation={[
          {
            pageName: "Payment Summary View",
          },
        ]}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
        icon={<PaidIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        <DataGrid
          getRowId={(row) => row.uId}
          rows={isFiltered ? searchedRows : rows}
          columns={getColumnsWithTooltip(columns)}
          density="compact"
          hideFooter
          disableRowSelectionOnClick
          disableColumnMenu
          loading={isLoading}
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
            toolbar: () => (
              <QuickSearchToolbar
                newBtnText={"Add new schedule"}
                columns={columns}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                menuItem={{ field: "searchColumn", headerName: "Search By" }}
              />
            ),
          }}
        />
      </Container>
      <ChequeDepositedPopUp
        open={openDialog}
        onClose={handleCloseDialog}
        onAction={handleAction}
      />
    </FsBox>
  );
};
export default PaymentSummary;
