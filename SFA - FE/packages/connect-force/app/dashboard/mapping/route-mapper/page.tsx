"use client";

import React, { useEffect, useRef, useState } from "react";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { DataGrid } from "@mui/x-data-grid";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { dispatch, useSelector } from "@/redux/store";
import {
  RouteMapperTableHeadings,
  tableOptions,
} from "./components/table-component-routeMapper";
import PopupResponse from "@/components/popup/popup-response";
import { PATH_DASHBOARD } from "@/routes/paths";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { getAllRoutesForMapping } from "@/service/route.service";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";
import GoogleIcon from "@/components/icons/GoogleIcon";

const RouteMapper = () => {
  const router = useRouter();
  const routeList = useSelector((state) => state.routeSlice.routes);
  const ref = useRef<HTMLDivElement>(null);
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const [loading, setLoading] = useState(false);
  const [serverDownError, setServerDownError] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const {
    searchedRows,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
  } = useColumnFilter(routeList, RouteMapperTableHeadings);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        await getAllRoutesForMapping();
      } catch (error) {
        dispatch(setPopupResponse(true));
        setServerDownError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Route Mapping"
        pageNavigation={[{ pageName: "Route Mapping" }, { pageName: "List" }]}
        icon={<GoogleIcon name="alt_route" size={24} />}
        onLinkClick={handleBreadcrumbNavigation}
        onFullScreenClick={handleFullScreenClick}
      />

      <Container>
        <TableContainer>
          <DataGrid
            sx={{ ...dataGridStyle }}
            getRowId={(row) => row.uId}
            rows={searchedRows}
            loading={loading}
            columns={getColumnsWithTooltip(RouteMapperTableHeadings)}
            rowCount={searchedRows.length}
            pageSizeOptions={tableOptions.rowsPerPageOptions}
            disableRowSelectionOnClick
            density="compact"
            slots={{
              noRowsOverlay: CustomNoRowsOverlay,
              toolbar: () => (
                <QuickSearchToolbar
                  columns={RouteMapperTableHeadings.filter(
                    (col) =>
                      col.field !== "hasOutlets" &&
                      col.field !== "hasReps" &&
                      col.field !== "actions"
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

export default RouteMapper;
