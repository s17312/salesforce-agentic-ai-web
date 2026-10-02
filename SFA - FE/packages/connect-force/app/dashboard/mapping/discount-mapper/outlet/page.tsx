"use client";

import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import { setOutletMessage } from "@/redux/slices/outlet-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
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
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { DiscountMapperTableHeadingsOutlet } from "./components/table-component-outletMapper-assign";
import {
  assignDiscountOutletMapping,
  getAllOutletsView,
  unassignDiscountOutletMapping,
} from "@/service/mapping-service/discountOutlet.service";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const Outlet = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const outletList = useSelector((state) => state.outlet.outlets);
  const discountOutletMsg = useSelector((state) => state.outlet.message);
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
    if (discountOutletMsg) {
      enqueueSnackbar(discountOutletMsg, { variant: "success" });
      dispatch(setOutletMessage(null));
    }
  }, [discountOutletMsg]);

  useEffect(() => {
    if (value) {
      setAssignSelectionRows([]);
      setUnassignSelectionRows([]);
    }
  }, [value]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await getAllOutletsView(
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

  const createDiscountOutletMapping = async () => {
    const data = {
      discountUId: selectedRows,
      outletUId: assignSelectionRows,
    };

    try {
      await assignDiscountOutletMapping(data);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
    }
  };

  const updateDiscountOutletMapping = async () => {
    const data = {
      discountId: selectedRows,
      outletUId: unassignSelectionRows,
    };
    try {
      await unassignDiscountOutletMapping(data);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
    }
  };

  const handleAssignClick = async () => {
    await createDiscountOutletMapping();
  };

  const handleUnassignClick = async () => {
    await updateDiscountOutletMapping();
  };

  const {
    searchQuery: outletSearchQuery,
    setSearchQuery: setOutletSearchQuery,
    selectedStatus: outletSelectedStatus,
    setSelectedStatus: setOutletSelectedStatus,
    searchedRows: filteredOutletRows,
  } = useColumnFilter<(typeof outletList)[number]>(
    outletList,
    DiscountMapperTableHeadingsOutlet,
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
    DiscountMapperTableHeadingsOutlet,
    value
  );

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Discount - Outlet Mapping"
        pageNavigation={[
          {
            pageName: "Discount Mapping",
            path: PATH_DASHBOARD.discountMapper.list,
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
                columns={DiscountMapperTableHeadingsOutlet}
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
                      columns={DiscountMapperTableHeadingsOutlet.filter(
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
                columns={DiscountMapperTableHeadingsOutlet}
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
                      columns={DiscountMapperTableHeadingsOutlet.filter(
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

export default Outlet;
