"use client";

import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
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
import QuickSearchToolbar from "../product/components/search-filter";
import { OutletsMapperTableHeadingsAssign } from "./components/table-component-representativeMapper-outlet";
import { setRepresentativeOutletsMsg } from "@/redux/slices/mappers/representative-outlet";
import {
  assignRepresentativeOutletMapping,
  unassignRepresentativeOutletMapping,
} from "@/service/mapping-service/representativeOutlet.service";
import { getAllOutlets } from "@/service/outlet.service";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const OutletMapper = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const outletList = useSelector((state) => state.outlet.outlets);
  const outletRepMsg = useSelector(
    (state) => state.outletsRepresentativeSlice.representativeOutletsMsg
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setOutletSearchQuery("");
    setOutletSelectedStatus({});
    setOutletUnassignedSearchQuery("");
    setOutletUnassignedSelectedStatus({});
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
    if (outletRepMsg) {
      enqueueSnackbar(outletRepMsg, { variant: "success" });
      dispatch(setRepresentativeOutletsMsg(null));
    }
  }, [outletRepMsg]);

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

  const createOutletRepresentativeMapping = async () => {
    const data = {
      representativeUIds: selectedRows,
      outletUIds: assignSelectionRows,
    };

    try {
      await assignRepresentativeOutletMapping(data);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
    }
  };

  const updateOutletRepresentativeMapping = async () => {
    const data = {
      representativeUIds: selectedRows,
      outletUIds: unassignSelectionRows,
    };
    try {
      await unassignRepresentativeOutletMapping(data);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
    }
  };

  const handleAssignClick = async () => {
    await createOutletRepresentativeMapping();
  };

  const handleUnassignClick = async () => {
    await updateOutletRepresentativeMapping();
  };

  const {
    searchQuery: outletSearchQuery,
    setSearchQuery: setOutletSearchQuery,
    selectedStatus: outletSelectedStatus,
    setSelectedStatus: setOutletSelectedStatus,
    searchedRows: filteredOutletRows,
  } = useColumnFilter<(typeof outletList)[number]>(
    outletList,
    OutletsMapperTableHeadingsAssign,
    value
  );

  const {
    searchQuery: outletUnassignedSearchQuery,
    setSearchQuery: setOutletUnassignedSearchQuery,
    selectedStatus: outletUnassignedSelectedStatus,
    setSelectedStatus: setOutletUnassignedSelectedStatus,
    searchedRows: filteredOutletUnassignedRows,
  } = useColumnFilter<(typeof outletList)[number]>(
    outletList,
    OutletsMapperTableHeadingsAssign,
    value
  );

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Representative - Outlet Mapping"
        pageNavigation={[
          {
            pageName: "Representative Mapping",
            path: PATH_DASHBOARD.representativeMapper.list,
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
                columns={OutletsMapperTableHeadingsAssign}
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
                      columns={OutletsMapperTableHeadingsAssign.filter(
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
                columns={OutletsMapperTableHeadingsAssign}
                rows={filteredOutletUnassignedRows}
                rowCount={filteredOutletUnassignedRows.length}
                loading={loading}
                checkboxSelection
                density="compact"
                rowSelectionModel={unassignSelectionRows}
                onRowSelectionModelChange={(newSelection) => {
                  setUnassignSelectionRows((prev) => {
                    const visibleIds = filteredOutletUnassignedRows.map(
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
                      columns={OutletsMapperTableHeadingsAssign.filter(
                        (col) => col.field !== "__check__"
                      )}
                      searchQuery={outletUnassignedSearchQuery}
                      setSearchQuery={setOutletUnassignedSearchQuery}
                      selectedStatus={outletUnassignedSelectedStatus}
                      setSelectedStatus={setOutletUnassignedSelectedStatus}
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

export default OutletMapper;
