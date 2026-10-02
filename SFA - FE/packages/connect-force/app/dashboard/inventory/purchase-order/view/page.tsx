"use client";

import React, { use, useEffect, useRef, useState } from "react";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import ListIcon from "@mui/icons-material/List";
import { Chip, IconButton, Tooltip, useTheme } from "@mui/material";
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
import {
  deletePurchaseOrder,
  getAllPurchaseOrderCreation,
} from "@/service/inventory/purchaseOrder.service";
import { useSelector } from "@/redux/store";
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
import { formatCurrency, formatVolume3Decimals } from "@/utils/formatCurrency";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const PurchaseOrdersView = () => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const po_list = useSelector(
    (state) => state.purchaseOrderSlice.PO_PurchaseOrders
  );
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  // GET getAllPurchaseOrderCreation
  const fetchGetAllPOs = async () => {
    await getAllPurchaseOrderCreation();
  };

  useEffect(() => {
    fetchGetAllPOs();
  }, []);

  const confirmDelete = async () => {
    if (deleteId !== null) {
      try {
        await deletePurchaseOrder(deleteId);
        enqueueSnackbar("Company stock adjustment deleted successfully", {
          variant: "success",
        });
        fetchGetAllPOs(); // Recall fetch function after successful deletion
      } catch (error) {
        console.error("Error while deleting company stock adjustment", error);
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
    router.push(PATH_DASHBOARD.purchaseOrder.creation.add);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "distributorName",
      headerName: "Distributor",
      minWidth: 150,
      maxWidth: 200,
      flex: 1,
      sortable: false,
    },
    { field: "poNo", headerName: "PO", flex: 1, sortable: false },
    {
      field: "poDate",
      headerName: "Created Date",
      minWidth: 100,
      flex: 1,
      sortable: false,
      renderCell: (params) => <>{dayjs(params.value).format("YYYY-MM-DD")}</>,
    },
    {
      field: "deliveryDate",
      headerName: "Delivery Date",
      minWidth: 100,
      flex: 1,
      sortable: false,
      renderCell: (params) => <>{dayjs(params.value).format("YYYY-MM-DD")}</>,
    },
    // {
    //   field: "deliveryMethodName",
    //   headerName: "Delivery Method",
    //   flex: 1,
    //   sortable: false,
    // },
    {
      field: "totalQuantity",
      headerName: "Quantity",
      flex: 1,
      sortable: false,
    },
    {
      field: "totalVolume",
      headerName: "Volume",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <>{formatVolume3Decimals(params.row.totalVolume)}</>
      ),
    },
    {
      field: "totalValue",
      headerName: "Value",
      flex: 1,
      sortable: false,
      renderCell: (params) => <>{formatCurrency(params.row.totalValue)}</>,
    },
    {
      field: "remark",
      headerName: "Remark",
      flex: 1,
      sortable: false,
      renderCell(params) {
        if (!params.value) {
          return null;
        }
        return (
          <Tooltip
            title={params.value}
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -14],
                    },
                  },
                ],
              },
            }}
          >
            <Chip label={params.value} size="small" variant="outlined" />
          </Tooltip>
        );
      },
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
        const { statusId, uId } = params.row;
        return (
          <>
            <Link href={`${PATH_DASHBOARD.purchaseOrder.creation.view}/${uId}`}>
              <IconButton size="small">
                <VisibilityIcon
                  fontSize="small"
                  sx={{ color: tableIconColors.visibilityIcon }}
                />
              </IconButton>
            </Link>
            {/* </Link> */}
            {statusId !== 2 && statusId !== 3 && (
              <>
                <Link
                  href={`${PATH_DASHBOARD.purchaseOrder.creation.edit}/${uId}`}
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
                  onClick={() => handleDelete(params.row.uId)}
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
  } = useColumnFilter(po_list, columns);

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Purchase Orders"
        pageNavigation={[
          {
            pageName: "Purchase Orders",
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
          getRowId={(row) => row.uId}
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
