"use client";

import React, { useEffect, useRef, useState } from "react";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import StoreRoundedIcon from "@mui/icons-material/StoreRounded";
import PersonPinCircleRoundedIcon from "@mui/icons-material/PersonPinCircleRounded";
import {
  dataGridStyleMappers,
  tabViewTable,
} from "@/styles/tableStyles/tableStyle";
import { DataGrid } from "@mui/x-data-grid";
import { dispatch, useSelector } from "@/redux/store";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { getAllOutletsByRouteIdIsTrue } from "@/service/mapping-service/routeOutlet.service";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import PopupResponse from "@/components/popup/popup-response";
import { getAllRepresentativesByRouteIdTrue } from "@/service/mapping-service/representativeRoute.service";
import {
  RepresentativeMapperViewTableHeadingsAssign,
  tableOptions,
} from "./components/table-component-representativeMapper-view";
import { OutletMapperViewTableHeadingsAssign } from "./components/table-component-outletMapper-view";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const ViewAllRouteMapping = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const outletList = useSelector(
    (state) => state.routeOutletsSlice.routeOutletsIsTrue
  );
  const representativeList = useSelector(
    (state) => state.routesRepresentativeSlice.representativeRoutesIsTrue
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const [value, setValue] = useState("1");
  const [serverDownError, setServerDownError] = useState(false);
  const [pageTitle, setPageTitle] = useState("Route - Outlet View");
  const [loading, setLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  const titles = {
    "1": "Route - Outlet View",
    "2": "Route - Sales Representative View",
  };

  const {
    searchQuery: outletSearchQuery,
    setSearchQuery: setOutletSearchQuery,
    selectedStatus: outletSelectedStatus,
    setSelectedStatus: setOutletSelectedStatus,
    searchedRows: searchedOutletRows,
  } = useColumnFilter<(typeof outletList)[number]>(
    outletList,
    OutletMapperViewTableHeadingsAssign,
    value
  );

  const {
    searchQuery: representativeSearchQuery,
    setSearchQuery: setRepresentativeSearchQuery,
    selectedStatus: representativeSelectedStatus,
    setSelectedStatus: setRepresentativeSelectedStatus,
    searchedRows: searchedRepresentativeRows,
  } = useColumnFilter<(typeof representativeList)[number]>(
    representativeList,
    RepresentativeMapperViewTableHeadingsAssign,
    value
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      if (value === "1") {
        await getAllOutletsByRouteIdIsTrue(params.id);
      }
      if (value === "2") {
        await getAllRepresentativesByRouteIdTrue(params.id);
      }
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, value]);

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setPageTitle(titles[newValue as keyof typeof titles]);
    setRepresentativeSearchQuery("");
    setRepresentativeSelectedStatus({});
    setOutletSearchQuery("");
    setOutletSelectedStatus({});
  };

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={pageTitle}
        pageNavigation={[
          {
            pageName: "Route Mapping",
            path: PATH_DASHBOARD.routeMapper.list,
          },
          { pageName: "View" },
        ]}
        onLinkClick={handleBreadcrumbNavigation}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <Box sx={{ width: "100%", typography: "body1" }}></Box>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="Product Mapper Tabs">
              <Tab label="Outlet" value="1" icon={<StoreRoundedIcon />} />
              <Tab
                label="Sales Representative"
                value="2"
                icon={<PersonPinCircleRoundedIcon />}
              />
            </TabList>
          </Box>
          {/****************  Table Panel 1 *****************/}
          <TabPanel value="1" sx={tabViewTable}>
            <DataGrid
              sx={{ ...dataGridStyleMappers }}
              getRowId={(row) => row.outletUId}
              rows={searchedOutletRows}
              loading={loading}
              columns={getColumnsWithTooltip(
                OutletMapperViewTableHeadingsAssign
              )}
              rowCount={searchedOutletRows.length}
              pageSizeOptions={tableOptions.rowsPerPageOptions}
              disableRowSelectionOnClick
              density="compact"
              slots={{
                noRowsOverlay: CustomNoRowsOverlay,
                toolbar: () => (
                  <QuickSearchToolbar
                    columns={OutletMapperViewTableHeadingsAssign}
                    searchQuery={outletSearchQuery}
                    setSearchQuery={setOutletSearchQuery}
                    selectedStatus={outletSelectedStatus}
                    setSelectedStatus={setOutletSelectedStatus}
                    menuItem={{
                      field: "searchColumn",
                      headerName: "Search By",
                    }}
                  />
                ),
              }}
            />
          </TabPanel>
          {/****************  Table Panel 2 *****************/}
          <TabPanel value="2" sx={tabViewTable}>
            <DataGrid
              sx={{ ...dataGridStyleMappers }}
              getRowId={(row) => row.representativeUId}
              rows={searchedRepresentativeRows}
              loading={loading}
              columns={getColumnsWithTooltip(
                RepresentativeMapperViewTableHeadingsAssign
              )}
              rowCount={searchedRepresentativeRows.length}
              pageSizeOptions={tableOptions.rowsPerPageOptions}
              disableRowSelectionOnClick
              density="compact"
              slots={{
                noRowsOverlay: CustomNoRowsOverlay,
                toolbar: () => (
                  <QuickSearchToolbar
                    columns={RepresentativeMapperViewTableHeadingsAssign}
                    searchQuery={representativeSearchQuery}
                    setSearchQuery={setRepresentativeSearchQuery}
                    selectedStatus={representativeSelectedStatus}
                    setSelectedStatus={setRepresentativeSelectedStatus}
                    menuItem={{
                      field: "searchColumn",
                      headerName: "Search By",
                    }}
                  />
                ),
              }}
            />
          </TabPanel>
        </TabContext>
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

export default ViewAllRouteMapping;
