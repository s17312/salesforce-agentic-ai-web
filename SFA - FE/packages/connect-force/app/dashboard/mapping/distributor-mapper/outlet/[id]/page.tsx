"use client";

import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  dataGridStyleMappers,
  tabViewTable,
} from "@/styles/tableStyles/tableStyle";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import PopupResponse from "@/components/popup/popup-response";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { DataGrid } from "@mui/x-data-grid";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import { enqueueSnackbar } from "notistack";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import {
  distributorOutletBulkUpdate,
  getAllOutletByDistributorId,
} from "@/service/mapping-service/distributorOutlet.service";
import {
  setAssignOutlet,
  setDistributorOutletMsg,
} from "@/redux/slices/mappers/distributor-outlet-slice";
import {
  OutletMapperTableHeadingsAssign,
  tableOptions,
} from "./table-component-outletMapper-assign";
import { OutletMapperTableHeadingsAssigned } from "./table-component-outletMapper-assigned";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const OutletDistributorMapper = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const outlatList = useSelector(
    (state) => state.distributorOutletSlice.distributorOutlets
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const assignOutlet_s = useSelector(
    (state) => state.distributorOutletSlice.assignOutlet
  );
  const distributorOutletMsg = useSelector(
    (state) => state.distributorOutletSlice.distributorOutletMsg
  );
  const [value, setValue] = useState("1");
  const [serverDownError, setServerDownError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assignSelectedRows, setAssignSelectedRows] = useState<any[]>([]);
  const [assignedSelectionModel, setAssignedSelectionModel] = useState<any[]>(
    []
  );
  const [uncheckedRows, setUncheckedRows] = useState<any[]>([]);
  const [disableSave, setDisableSave] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setOutletSearchQuery("");
    setOutletSelectedStatus({});
    setOutletAssignedSearchQuery("");
    setOutletAssignedSelectedStatus({});
  };

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
      assignOutlet_s.map((r: any) => r.outletUId)
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
    const defaultSelectedRows = outlatList.filter(
      (row: any) => row.checkedStatus
    );
    const defaultSelectedRowIds = defaultSelectedRows.map(
      (row: any) => row.outletUId
    );
    setAssignSelectedRows(defaultSelectedRows);
    setAssignedSelectionModel(defaultSelectedRowIds);
  }, [outlatList]);

  useEffect(() => {
    if (distributorOutletMsg) {
      enqueueSnackbar(distributorOutletMsg, { variant: "success" });
      dispatch(setDistributorOutletMsg(null));
    }
  }, [distributorOutletMsg]);

  const createDistributorOutletModelList = () => {
    const distributorOutletModelList = assignOutlet_s.map((outlet: any) => ({
      outletUId: outlet.outletUId,
      isChecked: assignedSelectionModel.includes(outlet.outletUId),
    }));

    const filteredMyList = distributorOutletModelList.filter((myItem: any) => {
      const matchingOutlet = outlatList.find(
        (outlet: any) => outlet.outletUId === myItem.outletUId
      );
      return (
        !matchingOutlet || matchingOutlet.checkedStatus !== myItem.isChecked
      );
    });

    return { distributorOutletModelList: filteredMyList };
  };

  const handleNextClick = () => {
    setValue("2"); // Move to the second tab (index 1)
  };

  const handleBackClick = () => {
    setValue("1"); // Move to the first tab (index 0)
  };

  const handleSaveClick = async () => {
    await handleBulkUpdateDistributorOutlet(
      params.id,
      createDistributorOutletModelList()
    );
    fetchData();
    setUncheckedRows([]);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  const fetchData = async () => {
    setLoading(true);
    setDisableSave(true);
    try {
      await getAllOutletByDistributorId(params.id);
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const handleBulkUpdateDistributorOutlet = async (uid: number, data: any) => {
    await distributorOutletBulkUpdate(uid, data);
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
    const newUncheckedRows = assignOutlet_s
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
  } = useColumnFilter<(typeof outlatList)[number]>(
    outlatList,
    OutletMapperTableHeadingsAssign,
    value
  );

  const {
    searchQuery: outletAssignedSearchQuery,
    setSearchQuery: setOutletAssignedSearchQuery,
    selectedStatus: outletAssignedSelectedStatus,
    setSelectedStatus: setOutletAssignedSelectedStatus,
    searchedRows: filteredOutletAssignedRows,
  } = useColumnFilter<(typeof assignOutlet_s)[number]>(
    assignOutlet_s,
    OutletMapperTableHeadingsAssign,
    value
  );

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Outlet"
        pageNavigation={[
          {
            pageName: "Distributor Mapper",
            path: PATH_DASHBOARD.distributorMapper.list,
          },
          { pageName: "Outlet" },
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

            {/****************  Table Panel 1 *****************/}
            <TabPanel value="1" sx={tabViewTable}>
              <DataGrid
                sx={{ ...dataGridStyleMappers }}
                getRowId={(row) => row.outletUId}
                rows={filteredOutletRows}
                loading={loading}
                columns={getColumnsWithTooltip(OutletMapperTableHeadingsAssign)}
                rowCount={filteredOutletRows.length}
                pageSizeOptions={tableOptions.rowsPerPageOptions}
                checkboxSelection
                density="compact"
                rowSelectionModel={assignedSelectionModel}
                isRowSelectable={(params) => !params.row.checkedStatus}
                onRowSelectionModelChange={(ids) => {
                  const selectedIDs = new Set(ids);
                  const selectedRows = outlatList.filter((row: any) =>
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
                      columns={OutletMapperTableHeadingsAssign.filter(
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

            {/****************  Table Panel 2 *****************/}
            <TabPanel
              value="2"
              sx={{
                padding: 2,
                marginTop: 0,
                paddingBottom: 0,
              }}
            >
              <DataGrid
                sx={{ ...dataGridStyleMappers }}
                getRowId={(row) => row.outletUId}
                rows={filteredOutletAssignedRows}
                loading={loading}
                columns={getColumnsWithTooltip(
                  OutletMapperTableHeadingsAssigned
                )}
                rowCount={filteredOutletAssignedRows?.length}
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
                      columns={OutletMapperTableHeadingsAssigned.filter(
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
export default OutletDistributorMapper;
