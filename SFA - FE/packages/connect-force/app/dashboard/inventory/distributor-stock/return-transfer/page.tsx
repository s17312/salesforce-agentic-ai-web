"use client";

import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import PopupResponse from "@/components/popup/popup-response";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import InventoryIcon from "@mui/icons-material/Inventory";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { StockReturnTransferColumns } from "./components/columnHeaders";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import ConfirmDeleteDialog from "@/components/popup/ConfirmDeleteDialog";
import { enqueueSnackbar } from "notistack";
import {
  deleteDistributorStockReturnTransfer,
  getAllDistributorStockReturnTransfer,
} from "@/service/inventory/distributor-stock-return-transfer.service";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const DistributorStockReturnTransfer = () => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const [serverDownError, setServerDownError] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const stockReturnTransferList = useSelector(
    (state) => state.distributorStockReturnTransferSlice.DS_ReturnTransfers
  );

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const fetchGetAllDistributorStockReturnTransfer = async () => {
    try {
      await getAllDistributorStockReturnTransfer();
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  useEffect(() => {
    getAllDistributorStockReturnTransfer();
  }, []);

  const confirmDelete = async () => {
    if (deleteId !== null) {
      try {
        await deleteDistributorStockReturnTransfer(deleteId);
        enqueueSnackbar("Distributor Stock Return successfully deleted", {
          variant: "success",
        });
        fetchGetAllDistributorStockReturnTransfer();
      } catch (error) {
        console.error(
          "Error while deleting distributor stock Return Transfer",
          error
        );
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

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  const handleNewClick = () => {
    router.push(PATH_DASHBOARD.distributorStock.stockReturnTransfer.add);
  };

  const columns = StockReturnTransferColumns({ handleDelete });
  const {
    searchedRows,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
  } = useColumnFilter(stockReturnTransferList, columns);

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Distributor Stock Return Transfer"
        pageNavigation={[
          {
            pageName: "Distributor Stock Return Transfer",
          },
          { pageName: "List" },
        ]}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
        icon={<InventoryIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        <DataGrid
          getRowId={(row) => row.stockReturnHeaderId}
          sx={{ ...dataGridStyle }}
          columns={getColumnsWithTooltip(
            StockReturnTransferColumns({ handleDelete })
          )}
          rows={searchedRows}
          density="compact"
          disableRowSelectionOnClick
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
            toolbar: () => (
              <QuickSearchToolbar
                handleNewClick={handleNewClick}
                columns={StockReturnTransferColumns({ handleDelete }).filter(
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
      {popupResponse && serverDownError && (
        <PopupResponse
          type={"error"}
          message={"Internal server error"}
          redirectBack={redirectBack}
        />
      )}
    </FsBox>
  );
};

export default DistributorStockReturnTransfer;
