"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material";
import { Business as BusinessIcon } from "@mui/icons-material";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  deleteDistributorStockAdjustment,
  getAllDistributorStockAdjustment,
} from "@/service/inventory/distributor-stock-adjustment.service";
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

const DSAdjustmentViewAll = () => {
  const router = useRouter();
  const theme = useTheme();
  const stockAdjustmentsList = useSelector(
    (state) => state.distributorStockAdjustmentSlice.DS_Adjustments
  );
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  const fetchGetAllDistributorStockAdjustment = async () => {
    //API call to get all distributor stock adjustment
    await getAllDistributorStockAdjustment();
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleNewClick = () => {
    router.push(PATH_DASHBOARD.distributorStock.adjustment);
  };

  const confirmDelete = async () => {
    if (deleteId !== null) {
      try {
        await deleteDistributorStockAdjustment(deleteId);
        enqueueSnackbar("Distributor stock adjustment deleted successfully", {
          variant: "success",
        });
        fetchGetAllDistributorStockAdjustment(); // Recall fetch function after successful deletion
      } catch (error) {
        console.error(
          "Error while deleting distributor stock adjustment",
          error
        );
      } finally {
        setOpen(false);
        setDeleteId(null);
      }
    }
  };

  useEffect(() => {
    getAllDistributorStockAdjustment();
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
    () => AdjustViewColumns({ handleDelete, theme }),
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
        pageTitle="Distributor Stock Adjustment List"
        pageNavigation={[
          {
            pageName: "Distributor Stock Adjustment",
          },
          { pageName: "View" },
        ]}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
        icon={<BusinessIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        <DataGrid
          sx={{ ...dataGridStyle }}
          getRowId={(row) => row.stockAdjustmentHeaderId}
          rows={searchedRows}
          columns={getColumnsWithTooltip(
            AdjustViewColumns({ handleDelete, theme })
          )}
          density="standard"
          disableRowSelectionOnClick
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
            toolbar: () => (
              <QuickSearchToolbar
                handleNewClick={handleNewClick}
                columns={AdjustViewColumns({ handleDelete, theme }).filter(
                  (col) => col.field !== "statusName" && col.field !== "action"
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
      </Container>
      <ConfirmDeleteDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={confirmDelete}
      />
    </FsBox>
  );
};

export default DSAdjustmentViewAll;
