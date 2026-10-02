"use client";

import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import { setRepresentativeRoutesMsg } from "@/redux/slices/mappers/representative-route";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  assignRepresentativeRouteMapping,
  unassignRepresentativeRouteMapping,
} from "@/service/mapping-service/representativeRoute.service";
import { getAllActiveRoutes } from "@/service/route.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  dataGridStyleMappers,
  tabViewTable,
} from "@/styles/tableStyles/tableStyle";
import { handleBreadcrumbNavigation } from "@/utils/breadcrumbNavigation";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import QuickSearchToolbar from "../product/components/search-filter";
import { RoutesMapperTableHeadingsAssign } from "./components/table-component-representativeMapper-route";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const RouteMapper = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const routeList = useSelector((state) => state.routeSlice.routes);
  const routeRepMsg = useSelector(
    (state) => state.routesRepresentativeSlice.representativeRoutesMsg
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setRouteSearchQuery("");
    setRouteSelectedStatus({});
    setRouteUnassignedSearchQuery("");
    setRouteUnassignedSelectedStatus({});
  };
  const [value, setValue] = useState("1");
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assignSelectionRows, setAssignSelectionRows] = useState<any[]>([]);
  const [unassignSelectionRows, setUnassignSelectionRows] = useState<any[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedRowsString = urlParams.get("selectedRows");
    if (selectedRowsString) {
      setSelectedRows(JSON.parse(decodeURIComponent(selectedRowsString)));
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (routeRepMsg) {
      enqueueSnackbar(routeRepMsg, { variant: "success" });
      dispatch(setRepresentativeRoutesMsg(null));
    }
  }, [routeRepMsg]);

  useEffect(() => {
    if (value) {
      setAssignSelectionRows([]);
      setUnassignSelectionRows([]);
    }
  }, [value]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await getAllActiveRoutes();
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const createRouteRepresentativeMapping = async () => {
    const data = {
      representativeUIds: selectedRows,
      routeUIds: assignSelectionRows,
    };

    try {
      await assignRepresentativeRouteMapping(data);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
    }
  };

  const updateRouteRepresentativeMapping = async () => {
    const data = {
      representativeUIds: selectedRows,
      routeUIds: unassignSelectionRows,
    };
    try {
      await unassignRepresentativeRouteMapping(data);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
    }
  };

  const handleAssignClick = async () => {
    await createRouteRepresentativeMapping();
  };

  const handleUnassignClick = async () => {
    await updateRouteRepresentativeMapping();
  };

  const {
    searchQuery: routeSearchQuery,
    setSearchQuery: setRouteSearchQuery,
    selectedStatus: routeSelectedStatus,
    setSelectedStatus: setRouteSelectedStatus,
    searchedRows: filteredRouteRows,
  } = useColumnFilter<(typeof routeList)[number]>(
    routeList,
    RoutesMapperTableHeadingsAssign,
    value
  );

  const {
    searchQuery: routeUnassignedSearchQuery,
    setSearchQuery: setRouteUnassignedSearchQuery,
    selectedStatus: routeUnassignedSelectedStatus,
    setSelectedStatus: setRouteUnassignedSelectedStatus,
    searchedRows: filteredRouteUnassignedRows,
  } = useColumnFilter<(typeof routeList)[number]>(
    routeList,
    RoutesMapperTableHeadingsAssign,
    value
  );

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Representative - Route Mapping"
        pageNavigation={[
          {
            pageName: "Representative Mapping",
            path: PATH_DASHBOARD.representativeMapper.list,
          },
          { pageName: "List" },
        ]}
        onFullScreenClick={handleFullScreenClick}
        onLinkClick={(path: any) => handleBreadcrumbNavigation(path, router)}
      />
      <Container>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <TabList onChange={handleTabChange}>
              <Tab label="Assign" value="1" icon={<CheckIcon />} />
              <Tab label="Unassign" value="2" icon={<CloseIcon />} />
            </TabList>

            {/* ASSIGN TAB PANEL */}
            <TabPanel value="1" sx={tabViewTable}>
              <DataGrid
                sx={{ ...dataGridStyleMappers }}
                getRowId={(row) => row.uId}
                columns={RoutesMapperTableHeadingsAssign}
                rows={filteredRouteRows}
                rowCount={filteredRouteRows.length}
                loading={loading}
                checkboxSelection
                density="compact"
                rowSelectionModel={assignSelectionRows}
                onRowSelectionModelChange={(newSelection) => {
                  setAssignSelectionRows((prev) => {
                    const visibleIds = filteredRouteRows.map((row) => row.uId);
                    const filteredOut = prev.filter(
                      (id) => !visibleIds.includes(id)
                    );
                    return [...filteredOut, ...newSelection];
                  });
                }}
                slots={{
                  noRowsOverlay: CustomNoRowsOverlay,
                  toolbar: () => (
                    <QuickSearchToolbar
                      handleSaveClick={handleAssignClick}
                      isDisabled={assignSelectionRows.length === 0}
                      columns={RoutesMapperTableHeadingsAssign.filter(
                        (col) => col.field !== "__check__"
                      )}
                      searchQuery={routeSearchQuery}
                      setSearchQuery={setRouteSearchQuery}
                      selectedStatus={routeSelectedStatus}
                      setSelectedStatus={setRouteSelectedStatus}
                      menuItem={{
                        field: "searchColumn",
                        headerName: "Search By",
                      }}
                    />
                  ),
                }}
              />
            </TabPanel>
            {/* UNASSIGN TAB PANEL */}
            <TabPanel value="2" sx={tabViewTable}>
              <DataGrid
                sx={{ ...dataGridStyleMappers }}
                getRowId={(row) => row.uId}
                columns={RoutesMapperTableHeadingsAssign}
                rows={filteredRouteUnassignedRows}
                rowCount={filteredRouteUnassignedRows.length}
                loading={loading}
                checkboxSelection
                density="compact"
                rowSelectionModel={unassignSelectionRows}
                onRowSelectionModelChange={(newSelection) => {
                  setUnassignSelectionRows((prev) => {
                    const visibleIds = filteredRouteUnassignedRows.map(
                      (row) => row.uId
                    );
                    const filteredOut = prev.filter(
                      (id) => !visibleIds.includes(id)
                    );
                    return [...filteredOut, ...newSelection];
                  });
                }}
                slots={{
                  noRowsOverlay: CustomNoRowsOverlay,
                  toolbar: () => (
                    <QuickSearchToolbar
                      handleSaveClick={handleUnassignClick}
                      isDisabled={unassignSelectionRows.length === 0}
                      columns={RoutesMapperTableHeadingsAssign.filter(
                        (col) => col.field !== "__check__"
                      )}
                      searchQuery={routeUnassignedSearchQuery}
                      setSearchQuery={setRouteUnassignedSearchQuery}
                      selectedStatus={routeUnassignedSelectedStatus}
                      setSelectedStatus={setRouteUnassignedSelectedStatus}
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
        </Box>
      </Container>
    </FsBox>
  );
};

export default RouteMapper;
