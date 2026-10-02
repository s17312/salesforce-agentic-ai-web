"use client";

import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import PopupResponse from "@/components/popup/popup-response";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  dataGridStyleMappers,
  tabViewTable,
} from "@/styles/tableStyles/tableStyle";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { tableOptions } from "../../components/table-component-distributorMapper";
import {
  setAssignRoute,
  setDistributorRouteMsg,
} from "@/redux/slices/mappers/distributor-route-slice";
import { enqueueSnackbar } from "notistack";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import {
  distributorRouteBulkUpdate,
  getAllRoutesByDistributorId,
} from "@/service/mapping-service/distributorRoute.service";
import { RoutesMapperTableHeadingsAssign } from "./table-component-routeMapper-assign";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const RouteDistributorMapper = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const routeList = useSelector(
    (state) => state.distributorRouteSlice.distributorRoutes
  );
  const assignRoutes = useSelector(
    (state) => state.distributorRouteSlice.assignRoute
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const distributorRouteMsg = useSelector(
    (state) => state.distributorRouteSlice.distributorRouteMsg
  );
  const [value, setValue] = useState("1");
  const [loading, setLoading] = useState(false);
  const [serverDownError, setServerDownError] = useState(false);
  const [assignSelectedRows, setAssignSelectedRows] = useState<any[]>([]);
  const [assignedSelectionModel, setAssignedSelectionModel] = useState<any[]>(
    []
  );
  const [uncheckedRows, setUncheckedRows] = useState<any[]>([]);
  const [disableSave, setDisableSave] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setRouteSearchQuery("");
    setRouteSelectedStatus({});
    setRouteAssignedSearchQuery("");
    setRouteAssignedSelectedStatus({});
  };

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };
  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  const handleNextClick = () => {
    setValue("2");
  };

  const handleBackClick = () => {
    setValue("1");
  };

  const handleSaveClick = async () => {
    await handleBulkUpdateDistributorRoute(
      params.id,
      createDistributorRouteModelList()
    );
    fetchData();
    setUncheckedRows([]);
  };

  useEffect(() => {
    const allRowIds = assignSelectedRows.map((row) => row.routeUId);
    dispatch(setAssignRoute(assignSelectedRows));
    setAssignedSelectionModel(allRowIds);
  }, [assignSelectedRows]);

  useEffect(() => {
    const defaultSelectedRows = routeList.filter(
      (row: any) => row.checkedStatus
    );
    const defaultSelectedRowIds = defaultSelectedRows.map(
      (row: any) => row.routeUId
    );
    setAssignSelectedRows(defaultSelectedRows);
    setAssignedSelectionModel(defaultSelectedRowIds);
  }, [routeList]);

  useEffect(() => {
    if (distributorRouteMsg) {
      enqueueSnackbar(distributorRouteMsg, { variant: "success" });
      dispatch(setDistributorRouteMsg(null));
    }
  }, [distributorRouteMsg]);

  const createDistributorRouteModelList = () => {
    const distributorRouteModelList = assignRoutes.map((route: any) => ({
      routeUId: route.routeUId,
      isChecked: assignedSelectionModel.includes(route.routeUId),
    }));

    const filteredMyList = distributorRouteModelList.filter((myItem: any) => {
      const matchingRoute = routeList.find(
        (route: any) => route.routeUId === myItem.routeUId
      );
      return !matchingRoute || matchingRoute.checkedStatus !== myItem.isChecked;
    });

    return { distributorRouteModelList: filteredMyList };
  };

  const handleBulkUpdateDistributorRoute = async (uid: number, data: any) => {
    await distributorRouteBulkUpdate(uid, data);
  };

  const fetchData = async () => {
    setLoading(true);
    setDisableSave(true);
    try {
      await getAllRoutesByDistributorId(params.id);
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    // Filter out unchecked rows from assignSelectedRows
    const filteredRows = assignSelectedRows.filter(
      (row) =>
        !uncheckedRows.some(
          (uncheckedRow) => uncheckedRow.routeUId === row.routeUId
        )
    );

    const combinedRows = [...filteredRows, ...uncheckedRows].sort((a, b) =>
      String(a.routeUId).localeCompare(String(b.routeUId))
    );
    const currentIds = new Set<number>(
      assignRoutes.map((r: any) => r.routeUId)
    );
    const nextIds = new Set<number>(combinedRows.map((r) => r.routeUId));

    const isDifferent =
      currentIds.size !== nextIds.size ||
      Array.from(currentIds).some((id) => !nextIds.has(id));

    if (isDifferent) {
      dispatch(setAssignRoute(combinedRows));
    }
  }, [uncheckedRows, assignSelectedRows, dispatch]);

  const handleRowSelectionChange = (newSelection: any) => {
    setDisableSave(false);
    const visibleIds = filteredRouteAssignedRows.map((row) => row.routeUId);
    const visibleIdSet = new Set(visibleIds);
    const newSelectionSet = new Set(newSelection);
    const updatedSelectionModel = assignedSelectionModel.filter(
      (id) => !visibleIdSet.has(id)
    );
    const finalSelection = [...updatedSelectionModel, ...newSelection];

    setAssignedSelectionModel(finalSelection);
    const newUncheckedRows = assignRoutes
      .filter(
        (row: any) =>
          visibleIdSet.has(row.routeUId) && !newSelectionSet.has(row.routeUId)
      )
      .map((row: any) => ({ ...row, checkedStatus: false }));

    setUncheckedRows((prev) => {
      const combined = [...prev, ...newUncheckedRows];
      return Array.from(new Map(combined.map((r) => [r.routeUId, r])).values());
    });
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
    searchQuery: routeAssignedSearchQuery,
    setSearchQuery: setRouteAssignedSearchQuery,
    selectedStatus: routeAssignedSelectedStatus,
    setSelectedStatus: setRouteAssignedSelectedStatus,
    searchedRows: filteredRouteAssignedRows,
  } = useColumnFilter<(typeof assignRoutes)[number]>(
    assignRoutes,
    RoutesMapperTableHeadingsAssign,
    value
  );

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Route"
        pageNavigation={[
          {
            pageName: "Distributor Mapper",
            path: PATH_DASHBOARD.distributorMapper.list,
          },
          { pageName: "Route" },
        ]}
        onLinkClick={handleBreadcrumbNavigation}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="Assign" value="1" />
                <Tab label="Assigned" value="2" />
              </TabList>
            </Box>
            {/****************  Tab Panel 1 *****************/}
            <TabPanel value={"1"} sx={tabViewTable}>
              <DataGrid
                sx={{ ...dataGridStyleMappers }}
                getRowId={(row) => row.routeUId}
                rows={filteredRouteRows}
                loading={loading}
                columns={getColumnsWithTooltip(RoutesMapperTableHeadingsAssign)}
                rowCount={filteredRouteRows.length}
                pageSizeOptions={tableOptions.rowsPerPageOptions}
                checkboxSelection
                density="compact"
                rowSelectionModel={assignedSelectionModel}
                isRowSelectable={(params) => !params.row.checkedStatus}
                onRowSelectionModelChange={(ids) => {
                  const selectedIDs = new Set(ids);
                  const selectedRows = routeList.filter((row: any) =>
                    selectedIDs.has(row.routeUId)
                  );
                  setAssignSelectedRows((prevSelected) => {
                    const prevMap = new Map(
                      prevSelected.map((row) => [row.routeUId, row])
                    );
                    const newMap = new Map(
                      selectedRows.map((row: any) => [row.routeUId, row])
                    );

                    selectedIDs.forEach((id) => {
                      if (newMap.has(id)) {
                        prevMap.set(id, newMap.get(id)!);
                      }
                    });

                    const updated = Array.from(prevMap.values()).filter(
                      (row) =>
                        selectedIDs.has(row.routeUId) ||
                        !filteredRouteRows.some(
                          (r) => r.routeUId === row.routeUId
                        )
                    );

                    return updated;
                  });
                  setDisableSave(false);
                }}
                slots={{
                  noRowsOverlay: CustomNoRowsOverlay,
                  toolbar: () => (
                    <QuickSearchToolbar
                      handleNextClick={handleNextClick}
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

            {/****************  Tab Panel 2 *****************/}
            <TabPanel value={"2"} sx={tabViewTable}>
              <DataGrid
                sx={{ ...dataGridStyleMappers }}
                getRowId={(row) => row.routeUId}
                rows={filteredRouteAssignedRows}
                loading={loading}
                columns={getColumnsWithTooltip(RoutesMapperTableHeadingsAssign)}
                rowCount={filteredRouteAssignedRows.length}
                pageSizeOptions={tableOptions.rowsPerPageOptions}
                checkboxSelection
                density="compact"
                rowSelectionModel={assignedSelectionModel}
                onRowSelectionModelChange={handleRowSelectionChange}
                slots={{
                  noRowsOverlay: CustomNoRowsOverlay,
                  toolbar: () => (
                    <QuickSearchToolbar
                      handleBackClick={handleBackClick}
                      handleSaveClick={handleSaveClick}
                      isDisabled={disableSave}
                      columns={RoutesMapperTableHeadingsAssign.filter(
                        (col) => col.field !== "__check__"
                      )}
                      searchQuery={routeAssignedSearchQuery}
                      setSearchQuery={setRouteAssignedSearchQuery}
                      selectedStatus={routeAssignedSelectedStatus}
                      setSelectedStatus={setRouteAssignedSelectedStatus}
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

export default RouteDistributorMapper;
