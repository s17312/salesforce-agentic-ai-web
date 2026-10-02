"use client";

import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import { PATH_DASHBOARD } from "@/routes/paths";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  dataGridStyleMappers,
  tabViewTable,
} from "@/styles/tableStyles/tableStyle";
import { handleBreadcrumbNavigation } from "@/utils/breadcrumbNavigation";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import QuickSearchToolbar from "./components/search-filter";
import { getAllDistributors } from "@/service/distributor.service";
import { dispatch, useSelector } from "@/redux/store";
import { ProductMapperTableHeadingsDistributor } from "./components/table-component-productMapper-distributor";
import {
  createProductDistributorMapping,
  unassignProductDistributorMapping,
} from "@/service/mapping-service/distributorProduct.service";
import { enqueueSnackbar } from "notistack";
import { setDistributorProductMsg } from "@/redux/slices/mappers/distributor-product-slice";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { setDistributorMessage } from "@/redux/slices/distributor-slice";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const Distributor = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const distributorList = useSelector(
    (state) => state.distributor.distributors
  );
  const distributorProductMsg = useSelector(
    (state) => state.distributor.message
  );
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setDistributorSearchQuery("");
    setDistributorSelectedStatus({});
    setDistributorUnassignedSearchQuery("");
    setDistributorUnassignedSelectedStatus({});
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
    if (distributorProductMsg) {
      enqueueSnackbar(distributorProductMsg, { variant: "success" });
      dispatch(setDistributorMessage(null));
    }
  }, [distributorProductMsg]);

  useEffect(() => {
    if (value) {
      setAssignSelectionRows([]);
      setUnassignSelectionRows([]);
    }
  }, [value]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await getAllDistributors(
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

  const createDistributorProductMapping = async () => {
    const data = {
      productUIds: selectedRows,
      distributorUIds: assignSelectionRows,
    };

    try {
      await createProductDistributorMapping(data);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      dispatch(setDistributorProductMsg(null));
    }
  };

  const unassignDistributorProductMapping = async () => {
    const data = {
      productUids: selectedRows,
      distributorUis: unassignSelectionRows,
    };
    try {
      await unassignProductDistributorMapping(data);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      dispatch(setDistributorProductMsg(null));
    }
  };

  const handleAssignClick = async () => {
    await createDistributorProductMapping();
  };

  const handleUnassignClick = async () => {
    await unassignDistributorProductMapping();
  };

  const {
    searchQuery: distributorSearchQuery,
    setSearchQuery: setDistributorSearchQuery,
    selectedStatus: distributorSelectedStatus,
    setSelectedStatus: setDistributorSelectedStatus,
    searchedRows: filteredDistributorRows,
  } = useColumnFilter<(typeof distributorList)[number]>(
    distributorList,
    ProductMapperTableHeadingsDistributor,
    value
  );

  const {
    searchQuery: distributorUnassignedSearchQuery,
    setSearchQuery: setDistributorUnassignedSearchQuery,
    selectedStatus: distributorUnassignedSelectedStatus,
    setSelectedStatus: setDistributorUnassignedSelectedStatus,
    searchedRows: filteredDistributorUnassignedRows,
  } = useColumnFilter<(typeof distributorList)[number]>(
    distributorList,
    ProductMapperTableHeadingsDistributor,
    value
  );

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Product - Distributor Mapping"
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
                columns={getColumnsWithTooltip(
                  ProductMapperTableHeadingsDistributor
                )}
                rows={filteredDistributorRows}
                rowCount={filteredDistributorRows.length}
                loading={loading}
                checkboxSelection
                density="compact"
                rowSelectionModel={assignSelectionRows}
                onRowSelectionModelChange={(newSelection) => {
                  setAssignSelectionRows((prev) => {
                    const visibleIds = filteredDistributorRows.map(
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
                      columns={ProductMapperTableHeadingsDistributor.filter(
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
            {/* UNASSIGN TAB PANEL */}
            <TabPanel value="2" sx={tabViewTable}>
              <DataGrid
                sx={{ ...dataGridStyleMappers }}
                getRowId={(row) => row.uId}
                columns={getColumnsWithTooltip(
                  ProductMapperTableHeadingsDistributor
                )}
                rows={filteredDistributorUnassignedRows}
                rowCount={filteredDistributorUnassignedRows.length}
                loading={loading}
                checkboxSelection
                density="compact"
                rowSelectionModel={unassignSelectionRows}
                onRowSelectionModelChange={(newSelection) => {
                  setUnassignSelectionRows((prev) => {
                    const visibleIds = filteredDistributorUnassignedRows.map(
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
                      columns={ProductMapperTableHeadingsDistributor.filter(
                        (col) => col.field !== "__check__"
                      )}
                      searchQuery={distributorUnassignedSearchQuery}
                      setSearchQuery={setDistributorUnassignedSearchQuery}
                      selectedStatus={distributorUnassignedSelectedStatus}
                      setSelectedStatus={setDistributorUnassignedSelectedStatus}
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

export default Distributor;
