"use client";

import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import PopupResponse from "@/components/popup/popup-response";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import PersonPinCircleRoundedIcon from "@mui/icons-material/PersonPinCircleRounded";
import StoreRoundedIcon from "@mui/icons-material/StoreRounded";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyleMappers } from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import QuickSearchToolbar from "../../../company-mapper/components/search-filter";
import {
  DiscountToDistributorMapperViewTableHeadingsAssign,
  tableOptions,
} from "./components/table-component-distributorMapper-view";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { getAllDistributorsByDiscountIdIsTrue } from "@/service/mapping-service/discountDistributor.service";
import { DiscountToRepresentativeMapperViewTableHeadingsAssign } from "./components/table-component-representativeMapper-view";
import { getAllRepresentativeByDiscountIdIsTrue } from "@/service/mapping-service/discountRepresentative.service";
import { getAllOutletsByDiscountIdIsTrue } from "@/service/mapping-service/discountOutlet.service";
import { DiscountToOutletMapperViewTableHeadingsAssign } from "./components/table-component-outletMapper-view";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const DiscountMappingsViewAll = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const distributorList = useSelector(
    (state) => state.discountDistributorSlice.discountDistributorsIsTrue
  );
  const representativeList = useSelector(
    (state) => state.discountRepresentativeSlice.discountRepresentativesIsTrue
  );
  const discountOutletList = useSelector(
    (state) => state.discountOutletSlice.discountOutletsIsTrue
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const [value, setValue] = useState("1");
  const [loading, setLoading] = useState(false);
  const [serverDownError, setServerDownError] = useState(false);
  const [pageTitle, setPageTitle] = useState("Discount - Distributor View");

  const titles = {
    "1": "Discount - Distributor View",
    "2": "Discount - Representative View",
    "3": "Discount - Outlet View",
  };

  const [isFullScreen, setIsFullScreen] = useState(false);

  const {
    searchQuery: distributorSearchQuery,
    setSearchQuery: setDistributorSearchQuery,
    selectedStatus: distributorSelectedStatus,
    setSelectedStatus: setDistributorSelectedStatus,
    searchedRows: searchedDistributorRows,
  } = useColumnFilter<(typeof distributorList)[number]>(
    distributorList,
    DiscountToDistributorMapperViewTableHeadingsAssign,
    value
  );

  const {
    searchQuery: representativeSearchQuery,
    setSearchQuery: setRepresentativeSearchQuery,
    selectedStatus: representativeSelectedStatus,
    setSelectedStatus: setRepresentativeSelectedStatus,
    searchedRows: searchedRepresentativeRows,
  } = useColumnFilter<(typeof representativeList)[number]>(
    representativeList,
    DiscountToRepresentativeMapperViewTableHeadingsAssign,
    value
  );

  const {
    searchQuery: discountOutletSearchQuery,
    setSearchQuery: setDiscountOutletSearchQuery,
    selectedStatus: discountOutletSelectedStatus,
    setSelectedStatus: setDiscountOutletSelectedStatus,
    searchedRows: searchedOutletRows,
  } = useColumnFilter<(typeof discountOutletList)[number]>(
    discountOutletList,
    DiscountToOutletMapperViewTableHeadingsAssign,
    value
  );

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setPageTitle(titles[newValue as keyof typeof titles]);
    setDistributorSearchQuery("");
    setDistributorSelectedStatus({});
    setRepresentativeSearchQuery("");
    setRepresentativeSelectedStatus({});
    setDiscountOutletSearchQuery("");
    setDiscountOutletSelectedStatus({});
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (value === "1") {
        await getAllDistributorsByDiscountIdIsTrue(params.id);
      }
      if (value === "2") {
        await getAllRepresentativeByDiscountIdIsTrue(params.id);
      }
      if (value === "3") {
        await getAllOutletsByDiscountIdIsTrue(params.id);
      }
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, value]);

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={pageTitle}
        pageNavigation={[
          {
            pageName: "Discount Mapper",
            path: PATH_DASHBOARD.discountMapper.list,
          },
          { pageName: "View" },
        ]}
        onLinkClick={handleBreadcrumbNavigation}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <Box sx={{ width: "100%", typography: "body1" }}></Box>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="Discount Mapper Tabs">
              <Tab label="Distributor" value="1" icon={<LocalShippingIcon />} />
              <Tab
                label="Representative"
                value="2"
                icon={<PersonPinCircleRoundedIcon />}
              />
              <Tab label="Outlet" value="3" icon={<StoreRoundedIcon />} />
            </TabList>
          </Box>
          {/****************  Table Panel 1 *****************/}
          <TabPanel
            value="1"
            sx={{
              padding: 2,
              marginTop: 0,
              paddingBottom: 0,
            }}
          >
            <DataGrid
              sx={{ ...dataGridStyleMappers }}
              getRowId={(row) => row.distributorUId}
              rows={searchedDistributorRows}
              loading={loading}
              columns={getColumnsWithTooltip(
                DiscountToDistributorMapperViewTableHeadingsAssign
              )}
              rowCount={searchedDistributorRows.length}
              pageSizeOptions={tableOptions.rowsPerPageOptions}
              disableRowSelectionOnClick
              density="compact"
              slots={{
                noRowsOverlay: CustomNoRowsOverlay,
                toolbar: () => (
                  <QuickSearchToolbar
                    columns={DiscountToDistributorMapperViewTableHeadingsAssign}
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
              rows={searchedRepresentativeRows}
              loading={loading}
              columns={getColumnsWithTooltip(
                DiscountToRepresentativeMapperViewTableHeadingsAssign
              )}
              rowCount={searchedRepresentativeRows.length}
              pageSizeOptions={tableOptions.rowsPerPageOptions}
              disableRowSelectionOnClick
              density="compact"
              slots={{
                noRowsOverlay: CustomNoRowsOverlay,
                toolbar: () => (
                  <QuickSearchToolbar
                    columns={
                      DiscountToRepresentativeMapperViewTableHeadingsAssign
                    }
                    searchQuery={representativeSearchQuery}
                    setSearchQuery={setRepresentativeSearchQuery}
                    selectedStatus={representativeSelectedStatus}
                    setSelectedStatus={setRepresentativeSelectedStatus}
                    menuItem={{
                      field: "searchColumn",
                      headerName: "Search By",
                    }}
                  />
                ),
              }}
            />
          </TabPanel>
          {/****************  Table Panel 3 *****************/}
          <TabPanel
            value="3"
            sx={{
              padding: 2,
              marginTop: 0,
              paddingBottom: 0,
            }}
          >
            <DataGrid
              sx={{ ...dataGridStyleMappers }}
              getRowId={(row) => row.outletUID}
              rows={searchedOutletRows}
              loading={loading}
              columns={getColumnsWithTooltip(
                DiscountToOutletMapperViewTableHeadingsAssign
              )}
              rowCount={searchedOutletRows.length}
              pageSizeOptions={tableOptions.rowsPerPageOptions}
              disableRowSelectionOnClick
              density="compact"
              slots={{
                noRowsOverlay: CustomNoRowsOverlay,
                toolbar: () => (
                  <QuickSearchToolbar
                    columns={DiscountToOutletMapperViewTableHeadingsAssign}
                    searchQuery={discountOutletSearchQuery}
                    setSearchQuery={setDiscountOutletSearchQuery}
                    selectedStatus={discountOutletSelectedStatus}
                    setSelectedStatus={setDiscountOutletSelectedStatus}
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

export default DiscountMappingsViewAll;
