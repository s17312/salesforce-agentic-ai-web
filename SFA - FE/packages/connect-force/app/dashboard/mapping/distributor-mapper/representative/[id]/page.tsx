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
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import {
  RepresentativeMapperTableHeadingsAssign,
  tableOptions,
} from "./table-component-representativeMapper-assign";
import {
  setAssignRepresentative,
  setDistributorRepresentativeMsg,
} from "@/redux/slices/mappers/distributor-representative-slice";
import {
  distributorRepresentativeBulkUpdate,
  getAllRepresentativesByDistributorId,
} from "@/service/mapping-service/distributorRepresentative.service";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const RepresentativeDistributorMapper = ({
  params,
}: {
  params: { id: number };
}) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setRepSearchQuery("");
    setRepSelectedStatus({});
    setRepAssignedSearchQuery("");
    setRepAssignedSelectedStatus({});
  };
  const representativeList = useSelector(
    (state) => state.distributorRepresentativeSlice.distributorRepresentatives
  );

  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const assignrepresentatives_s = useSelector(
    (state) => state.distributorRepresentativeSlice.assignRepresentative
  );
  const distributorrepresentativeMsg = useSelector(
    (state) => state.distributorRepresentativeSlice.distributorRepresentativeMsg
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

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    // Set all row IDs as selected by default
    const allRowIds = assignSelectedRows.map((row) => row.representativeUId);
    dispatch(setAssignRepresentative(assignSelectedRows));
    setAssignedSelectionModel(allRowIds);
  }, [assignSelectedRows, dispatch]);

  useEffect(() => {
    // Filter out unchecked rows from assignSelectedRows
    const filteredRows = assignSelectedRows.filter(
      (row) =>
        !uncheckedRows.some(
          (uncheckedRow) =>
            uncheckedRow.representativeUId === row.representativeUId
        )
    );

    const combinedRows = [...filteredRows, ...uncheckedRows].sort((a, b) =>
      String(a.representativeUId).localeCompare(String(b.representativeUId))
    );
    const currentIds = new Set<number>(
      assignrepresentatives_s.map((r: any) => r.representativeUId)
    );
    const nextIds = new Set<number>(
      combinedRows.map((r) => r.representativeUId)
    );

    const isDifferent =
      currentIds.size !== nextIds.size ||
      Array.from(currentIds).some((id) => !nextIds.has(id));

    if (isDifferent) {
      dispatch(setAssignRepresentative(combinedRows));
    }
  }, [uncheckedRows, assignSelectedRows, dispatch]);

  useEffect(() => {
    const defaultSelectedRows = (representativeList || []).filter(
      (row: any) => row.checkedStatus
    );

    // Set default selected rows based on checkedStatus
    // const defaultSelectedRows = representativeList.filter(
    //   (row: any) => row.checkedStatus
    // );
    const defaultSelectedRowIds = defaultSelectedRows.map(
      (row: any) => row.representativeUId
    );
    setAssignSelectedRows(defaultSelectedRows);
    setAssignedSelectionModel(defaultSelectedRowIds);
  }, [representativeList]);

  useEffect(() => {
    if (distributorrepresentativeMsg) {
      enqueueSnackbar(distributorrepresentativeMsg, { variant: "success" });
      dispatch(setDistributorRepresentativeMsg(null));
    }
  }, [distributorrepresentativeMsg]);

  const createDistributorRepresentativeModelList = () => {
    const distributorRepresentativeModelList = assignrepresentatives_s.map(
      (representative: any) => ({
        representativeUId: representative.representativeUId,
        isChecked: assignedSelectionModel.includes(
          representative.representativeUId
        ),
      })
    );

    const filteredMyList = distributorRepresentativeModelList.filter(
      (myItem: any) => {
        const matchingRepresentative = representativeList.find(
          (representative: any) =>
            representative.representativeUId === myItem.representativeUId
        );
        return (
          !matchingRepresentative ||
          matchingRepresentative.checkedStatus !== myItem.isChecked
        );
      }
    );

    return { distributorRepresentativeModelList: filteredMyList };
  };

  const handleNextClick = () => {
    setValue("2"); // Move to the second tab (index 1)
  };

  const handleBackClick = () => {
    setValue("1"); // Move to the first tab (index 0)
  };

  const handleSaveClick = async () => {
    await handleBulkUpdateDistributorRepresentative(
      params.id,
      createDistributorRepresentativeModelList()
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
      await getAllRepresentativesByDistributorId(params.id);
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

  const handleBulkUpdateDistributorRepresentative = async (
    uid: number,
    data: any
  ) => {
    await distributorRepresentativeBulkUpdate(uid, data);
  };

  const handleRowSelectionChange = (newSelection: any) => {
    setDisableSave(false);
    const visibleIds = filteredRepAssignedRows.map((row) => row.distributorUId);
    const visibleIdSet = new Set(visibleIds);
    const newSelectionSet = new Set(newSelection);
    const updatedSelectionModel = assignedSelectionModel.filter(
      (id) => !visibleIdSet.has(id)
    );
    const finalSelection = [...updatedSelectionModel, ...newSelection];

    setAssignedSelectionModel(finalSelection);
    const newUncheckedRows = assignrepresentatives_s
      .filter(
        (row: any) =>
          visibleIdSet.has(row.representativeUId) &&
          !newSelectionSet.has(row.representativeUId)
      )
      .map((row: any) => ({ ...row, checkedStatus: false }));

    setUncheckedRows((prev) => {
      const combined = [...prev, ...newUncheckedRows];
      return Array.from(
        new Map(combined.map((r) => [r.representativeUId, r])).values()
      );
    });
  };

  const {
    searchQuery: repSearchQuery,
    setSearchQuery: setRepSearchQuery,
    selectedStatus: repSelectedStatus,
    setSelectedStatus: setRepSelectedStatus,
    searchedRows: filteredRepRows,
  } = useColumnFilter<(typeof representativeList)[number]>(
    representativeList,
    RepresentativeMapperTableHeadingsAssign,
    value
  );

  const {
    searchQuery: repAssignedSearchQuery,
    setSearchQuery: setRepAssignedSearchQuery,
    selectedStatus: repAssignedSelectedStatus,
    setSelectedStatus: setRepAssignedSelectedStatus,
    searchedRows: filteredRepAssignedRows,
  } = useColumnFilter<(typeof assignrepresentatives_s)[number]>(
    assignrepresentatives_s,
    RepresentativeMapperTableHeadingsAssign,
    value
  );

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Representative"
        pageNavigation={[
          {
            pageName: "Distributor Mapper",
            path: PATH_DASHBOARD.distributorMapper.list,
          },
          { pageName: "Representative" },
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
                getRowId={(row) => row.representativeUId}
                rows={filteredRepRows}
                loading={loading}
                columns={getColumnsWithTooltip(
                  RepresentativeMapperTableHeadingsAssign
                )}
                rowCount={filteredRepRows.length}
                pageSizeOptions={tableOptions.rowsPerPageOptions}
                checkboxSelection
                density="compact"
                rowSelectionModel={assignedSelectionModel}
                isRowSelectable={(params) => !params.row.checkedStatus}
                onRowSelectionModelChange={(ids) => {
                  const selectedIDs = new Set(ids);
                  const selectedRows = representativeList.filter((row: any) =>
                    selectedIDs.has(row.representativeUId)
                  );
                  setAssignSelectedRows((prevSelected) => {
                    const prevMap = new Map(
                      prevSelected.map((row) => [row.representativeUId, row])
                    );
                    const newMap = new Map(
                      selectedRows.map((row: any) => [
                        row.representativeUId,
                        row,
                      ])
                    );

                    selectedIDs.forEach((id) => {
                      if (newMap.has(id)) {
                        prevMap.set(id, newMap.get(id)!);
                      }
                    });

                    const updated = Array.from(prevMap.values()).filter(
                      (row) =>
                        selectedIDs.has(row.representativeUId) ||
                        !filteredRepRows.some(
                          (r) => r.representativeUId === row.representativeUId
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
                      columns={RepresentativeMapperTableHeadingsAssign.filter(
                        (col) => col.field !== "__check__"
                      )}
                      searchQuery={repSearchQuery}
                      setSearchQuery={setRepSearchQuery}
                      selectedStatus={repSelectedStatus}
                      setSelectedStatus={setRepSelectedStatus}
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
                getRowId={(row) => row.representativeUId}
                rows={filteredRepAssignedRows}
                loading={loading}
                columns={getColumnsWithTooltip(
                  RepresentativeMapperTableHeadingsAssign
                )}
                rowCount={filteredRepAssignedRows?.length}
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
                      columns={RepresentativeMapperTableHeadingsAssign.filter(
                        (col) => col.field !== "__check__"
                      )}
                      searchQuery={repAssignedSearchQuery}
                      setSearchQuery={setRepAssignedSearchQuery}
                      selectedStatus={repAssignedSelectedStatus}
                      setSelectedStatus={setRepAssignedSelectedStatus}
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
export default RepresentativeDistributorMapper;
