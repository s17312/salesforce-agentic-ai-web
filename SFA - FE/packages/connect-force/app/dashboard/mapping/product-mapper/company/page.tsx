"use client";

import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import { setCompanyMessage } from "@/redux/slices/company-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllCompany } from "@/service/company.service";
import {
  assignProductCompanyMapping,
  unassignProductCompanyMapping,
} from "@/service/mapping-service/productCompany.service";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  dataGridStyleMappers,
  tabViewTable,
} from "@/styles/tableStyles/tableStyle";
import { handleBreadcrumbNavigation } from "@/utils/breadcrumbNavigation";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import QuickSearchToolbar from "../distributor/components/search-filter";
import { ProductMapperTableHeadingsCompany } from "./components/table-component-productMapper-company";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const ProductCompanyMappingPage = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const companyList = useSelector((state) => state.companySlice.companies);
  const productCompanyMsg = useSelector((state) => state.companySlice.message);
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setCompanySearchQuery("");
    setCompanySelectedStatus({});
    setCompanyAssignedSearchQuery("");
    setCompanyAssignedSelectedStatus({});
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
    if (productCompanyMsg) {
      enqueueSnackbar(productCompanyMsg, { variant: "success" });
      dispatch(setCompanyMessage(null));
    }
  }, [productCompanyMsg]);

  useEffect(() => {
    if (value) {
      setAssignSelectionRows([]);
      setUnassignSelectionRows([]);
    }
  }, [value]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await getAllCompany(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        true
      );
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const createProductCompanyMapping = async () => {
    const data = {
      productUIds: selectedRows,
      companyUIds: assignSelectionRows,
    };

    try {
      await assignProductCompanyMapping(data);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
    }
  };

  const updateProductCompanyMapping = async () => {
    const data = {
      productUIds: selectedRows,
      companyUIds: unassignSelectionRows,
    };
    try {
      await unassignProductCompanyMapping(data);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
    }
  };

  const handleAssignClick = async () => {
    await createProductCompanyMapping();
  };

  const handleUnassignClick = async () => {
    await updateProductCompanyMapping();
  };

  const {
    searchQuery: companySearchQuery,
    setSearchQuery: setCompanySearchQuery,
    selectedStatus: companySelectedStatus,
    setSelectedStatus: setCompanySelectedStatus,
    searchedRows: filteredCompanyRows,
  } = useColumnFilter<(typeof companyList)[number]>(
    companyList,
    ProductMapperTableHeadingsCompany,
    value
  );

  const {
    searchQuery: companyAssignedSearchQuery,
    setSearchQuery: setCompanyAssignedSearchQuery,
    selectedStatus: companyAssignedSelectedStatus,
    setSelectedStatus: setCompanyAssignedSelectedStatus,
    searchedRows: filteredCompanyAssignedRows,
  } = useColumnFilter<(typeof companyList)[number]>(
    companyList,
    ProductMapperTableHeadingsCompany,
    value
  );

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Product - Company Mapping"
        pageNavigation={[
          {
            pageName: "Product Mapping",
            path: PATH_DASHBOARD.productMapper.list,
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
                columns={ProductMapperTableHeadingsCompany}
                rows={filteredCompanyRows}
                rowCount={filteredCompanyRows.length}
                loading={loading}
                checkboxSelection
                density="compact"
                rowSelectionModel={assignSelectionRows}
                onRowSelectionModelChange={(newSelection) => {
                  setAssignSelectionRows((prev) => {
                    const visibleIds = filteredCompanyRows.map(
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
                      handleSaveClick={handleAssignClick}
                      isDisabled={assignSelectionRows.length === 0}
                      columns={ProductMapperTableHeadingsCompany.filter(
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
            {/* UNASSIGN TAB PANEL */}
            <TabPanel value="2" sx={tabViewTable}>
              <DataGrid
                sx={{ ...dataGridStyleMappers }}
                getRowId={(row) => row.uId}
                columns={ProductMapperTableHeadingsCompany}
                rows={filteredCompanyAssignedRows}
                rowCount={filteredCompanyAssignedRows.length}
                loading={loading}
                checkboxSelection
                density="compact"
                rowSelectionModel={unassignSelectionRows}
                onRowSelectionModelChange={(newSelection) => {
                  setUnassignSelectionRows((prev) => {
                    const visibleIds = filteredCompanyAssignedRows.map(
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
                      columns={ProductMapperTableHeadingsCompany.filter(
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
    </FsBox>
  );
};

export default ProductCompanyMappingPage;
