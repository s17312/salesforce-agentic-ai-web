"use client";

import React, { useEffect, useRef, useState } from "react";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import ListIcon from "@mui/icons-material/List";
import { IconButton, useTheme } from "@mui/material";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import ConfirmDeleteDialog from "@/components/popup/ConfirmDeleteDialog";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  dataGridStyle,
  tableIconColors,
} from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { PATH_DASHBOARD } from "@/routes/paths";
import { dispatch, useSelector } from "@/redux/store";
import dayjs from "dayjs";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { PO_StatusChip } from "./components/statusChip";
import { enqueueSnackbar } from "notistack";
import Link from "next/link";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { formatCurrency } from "@/utils/formatCurrency";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";
import { deleteDistrubutorGRN, getAllGrnDistributorDirect } from "@/service/inventory/new-distributor-grn.service";
import { setPopupResponse } from "@/redux/slices/layout-slice";

const PurchaseOrdersView = () => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const distributorGRNList = useSelector((state) => state.newDistributorGrnSlice.newDistributorGRNDetails);
  const page = useSelector((state) => state.newDistributorGrnSlice.newPage);
  const rowCount = useSelector((state) => state.newDistributorGrnSlice.newRowsPerPage);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [serverDownError, setServerDownError] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  const fetchData = async () => {
    try {
      await getAllGrnDistributorDirect(
        page,
        rowCount,
        undefined,
        "grnDirectHeaderId",
        "desc"
      );
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, rowCount]);

  const confirmDelete = async () => {
    if (deleteId !== null) {
      try {
        await deleteDistrubutorGRN(deleteId);
        enqueueSnackbar("Distributor GRN deleted successfully", {
          variant: "success",
        });
        fetchData(); // Recall fetch function after successful deletion
      } catch (error) {
        console.error("Error while deleting Distributor GRN", error);
      } finally {
        setOpen(false);
        setDeleteId(null);
      }
    }
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleNewClick = () => {
    router.push(PATH_DASHBOARD.newDistributorGrn.add);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "GRN Date",
      flex: 1,
      sortable: true,
      renderCell: (params) => <>{dayjs(params.value).format("YYYY-MM-DD")}</>,
    },
    {
      field: "grnNo",
      headerName: "GRN No",
      flex: 1,
      sortable: true,
    },
    {
      field: "invoiceNo",
      headerName: "Invoice Number",
      flex: 1,
      sortable: true,
    },
    {
      field: "distributorName",
      headerName: "Distributor",
      flex: 1,
      sortable: false,
    },
    {
      field: "grnTypeName",
      headerName: "GRN Type",
      flex: 1,
      sortable: false,
    },
    {
      field: "chequeDate",
      headerName: "Cheque Date",
      minWidth: 100,
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => <>{params.value ? dayjs(params.value).format("YYYY-MM-DD") : '-'}</>,
    },
    {
      field: "chequeNumber",
      headerName: "Cheque No",
      flex: 1,
      sortable: false,
    },
    {
      field: "totalValue",
      headerName: "Value",
      flex: 1,
      sortable: false,
      headerAlign: "right",
      align: "right",
      renderCell: (params) => <>{formatCurrency(params.row.totalValue)}</>,
    },
    {
      field: "totalDiscountAmount",
      headerName: "Discount Value ",
      flex: 1,
      sortable: false,
      headerAlign: "right",
      align: "right",
      renderCell: (params) => <>{formatCurrency(params.row.totalDiscountAmount)}</>,
    },
    {
      field: "statusId",
      headerName: "Status",
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <PO_StatusChip status={params.value} />,
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      headerAlign: "center",
      align: "left",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const { statusId, grnDirectHeaderId } = params.row;
        return (
          <>
            <Link href={`${PATH_DASHBOARD.newDistributorGrn.list}/${grnDirectHeaderId}`}>
              <IconButton size="small">
                <VisibilityIcon
                  fontSize="small"
                  sx={{ color: tableIconColors.visibilityIcon }}
                />
              </IconButton>
            </Link>
            {/* </Link> */}
            {statusId == 1 && (
              <>
                <Link
                  href={`${PATH_DASHBOARD.newDistributorGrn.edit}/${grnDirectHeaderId}`}
                >
                  <IconButton size="small">
                    <EditIcon
                      fontSize="small"
                      sx={{ color: tableIconColors.editIconColor }}
                    />
                  </IconButton>
                </Link>

                <IconButton
                  size="small"
                  onClick={() => handleDelete(params.row.grnDirectHeaderId)}
                >
                  <DeleteIcon
                    fontSize="small"
                    sx={{ color: tableIconColors.deleteIcon }}
                  />
                </IconButton>
              </>
            )}
          </>
        );
      },
    },
  ];

  const {
    searchedRows,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
  } = useColumnFilter(distributorGRNList, columns);

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Distributor GRN"
        pageNavigation={[
          {
            pageName: "Distributor GRN",
          },
          { pageName: "List" },
        ]}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
        icon={<ListIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        <DataGrid
          sx={{ ...dataGridStyle }}
          getRowId={(row) => row.grnDirectHeaderId}
          // @ts-ignore
          rows={searchedRows}
          columns={getColumnsWithTooltip(columns)}
          density="compact"
          disableRowSelectionOnClick
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
            toolbar: () => (
              <QuickSearchToolbar
                handleNewClick={handleNewClick}
                columns={columns.filter(
                  (col) => col.field !== "statusId" && col.field !== "action"
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
          disableColumnMenu
        />
        <ConfirmDeleteDialog
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={confirmDelete}
        />
      </Container>
    </FsBox>
  );
};

export default PurchaseOrdersView;
