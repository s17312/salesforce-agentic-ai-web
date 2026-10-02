"use client";

import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllGRNs } from "@/service/inventory/grn.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  dataGridStyle,
  tableIconColors,
} from "@/styles/tableStyles/tableStyle";
import { tooltipSlotProps } from "@/styles/tooltip/tooltipSlotProps";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import ListIcon from "@mui/icons-material/List";
import { Chip, IconButton, Tooltip, useTheme } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PO_StatusChip } from "../../purchase-order/view/components/statusChip";
import { formatCurrency, formatVolume3Decimals } from "@/utils/formatCurrency";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const GrnViewAll = () => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const grnList = useSelector((state) => state.purchaseOrderSlice.GRNs);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  // GET getAllGRNs
  const fetchGetAllGRNs = async () => {
    await getAllGRNs();
  };

  useEffect(() => {
    fetchGetAllGRNs();
  }, []);

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "distributorID",
      headerName: "Distributor Code",
      flex: 1,
      sortable: false,
    },
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
      field: "approveRemark",
      headerName: "Remark",
      flex: 1,
      sortable: false,
      renderCell(params) {
        if (!params.value) {
          return null;
        }
        return (
          <Tooltip title={params.value} slotProps={tooltipSlotProps}>
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
        const { statusId, uId } = params.row;
        return (
          <>
            <Link href={`${PATH_DASHBOARD.purchaseOrder.grn.view}/${uId}`}>
              <IconButton size="small">
                <VisibilityIcon
                  fontSize="small"
                  sx={{ color: tableIconColors.visibilityIcon }}
                />
              </IconButton>
            </Link>
            {statusId !== 8 && statusId !== 9 && (
              <>
                <Link href={`${PATH_DASHBOARD.purchaseOrder.grn.edit}/${uId}`}>
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
  } = useColumnFilter(grnList, columns);

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Goods Received Note"
        pageNavigation={[
          {
            pageName: "Goods Received Note",
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

export default GrnViewAll;
