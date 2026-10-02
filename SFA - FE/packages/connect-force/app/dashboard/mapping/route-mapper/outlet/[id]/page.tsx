"use client";

import React, { useEffect, useRef, useState } from "react";
import { PATH_DASHBOARD } from "@/routes/paths";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { useRouter } from "next/navigation";
import RouteIcon from "@mui/icons-material/Route";
import {
  getAllOutletsByRouteId,
  routeOutletBulkUpdate,
} from "@/service/mapping-service/routeOutlet.service";
import { dispatch, useSelector } from "@/redux/store";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import PopupResponse from "@/components/popup/popup-response";
import { DataGrid } from "@mui/x-data-grid";
import {
  dataGridStyleMappers,
  tabViewTable,
} from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import {
  RouteOutletMapperTableHeadingsAssign,
  tableOptions,
} from "./components/table-component-outletMapper-assign";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { enqueueSnackbar } from "notistack";
import {
  setAssignOutlet,
  setRouteOutletsMsg,
} from "@/redux/slices/mappers/route-outlet-slice";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const RouteOutlet = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setOutletSearchQuery("");
    setOutletSelectedStatus({});
    setOutletAssignedSearchQuery("");
    setOutletAssignedSelectedStatus({});
  };
  const outletList = useSelector(
    (state) => state.routeOutletsSlice.routeOutlets
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const assignOutlets_s = useSelector(
    (state) => state.routeOutletsSlice.assignOutlet
  );
  const routeOutletMsg = useSelector(
    (state) => state.routeOutletsSlice.routeOutletMsg
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

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    // Set all row IDs as selected by default
    const allRowIds = assignSelectedRows.map((row) => row.outletUId);
    dispatch(setAssignOutlet(assignSelectedRows));
    setAssignedSelectionModel(allRowIds);
  }, [assignSelectedRows, dispatch]);

  useEffect(() => {
    // Filter out unchecked rows from assignSelectedRows
    const filteredRows = assignSelectedRows.filter(
      (row) =>
        !uncheckedRows.some(
          (uncheckedRow) => uncheckedRow.outletUId === row.outletUId
        )
    );

    const combinedRows = [...filteredRows, ...uncheckedRows].sort((a, b) =>
      String(a.outletUId).localeCompare(String(b.outletUId))
    );
    const currentIds = new Set<number>(
      assignOutlets_s.map((r: any) => r.outletUId)
    );
    const nextIds = new Set<number>(combinedRows.map((r) => r.outletUId));

    const isDifferent =
      currentIds.size !== nextIds.size ||
      Array.from(currentIds).some((id) => !nextIds.has(id));

    if (isDifferent) {
      dispatch(setAssignOutlet(combinedRows));
    }
  }, [uncheckedRows, assignSelectedRows, dispatch]);

  useEffect(() => {
    // Set default selected rows based on checkedStatus
    const defaultSelectedRows = outletList.filter(
      (row: any) => row.checkedStatus
    );
    const defaultSelectedRowIds = defaultSelectedRows.map(
      (row: any) => row.outletUId
    );
    setAssignSelectedRows(defaultSelectedRows);
    setAssignedSelectionModel(defaultSelectedRowIds);
  }, [outletList]);

  useEffect(() => {
    if (routeOutletMsg) {
      enqueueSnackbar(routeOutletMsg, { variant: "success" });
      dispatch(setRouteOutletsMsg(null));
    }
  }, [routeOutletMsg]);

  const createRouteOutletModelList = () => {
    const list = assignOutlets_s.map((outlet: any) => ({
      outletUId: outlet.outletUId,
      isChecked: assignedSelectionModel.includes(outlet.outletUId),
    }));

    const filteredMyList = list.filter((myItem: any) => {
      const matchingOutlet = outletList.find(
        (outlet: any) => outlet.outletUId === myItem.outletUId
      );
      return (
        !matchingOutlet || matchingOutlet.checkedStatus !== myItem.isChecked
      );
    });

    return { list: filteredMyList };
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const fetchData = async () => {
    setLoading(true);
    setDisableSave(true);
    try {
      await getAllOutletsByRouteId(params.id);
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRowSelectionChange = (newSelection: any) => {
    setDisableSave(false);
    const visibleIds = filteredOutletAssignedRows.map((row) => row.outletUId);
    const visibleIdSet = new Set(visibleIds);
    const newSelectionSet = new Set(newSelection);
    const updatedSelectionModel = assignedSelectionModel.filter(
      (id) => !visibleIdSet.has(id)
    );
    const finalSelection = [...updatedSelectionModel, ...newSelection];

    setAssignedSelectionModel(finalSelection);
    const newUncheckedRows = assignOutlets_s
      .filter(
        (row: any) =>
          visibleIdSet.has(row.outletUId) && !newSelectionSet.has(row.outletUId)
      )
      .map((row: any) => ({ ...row, checkedStatus: false }));

    setUncheckedRows((prev) => {
      const combined = [...prev, ...newUncheckedRows];
      return Array.from(
        new Map(combined.map((r) => [r.outletUId, r])).values()
      );
    });
  };

  const {
    searchQuery: outletSearchQuery,
    setSearchQuery: setOutletSearchQuery,
    selectedStatus: outletSelectedStatus,
    setSelectedStatus: setOutletSelectedStatus,
    searchedRows: filteredOutletRows,
  } = useColumnFilter<(typeof outletList)[number]>(
    outletList,
    RouteOutletMapperTableHeadingsAssign,
    value
  );

  const {
    searchQuery: outletAssignedSearchQuery,
    setSearchQuery: setOutletAssignedSearchQuery,
    selectedStatus: outletAssignedSelectedStatus,
    setSelectedStatus: setOutletAssignedSelectedStatus,
    searchedRows: filteredOutletAssignedRows,
  } = useColumnFilter<(typeof assignOutlets_s)[number]>(
    assignOutlets_s,
    RouteOutletMapperTableHeadingsAssign,
    value
  );

  const handleSaveClick = async () => {
    createRouteOutletModelList();
    await handleBulkUpdateRouteOutlet(params.id, createRouteOutletModelList());
    fetchData();
    setUncheckedRows([]);
  };

  const handleBulkUpdateRouteOutlet = async (uid: number, data: any) => {
    try {
      if (data.list.length >= 1) {
        await routeOutletBulkUpdate(uid, data);
      } else {
        enqueueSnackbar(`Zero outlets selected`, { variant: "error" });
      }
    } catch (error: any) {
      enqueueSnackbar(
        `Updating failed ${error.toString().replace("Error:", ":")}`,
        { variant: "error" }
      );
    }
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const handleNextClick = () => {
    setValue("2"); // Move to the second tab (index 1)
  };

  const handleBackClick = () => {
    setValue("1"); // Move to the first tab (index 0)
  };

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Route"
        pageNavigation={[
          { pageName: "Route Mapper", path: PATH_DASHBOARD.routeMapper.list },
          { pageName: "Outlet" },
        ]}
        onLinkClick={handleBreadcrumbNavigation}
        onFullScreenClick={handleFullScreenClick}
        icon={<RouteIcon />}
      />

      <Container>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="Route Outlet mapping"
              >
                <Tab label="Assign" value="1" />
                <Tab label="Assigned" value="2" />
              </TabList>
            </Box>

            {/* Table panel 01 */}
            <TabPanel value="1" sx={tabViewTable}>
              <DataGrid
                sx={{ ...dataGridStyleMappers }}
                getRowId={(row) => row.outletUId}
                rows={filteredOutletRows}
                loading={loading}
                columns={getColumnsWithTooltip(
                  RouteOutletMapperTableHeadingsAssign
                )}
                rowCount={filteredOutletRows.length}
                pageSizeOptions={tableOptions.rowsPerPageOptions}
                checkboxSelection
                density="compact"
                rowSelectionModel={assignedSelectionModel}
                isRowSelectable={(params) => !params.row.checkedStatus}
                onRowSelectionModelChange={(ids) => {
                  const selectedIDs = new Set(ids);
                  const selectedRows = outletList.filter((row: any) =>
                    selectedIDs.has(row.outletUId)
                  );
                  setAssignSelectedRows((prevSelected) => {
                    const prevMap = new Map(
                      prevSelected.map((row) => [row.outletUId, row])
                    );
                    const newMap = new Map(
                      selectedRows.map((row: any) => [row.outletUId, row])
                    );

                    selectedIDs.forEach((id) => {
                      if (newMap.has(id)) {
                        prevMap.set(id, newMap.get(id)!);
                      }
                    });

                    const updated = Array.from(prevMap.values()).filter(
                      (row) =>
                        selectedIDs.has(row.outletUId) ||
                        !filteredOutletRows.some(
                          (r) => r.outletUId === row.outletUId
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
                      columns={RouteOutletMapperTableHeadingsAssign.filter(
                        (col) => col.field !== "__check__"
                      )}
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

            {/* Table panel 02 */}
            <TabPanel value="2" sx={tabViewTable}>
              <DataGrid
                sx={{ ...dataGridStyleMappers }}
                getRowId={(row) => row.outletUId}
                rows={filteredOutletAssignedRows}
                loading={loading}
                columns={getColumnsWithTooltip(
                  RouteOutletMapperTableHeadingsAssign
                )}
                rowCount={filteredOutletAssignedRows.length}
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
                      columns={RouteOutletMapperTableHeadingsAssign.filter(
                        (col) => col.field !== "__check__"
                      )}
                      searchQuery={outletAssignedSearchQuery}
                      setSearchQuery={setOutletAssignedSearchQuery}
                      selectedStatus={outletAssignedSelectedStatus}
                      setSelectedStatus={setOutletAssignedSelectedStatus}
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

export default RouteOutlet;
