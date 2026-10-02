"use client";

import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import { setOutletMessage } from "@/redux/slices/outlet-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  assignProductOutletMapping,
  unassignProductOutletMapping,
} from "@/service/mapping-service/productOutlet.service";
import { getAllOutlets } from "@/service/outlet.service";
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
import { ProductMapperTableHeadingsOutlet } from "./components/table-component-productMapper-distributor";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const Distributor = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const outletList = useSelector((state) => state.outlet.outlets);
  const productOutletMsg = useSelector((state) => state.outlet.message);
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setOutletSearchQuery("");
    setOutletSelectedStatus({});
    setOutletAssignedSearchQuery("");
    setOutletAssignedSelectedStatus({});
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
    if (productOutletMsg) {
      enqueueSnackbar(productOutletMsg, { variant: "success" });
      dispatch(setOutletMessage(null));
    }
  }, [productOutletMsg]);

  useEffect(() => {
    if (value) {
      setAssignSelectionRows([]);
      setUnassignSelectionRows([]);
    }
  }, [value]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await getAllOutlets(
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

  const createProductOutletMapping = async () => {
    const data = {
      productUIds: selectedRows,
      outletUIds: assignSelectionRows,
    };

    try {
      await assignProductOutletMapping(data);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      // dispatch(setDistributorProductMsg(null));
    }
  };

  const updateProductOutletMapping = async () => {
    const data = {
      productUIds: selectedRows,
      outletUIds: unassignSelectionRows,
    };
    try {
      await unassignProductOutletMapping(data);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      // dispatch(setDistributorProductMsg(null));
    }
  };

  const handleAssignClick = async () => {
    await createProductOutletMapping();
  };

  const handleUnassignClick = async () => {
    await updateProductOutletMapping();
  };

  const {
    searchQuery: outletSearchQuery,
    setSearchQuery: setOutletSearchQuery,
    selectedStatus: outletSelectedStatus,
    setSelectedStatus: setOutletSelectedStatus,
    searchedRows: filteredOutletRows,
  } = useColumnFilter<(typeof outletList)[number]>(
    outletList,
    ProductMapperTableHeadingsOutlet,
    value
  );

  const {
    searchQuery: outletAssignedSearchQuery,
    setSearchQuery: setOutletAssignedSearchQuery,
    selectedStatus: outletAssignedSelectedStatus,
    setSelectedStatus: setOutletAssignedSelectedStatus,
    searchedRows: filteredOutletAssignedRows,
  } = useColumnFilter<(typeof outletList)[number]>(
    outletList,
    ProductMapperTableHeadingsOutlet,
    value
  );

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Product - Outlet Mapping"
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
                columns={ProductMapperTableHeadingsOutlet}
                rows={filteredOutletRows}
                rowCount={filteredOutletRows.length}
                loading={loading}
                checkboxSelection
                density="compact"
                rowSelectionModel={assignSelectionRows}
                onRowSelectionModelChange={(newSelection) => {
                  setAssignSelectionRows((prev) => {
                    const visibleIds = filteredOutletRows.map((row) => row.uId);
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
                      columns={ProductMapperTableHeadingsOutlet.filter(
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
            {/* UNASSIGN TAB PANEL */}
            <TabPanel value="2" sx={tabViewTable}>
              <DataGrid
                sx={{ ...dataGridStyleMappers }}
                getRowId={(row) => row.uId}
                columns={ProductMapperTableHeadingsOutlet}
                rows={filteredOutletAssignedRows}
                rowCount={filteredOutletAssignedRows.length}
                loading={loading}
                checkboxSelection
                density="compact"
                rowSelectionModel={unassignSelectionRows}
                onRowSelectionModelChange={(newSelection) => {
                  setUnassignSelectionRows((prev) => {
                    const visibleIds = filteredOutletAssignedRows.map(
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
                      columns={ProductMapperTableHeadingsOutlet.filter(
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
    </FsBox>
  );
};

export default Distributor;
