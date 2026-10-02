"use client";

import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { useTheme } from "@mui/material";
import { Business as BusinessIcon } from "@mui/icons-material";
import { getAllWarehouseStockTransfer } from "@/service/warehouseStockTransfer.service";
import { AdjustViewColumns } from "./components/view/columnHeaders";
import PopupResponse from "@/components/popup/popup-response";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const WarehouseStockTransferPage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const theme = useTheme();
  const warehouseStockTransferList = useSelector(
    (state) => state.warehouseStockTransferSlice.WST_Details
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const [serverDownError, setServerDownError] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const {
    searchedRows,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
  } = useColumnFilter(warehouseStockTransferList, AdjustViewColumns());

  const handleNewClick = () => {
    router.push(
      PATH_DASHBOARD.distributorStock.distributorWarehouseStockTransfer.add
    );
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const fetchGetAllWarehouseStockTransfer = async () => {
    try {
      await getAllWarehouseStockTransfer();
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  useEffect(() => {
    fetchGetAllWarehouseStockTransfer();
  }, []);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Distributor Warehouse Stock Transfer List"
        pageNavigation={[
          {
            pageName: "Distributor Warehouse Stock Transfer",
            path: PATH_DASHBOARD.distributorStock
              .distributorWarehouseStockTransfer.list,
          },
          { pageName: "List" },
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
          getRowId={(row) => row.uId}
          rows={searchedRows}
          columns={getColumnsWithTooltip(AdjustViewColumns())}
          density="compact"
          disableRowSelectionOnClick
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
            toolbar: () => (
              <QuickSearchToolbar
                handleNewClick={handleNewClick}
                columns={AdjustViewColumns().filter(
                  (col) => col.field !== "status" && col.field !== "action"
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

export default WarehouseStockTransferPage;
