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
import QuickSearchToolbar from "../distributor/components/search-filter";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { DiscountMapperTableHeadingsRepresentative } from "./components/table-component-repMapper-assign";
import {
  assignDiscountRepresentativeMapping,
  getAllRepresentativeView,
  unassignDiscountRepresentativeMapping,
} from "@/service/mapping-service/discountRepresentative.service";
import { setSalesRepresentativeMessage } from "@/redux/slices/sales-representative-slice";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const Representative = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const representativeList = useSelector(
    (state) => state.salesRepresentativeSlice.salesRepresentativeDetails
  );
  const discountRepresentativeMsg = useSelector(
    (state) => state.salesRepresentativeSlice.message
  );
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setRepSearchQuery("");
    setRepSelectedStatus({});
    setRepAssignedSearchQuery("");
    setRepAssignedSelectedStatus({});
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
    if (discountRepresentativeMsg) {
      enqueueSnackbar(discountRepresentativeMsg, { variant: "success" });
      dispatch(setSalesRepresentativeMessage(null));
    }
  }, [discountRepresentativeMsg]);

  useEffect(() => {
    if (value) {
      setAssignSelectionRows([]);
      setUnassignSelectionRows([]);
    }
  }, [value]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await getAllRepresentativeView(
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

  const createDiscountRepresentativeMapping = async () => {
    const data = {
      discountId: selectedRows,
      repUId: assignSelectionRows,
    };

    try {
      await assignDiscountRepresentativeMapping(data);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
    }
  };

  const updateDiscountRepresentativeMapping = async () => {
    const data = {
      discountId: selectedRows,
      repUId: unassignSelectionRows,
    };
    try {
      await unassignDiscountRepresentativeMapping(data);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
    }
  };

  const handleAssignClick = async () => {
    await createDiscountRepresentativeMapping();
  };

  const handleUnassignClick = async () => {
    await updateDiscountRepresentativeMapping();
  };

  const {
    searchQuery: repSearchQuery,
    setSearchQuery: setRepSearchQuery,
    selectedStatus: repSelectedStatus,
    setSelectedStatus: setRepSelectedStatus,
    searchedRows: filteredRepRows,
  } = useColumnFilter<(typeof representativeList)[number]>(
    representativeList,
    DiscountMapperTableHeadingsRepresentative,
    value
  );

  const {
    searchQuery: repAssignedSearchQuery,
    setSearchQuery: setRepAssignedSearchQuery,
    selectedStatus: repAssignedSelectedStatus,
    setSelectedStatus: setRepAssignedSelectedStatus,
    searchedRows: filteredRepAssignedRows,
  } = useColumnFilter<(typeof representativeList)[number]>(
    representativeList,
    DiscountMapperTableHeadingsRepresentative,
    value
  );

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Discount - Representative Mapping"
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
                columns={DiscountMapperTableHeadingsRepresentative}
                rows={filteredRepRows}
                rowCount={filteredRepRows.length}
                loading={loading}
                checkboxSelection
                density="compact"
                rowSelectionModel={assignSelectionRows}
                onRowSelectionModelChange={(newSelection) => {
                  setAssignSelectionRows((prev) => {
                    const visibleIds = filteredRepRows.map((row) => row.uId);
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
                      columns={DiscountMapperTableHeadingsRepresentative.filter(
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
            {/* UNASSIGN TAB PANEL */}
            <TabPanel value="2" sx={tabViewTable}>
              <DataGrid
                sx={{ ...dataGridStyleMappers }}
                getRowId={(row) => row.uId}
                columns={DiscountMapperTableHeadingsRepresentative}
                rows={filteredRepAssignedRows}
                rowCount={filteredRepAssignedRows.length}
                loading={loading}
                checkboxSelection
                density="compact"
                rowSelectionModel={unassignSelectionRows}
                onRowSelectionModelChange={(newSelection) => {
                  setUnassignSelectionRows((prev) => {
                    const visibleIds = filteredRepAssignedRows.map(
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
                      columns={DiscountMapperTableHeadingsRepresentative.filter(
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
    </FsBox>
  );
};

export default Representative;
