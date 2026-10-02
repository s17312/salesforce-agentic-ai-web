"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material";
import { Business as BusinessIcon } from "@mui/icons-material";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  deleteCompanyStockAdjustment,
  getAllCompanyStockAdjustment,
} from "@/service/inventory/company-stock-adjustment.service";
import { useSelector } from "@/redux/store";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { DataGrid } from "@mui/x-data-grid";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { enqueueSnackbar } from "notistack";
import ConfirmDeleteDialog from "@/components/popup/ConfirmDeleteDialog";
import { AdjustViewColumns } from "./components/columnHeaders";
import { PATH_DASHBOARD } from "@/routes/paths";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";
import { formatCurrency, formatVolume3Decimals } from "@/utils/formatCurrency";

const CSAdjustmentViewAll = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const stockAdjustmentsList = useSelector(
    (state) => state.companyStockAdjustmentSlice.CS_Adjustments
  );
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const fetchGetAllCompanyStockAdjustment = async () => {
    //API call to get all company stock adjustment
    await getAllCompanyStockAdjustment();
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleNewClick = () => {
    router.push(PATH_DASHBOARD.companyStock.adjustment);
  };

  const confirmDelete = async () => {
    if (deleteId !== null) {
      try {
        await deleteCompanyStockAdjustment(deleteId);
        enqueueSnackbar("Company stock adjustment deleted successfully", {
          variant: "success",
        });
        fetchGetAllCompanyStockAdjustment(); // Recall fetch function after successful deletion
      } catch (error) {
        console.error("Error while deleting company stock adjustment", error);
      } finally {
        setOpen(false);
        setDeleteId(null);
      }
    }
  };

  useEffect(() => {
    fetchGetAllCompanyStockAdjustment();
  }, []);

  const enrichedRows = useMemo(
    () =>
      stockAdjustmentsList.map((row) => ({
        ...row,
        totalQuantity: `+${row.totalPlusQuantity} ${row.totalMinusQuantity}`,
        totalVolume: `+${Number(row.totalPlusVolume ?? 0).toFixed(3)} ${Number(
          row.totalMinusVolume ?? 0
        ).toFixed(3)}`,
        totalValue: `+${Number(row.totalPlusValue ?? 0).toFixed(2)} ${Number(
          row.totalMinusValue ?? 0
        ).toFixed(2)}`,
      })),
    [stockAdjustmentsList]
  );

  const columns = useMemo(
    () => getColumnsWithTooltip(AdjustViewColumns({ handleDelete, theme })),
    [handleDelete, theme]
  );

  const {
    searchedRows,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
  } = useColumnFilter(enrichedRows, columns);

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Company Stock Adjustment View"
        pageNavigation={[
          {
            pageName: "Company Stock",
          },
          { pageName: "View" },
        ]}
        onFullScreenClick={handleFullScreenClick}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        icon={<BusinessIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        <TableContainer>
          <DataGrid
            sx={{ ...dataGridStyle }}
            getRowId={(row) => row.stockAdjustmentHeaderId}
            rows={searchedRows}
            columns={columns}
            density="standard"
            disableRowSelectionOnClick
            slots={{
              noRowsOverlay: CustomNoRowsOverlay,
              toolbar: () => (
                <QuickSearchToolbar
                  handleNewClick={handleNewClick}
                  columns={columns.filter(
                    (col) =>
                      col.field !== "statusName" && col.field !== "action"
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
          />
        </TableContainer>
      </Container>
      <ConfirmDeleteDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={confirmDelete}
      />
    </FsBox>
  );
};

export default CSAdjustmentViewAll;
