"use client";

import React, { useEffect, useRef, useState } from "react";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import ListIcon from "@mui/icons-material/List";
import { Chip, IconButton, Tooltip, useTheme } from "@mui/material";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  dataGridStyle,
  tableIconColors,
} from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllPurchaseOrderApprove } from "@/service/inventory/purchaseOrder.service";
import { useSelector } from "@/redux/store";
import dayjs from "dayjs";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { PO_StatusChip } from "../../purchase-order/view/components/statusChip";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { formatCurrency, formatVolume3Decimals } from "@/utils/formatCurrency";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const PurchaceOrderApproveListAll = () => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const po_listApprove = useSelector(
    (state) => state.purchaseOrderSlice.PO_PurchaseOrderApprove
  );
  const [isFullScreen, setIsFullScreen] = useState(false);

  // GET getAllPurchaseOrderApprove
  const fetchGetAllApprovePOs = async () => {
    await getAllPurchaseOrderApprove();
  };

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    fetchGetAllApprovePOs();
  }, []);

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const columns: GridColDef[] = [
    { field: "poNo", headerName: "PO", flex: 1, sortable: false },
    {
      field: "distributorName",
      headerName: "Distributor",
      minWidth: 150,
      maxWidth: 200,
      flex: 1,
      sortable: false,
    },
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
      renderCell: (params) => <>{formatVolume3Decimals(params.value)}</>,
    },
    {
      field: "totalValue",
      headerName: "Value",
      flex: 1,
      sortable: false,
      renderCell: (params) => <>{formatCurrency(params.value)}</>,
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
      headerAlign: "left",
      align: "left",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const { statusId, uId, warehouseId, priceListTypeUId } = params.row;
        return (
          <>
            <Link
              href={`${PATH_DASHBOARD.purchaseOrder.approve.view}/${uId}?warehouseId=${warehouseId}&priceListTypeUId=${priceListTypeUId}`}
            >
              <IconButton size="small">
                <VisibilityIcon
                  fontSize="small"
                  sx={{ color: tableIconColors.visibilityIcon }}
                />
              </IconButton>
            </Link>
            {/* </Link> */}
            {statusId !== 5 && statusId !== 6 && (
              <>
                <Link
                  href={`${PATH_DASHBOARD.purchaseOrder.approve.edit}/${uId}`}
                >
                  <IconButton size="small">
                    <EditIcon
                      fontSize="small"
                      sx={{ color: tableIconColors.editIconColor }}
                    />
                  </IconButton>
                </Link>
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
  } = useColumnFilter(po_listApprove, columns);

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Purchase Orders Approval"
        pageNavigation={[
          {
            pageName: "Purchase Orders Approval",
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
      </Container>
    </FsBox>
  );
};

export default PurchaceOrderApproveListAll;
