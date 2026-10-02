"use client";

import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import PopupResponse from "@/components/popup/popup-response";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import {
  setAssignDistributors,
  setDistributorCompaniesMsg,
} from "@/redux/slices/mappers/distributor-company-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  companyDistributorBulkUpdate,
  getAllDistributorsByCompanyId,
} from "@/service/mapping-service/distributorCompany.service";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  dataGridStyleMappers,
  tabViewTable,
} from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import QuickSearchToolbar from "../../components/search-filter";
import {
  DistributorMapperTableHeadingsCompany,
  tableOptions,
} from "./table-component-distributorMapper-assign";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const CompanyToDistributorMapper = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const distributorList = useSelector(
    (state) => state.distributorCompanySlice.distributorCompanies
  );
  const assignDistributors = useSelector(
    (state) => state.distributorCompanySlice.assignDistributors
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const distributorCompaniesMsg = useSelector(
    (state) => state.distributorCompanySlice.distributorCompaniesMsg
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
    setDistributorSearchQuery("");
    setDistributorSelectedStatus({});
    setDistributorAssignedSearchQuery("");
    setDistributorAssignedSelectedStatus({});
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
    await handleBulkUpdateCompanyDistributor(
      params.id,
      createCompanyDistributorModelList()
    );
    fetchData();
    setUncheckedRows([]);
  };

  useEffect(() => {
    const allRowIds = assignSelectedRows.map((row) => row.distributorUId);
    dispatch(setAssignDistributors(assignSelectedRows));
    setAssignedSelectionModel(allRowIds);
  }, [assignSelectedRows]);

  useEffect(() => {
    const defaultSelectedRows = distributorList.filter(
      (row: any) => row.checkedStatus
    );
    const defaultSelectedRowIds = defaultSelectedRows.map(
      (row: any) => row.distributorUId
    );
    setAssignSelectedRows(defaultSelectedRows);
    setAssignedSelectionModel(defaultSelectedRowIds);
  }, [distributorList]);

  useEffect(() => {
    if (distributorCompaniesMsg) {
      enqueueSnackbar(distributorCompaniesMsg, { variant: "success" });
      dispatch(setDistributorCompaniesMsg(null));
    }
  }, [distributorCompaniesMsg]);

  const createCompanyDistributorModelList = () => {
    const companyDistributorModelList = assignDistributors.map(
      (distributor: any) => ({
        distributorId: distributor.distributorUId,
        isChecked: assignedSelectionModel.includes(distributor.distributorUId),
      })
    );

    const filteredMyList = companyDistributorModelList.filter((myItem: any) => {
      const matchingDistributor = distributorList.find(
        (distributor: any) =>
          distributor.distributorUId === myItem.distributorId
      );
      return (
        !matchingDistributor ||
        matchingDistributor.checkedStatus !== myItem.isChecked
      );
    });
    return { list: filteredMyList };
  };

  const handleBulkUpdateCompanyDistributor = async (uid: number, data: any) => {
    try {
      await companyDistributorBulkUpdate(uid, data);
    } catch (error: any) {}
  };

  const fetchData = async () => {
    setLoading(true);
    setDisableSave(true);
    try {
      await getAllDistributorsByCompanyId(params.id);
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
    const filteredRows = assignSelectedRows.filter(
      (row) =>
        !uncheckedRows.some(
          (uncheckedRow) => uncheckedRow.distributorUId === row.distributorUId
        )
    );

    const combinedRows = [...filteredRows, ...uncheckedRows].sort((a, b) =>
      String(a.distributorUId).localeCompare(String(b.distributorUId))
    );

    const currentIds = new Set<number>(
      assignDistributors.map((r: any) => r.distributorUId)
    );
    const nextIds = new Set<number>(combinedRows.map((r) => r.distributorUId));

    const isDifferent =
      currentIds.size !== nextIds.size ||
      Array.from(currentIds).some((id) => !nextIds.has(id));

    if (isDifferent) {
      dispatch(setAssignDistributors(combinedRows));
    }
  }, [assignSelectedRows, uncheckedRows]);

  const handleRowSelectionChange = (newSelection: any[]) => {
    setDisableSave(false);
    const visibleIds = filteredDistributorAssignedRows.map(
      (row) => row.distributorUId
    );
    const visibleIdSet = new Set(visibleIds);
    const newSelectionSet = new Set(newSelection);
    const updatedSelectionModel = assignedSelectionModel.filter(
      (id) => !visibleIdSet.has(id)
    );
    const finalSelection = [...updatedSelectionModel, ...newSelection];

    setAssignedSelectionModel(finalSelection);
    const newUncheckedRows = assignDistributors
      .filter(
        (row: any) =>
          visibleIdSet.has(row.distributorUId) &&
          !newSelectionSet.has(row.distributorUId)
      )
      .map((row: any) => ({ ...row, checkedStatus: false }));

    setUncheckedRows((prev) => {
      const combined = [...prev, ...newUncheckedRows];
      return Array.from(
        new Map(combined.map((r) => [r.distributorUId, r])).values()
      );
    });
  };

  const {
    searchQuery: distributorSearchQuery,
    setSearchQuery: setDistributorSearchQuery,
    selectedStatus: distributorSelectedStatus,
    setSelectedStatus: setDistributorSelectedStatus,
    searchedRows: filteredDistributorRows,
  } = useColumnFilter<(typeof distributorList)[number]>(
    distributorList,
    DistributorMapperTableHeadingsCompany,
    value
  );

  const {
    searchQuery: distributorAssignedSearchQuery,
    setSearchQuery: setDistributorAssignedSearchQuery,
    selectedStatus: distributorAssignedSelectedStatus,
    setSelectedStatus: setDistributorAssignedSelectedStatus,
    searchedRows: filteredDistributorAssignedRows,
  } = useColumnFilter<(typeof assignDistributors)[number]>(
    assignDistributors,
    DistributorMapperTableHeadingsCompany,
    value
  );

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Distributor"
        pageNavigation={[
          {
            pageName: "Company Mapper",
            path: PATH_DASHBOARD.companyMapper.list,
          },
          { pageName: "Distributor" },
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
                getRowId={(row) => row.distributorUId}
                rows={filteredDistributorRows}
                loading={loading}
                columns={getColumnsWithTooltip(
                  DistributorMapperTableHeadingsCompany
                )}
                rowCount={filteredDistributorRows.length}
                pageSizeOptions={tableOptions.rowsPerPageOptions}
                checkboxSelection
                density="compact"
                rowSelectionModel={assignedSelectionModel}
                isRowSelectable={(params) => !params.row.checkedStatus}
                onRowSelectionModelChange={(ids) => {
                  const selectedIDs = new Set(ids);
                  const selectedRows = distributorList.filter((row: any) =>
                    selectedIDs.has(row.distributorUId)
                  );
                  setAssignSelectedRows((prevSelected) => {
                    const prevMap = new Map(
                      prevSelected.map((row) => [row.distributorUId, row])
                    );
                    const newMap = new Map(
                      selectedRows.map((row: any) => [row.distributorUId, row])
                    );

                    selectedIDs.forEach((id) => {
                      if (newMap.has(id)) {
                        prevMap.set(id, newMap.get(id)!);
                      }
                    });

                    const updated = Array.from(prevMap.values()).filter(
                      (row) =>
                        selectedIDs.has(row.distributorUId) ||
                        !filteredDistributorRows.some(
                          (r) => r.distributorUId === row.distributorUId
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
                      columns={DistributorMapperTableHeadingsCompany.filter(
                        (col) => col.field !== "__check__"
                      )}
                      searchQuery={distributorSearchQuery}
                      setSearchQuery={setDistributorSearchQuery}
                      selectedStatus={distributorSelectedStatus}
                      setSelectedStatus={setDistributorSelectedStatus}
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
                getRowId={(row) => row.distributorUId}
                rows={filteredDistributorAssignedRows}
                loading={loading}
                columns={getColumnsWithTooltip(
                  DistributorMapperTableHeadingsCompany
                )}
                rowCount={filteredDistributorAssignedRows.length}
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
                      columns={DistributorMapperTableHeadingsCompany.filter(
                        (col) => col.field !== "__check__"
                      )}
                      searchQuery={distributorAssignedSearchQuery}
                      setSearchQuery={setDistributorAssignedSearchQuery}
                      selectedStatus={distributorAssignedSelectedStatus}
                      setSelectedStatus={setDistributorAssignedSelectedStatus}
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

export default CompanyToDistributorMapper;
