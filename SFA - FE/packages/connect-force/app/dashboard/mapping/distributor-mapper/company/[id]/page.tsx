"use client";

import { PATH_DASHBOARD } from "@/routes/paths";
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
import { useEffect, useRef, useState } from "react";
import { dispatch, useSelector } from "@/redux/store";
import {
  setAssignCompanies,
  setDistributorCompaniesMsg,
} from "@/redux/slices/mappers/distributor-company-slice";
import { enqueueSnackbar } from "notistack";
import {
  distributorCompanyBulkUpdate,
  getAllCompaniesByDistributorId,
} from "@/service/mapping-service/distributorCompany.service";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import {
  CompanyMapperTableHeadingsAssign,
  tableOptions,
} from "./table-component-companyMapper-assign";
import PopupResponse from "@/components/popup/popup-response";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const CompanyDistributorMapper = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setCompanySearchQuery("");
    setCompanySelectedStatus({});
    setCompanyAssignedSearchQuery("");
    setCompanyAssignedSelectedStatus({});
  };
  const companyList = useSelector(
    (state) => state.distributorCompanySlice.companiesDistributor
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const assignCompanies_s = useSelector(
    (state) => state.distributorCompanySlice.assignCompanies
  );
  const distributorCompaniesMsg = useSelector(
    (state) => state.distributorCompanySlice.distributorCompaniesMsg
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
    const allRowIds = assignSelectedRows.map((row) => row.companyUId);
    dispatch(setAssignCompanies(assignSelectedRows));
    setAssignedSelectionModel(allRowIds);
  }, [assignSelectedRows, dispatch]);

  useEffect(() => {
    // Set default selected rows based on checkedStatus
    const defaultSelectedRows = companyList.filter(
      (row: any) => row.checkedStatus
    );
    const defaultSelectedRowIds = defaultSelectedRows.map(
      (row: any) => row.companyUId
    );
    setAssignSelectedRows(defaultSelectedRows);
    setAssignedSelectionModel(defaultSelectedRowIds);
  }, [companyList]);

  useEffect(() => {
    // Filter out unchecked rows from assignSelectedRows
    const filteredRows = assignSelectedRows.filter(
      (row) =>
        !uncheckedRows.some(
          (uncheckedRow) => uncheckedRow.companyUId === row.companyUId
        )
    );

    const combinedRows = [...filteredRows, ...uncheckedRows].sort((a, b) =>
      String(a.companyUId).localeCompare(String(b.companyUId))
    );
    const currentIds = new Set<number>(
      assignCompanies_s.map((r: any) => r.companyUId)
    );
    const nextIds = new Set<number>(combinedRows.map((r) => r.companyUId));

    const isDifferent =
      currentIds.size !== nextIds.size ||
      Array.from(currentIds).some((id) => !nextIds.has(id));

    if (isDifferent) {
      dispatch(setAssignCompanies(combinedRows));
    }
  }, [uncheckedRows, assignSelectedRows, dispatch]);

  useEffect(() => {
    if (distributorCompaniesMsg) {
      enqueueSnackbar(distributorCompaniesMsg, { variant: "success" });
      dispatch(setDistributorCompaniesMsg(null));
    }
  }, [distributorCompaniesMsg]);

  const createDistributorCompanyModelList = () => {
    const list = assignCompanies_s.map((company: any) => ({
      companyId: company.companyUId,
      isChecked: assignedSelectionModel.includes(company.companyUId),
    }));

    const filteredMyList = list.filter((myItem: any) => {
      const matchingCompany = companyList.find(
        (company: any) => company.companyUId === myItem.companyId
      );
      return (
        !matchingCompany || matchingCompany.checkedStatus !== myItem.isChecked
      );
    });

    return { list: filteredMyList };
  };

  const handleSaveClick = async () => {
    await handleBulkUpdateDistributorCompany(
      params.id,
      createDistributorCompanyModelList()
    );
    fetchData();
    setUncheckedRows([]);
  };

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  const fetchData = async () => {
    setLoading(true);
    setDisableSave(true);
    try {
      await getAllCompaniesByDistributorId(params.id);
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

  const handleNextClick = () => {
    setValue("2"); // Move to the second tab (index 1)
  };

  const handleBackClick = () => {
    setValue("1"); // Move to the first tab (index 0)
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const handleBulkUpdateDistributorCompany = async (uid: number, data: any) => {
    if (data.list.length >= 1) {
      await distributorCompanyBulkUpdate(uid, data);
    } else {
      enqueueSnackbar(`Zero Company selected`, {
        variant: "error",
      });
    }
  };

  const handleRowSelectionChange = (newSelection: any) => {
    setDisableSave(false);
    const visibleIds = filteredCompanyAssignedRows.map((row) => row.companyUId);
    const visibleIdSet = new Set(visibleIds);
    const newSelectionSet = new Set(newSelection);
    const updatedSelectionModel = assignedSelectionModel.filter(
      (id) => !visibleIdSet.has(id)
    );
    const finalSelection = [...updatedSelectionModel, ...newSelection];

    setAssignedSelectionModel(finalSelection);
    const newUncheckedRows = assignCompanies_s
      .filter(
        (row: any) =>
          visibleIdSet.has(row.companyUId) &&
          !newSelectionSet.has(row.companyUId)
      )
      .map((row: any) => ({ ...row, checkedStatus: false }));

    setUncheckedRows((prev) => {
      const combined = [...prev, ...newUncheckedRows];
      return Array.from(
        new Map(combined.map((r) => [r.companyUId, r])).values()
      );
    });
  };

  const {
    searchQuery: companySearchQuery,
    setSearchQuery: setCompanySearchQuery,
    selectedStatus: companySelectedStatus,
    setSelectedStatus: setCompanySelectedStatus,
    searchedRows: filteredCompanyRows,
  } = useColumnFilter<(typeof companyList)[number]>(
    companyList,
    CompanyMapperTableHeadingsAssign,
    value
  );

  const {
    searchQuery: companyAssignedSearchQuery,
    setSearchQuery: setCompanyAssignedSearchQuery,
    selectedStatus: companyAssignedSelectedStatus,
    setSelectedStatus: setCompanyAssignedSelectedStatus,
    searchedRows: filteredCompanyAssignedRows,
  } = useColumnFilter<(typeof assignCompanies_s)[number]>(
    assignCompanies_s,
    CompanyMapperTableHeadingsAssign,
    value
  );

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Company"
        pageNavigation={[
          {
            pageName: "Distributor Mapper",
            path: PATH_DASHBOARD.distributorMapper.list,
          },
          { pageName: "Company" },
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
            <TabPanel value="1" sx={tabViewTable}>
              <DataGrid
                sx={{ ...dataGridStyleMappers }}
                getRowId={(row) => row.companyUId}
                rows={filteredCompanyRows}
                loading={loading}
                columns={getColumnsWithTooltip(
                  CompanyMapperTableHeadingsAssign
                )}
                rowCount={filteredCompanyRows.length}
                pageSizeOptions={tableOptions.rowsPerPageOptions}
                checkboxSelection
                density="compact"
                rowSelectionModel={assignedSelectionModel}
                isRowSelectable={(params) => !params.row.checkedStatus}
                onRowSelectionModelChange={(ids) => {
                  const selectedIDs = new Set(ids);
                  const selectedRows = companyList.filter((row: any) =>
                    selectedIDs.has(row.companyUId)
                  );
                  setAssignSelectedRows((prevSelected) => {
                    const prevMap = new Map(
                      prevSelected.map((row) => [row.companyUId, row])
                    );
                    const newMap = new Map(
                      selectedRows.map((row: any) => [row.companyUId, row])
                    );

                    selectedIDs.forEach((id) => {
                      if (newMap.has(id)) {
                        prevMap.set(id, newMap.get(id)!);
                      }
                    });

                    const updated = Array.from(prevMap.values()).filter(
                      (row) =>
                        selectedIDs.has(row.companyUId) ||
                        !filteredCompanyRows.some(
                          (r) => r.companyUId === row.companyUId
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
                      columns={CompanyMapperTableHeadingsAssign.filter(
                        (col) => col.field !== "__check__"
                      )}
                      searchQuery={companySearchQuery}
                      setSearchQuery={setCompanySearchQuery}
                      selectedStatus={companySelectedStatus}
                      setSelectedStatus={setCompanySelectedStatus}
                      menuItem={{
                        field: "searchColumn",
                        headerName: "Search By",
                      }}
                    />
                  ),
                }}
              />
            </TabPanel>
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
                getRowId={(row) => row.companyUId}
                rows={filteredCompanyAssignedRows}
                loading={loading}
                columns={getColumnsWithTooltip(
                  CompanyMapperTableHeadingsAssign
                )}
                rowCount={filteredCompanyAssignedRows?.length}
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
                      columns={CompanyMapperTableHeadingsAssign.filter(
                        (col) => col.field !== "__check__"
                      )}
                      searchQuery={companyAssignedSearchQuery}
                      setSearchQuery={setCompanyAssignedSearchQuery}
                      selectedStatus={companyAssignedSelectedStatus}
                      setSelectedStatus={setCompanyAssignedSelectedStatus}
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

export default CompanyDistributorMapper;
