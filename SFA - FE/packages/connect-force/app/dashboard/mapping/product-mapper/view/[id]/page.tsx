"use client";

import React, { useEffect, useRef, useState } from "react";
import { PATH_DASHBOARD } from "@/routes/paths";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { useRouter } from "next/navigation";
import PersonPinCircleRoundedIcon from "@mui/icons-material/PersonPinCircleRounded";
import StoreRoundedIcon from "@mui/icons-material/StoreRounded";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { DataGrid } from "@mui/x-data-grid";
import { dataGridStyleMappers } from "@/styles/tableStyles/tableStyle";
import { dispatch, useSelector } from "@/redux/store";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import PopupResponse from "@/components/popup/popup-response";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { getAllRepresentativeByProductIdIsTrue } from "@/service/mapping-service/productRepresentative.service";
import { OutletMappedViewTableHeadingsAssign } from "./components/table-component-outletMapper-view";
import { getAllOutletByProductIdIsTrue } from "@/service/mapping-service/productOutlet.service";
import { getAllDistributorsByProductIdIsTrue } from "@/service/mapping-service/distributorProduct.service";
import { getAllCompaniesByProductIdIsTrue } from "@/service/mapping-service/companyProduct.service";
import {
  CompanyMappedViewTableHeadingsAssign,
  tableOptions,
} from "./components/table-component-companyMapper-view";
import { DistributorMappedViewTableHeadingsAssign } from "./components/table-component-distributedMapper-view";
import { RepresentativeMappedViewTableHeadingsAssign } from "./components/table-component-salesRepMapper-view";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const ProductMappingViewAll = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const companyList = useSelector(
    (state) => state.companyProductsSlice.companyByProductsIsTrue
  );
  const distributorList = useSelector(
    (state) => state.distributorProductSlice.distributorProductsByIsTrue
  );
  const outletList = useSelector(
    (state) => state.productOutletSlice.productOutletsIsTrue
  );
  const representativeList = useSelector(
    (state) => state.productRepresentativeSlice.representativeProductsIsTrue
  );

  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const [value, setValue] = useState("1");
  const [loading, setLoading] = useState(false);
  const [serverDownError, setServerDownError] = useState(false);
  const [pageTitle, setPageTitle] = useState("Product - Company View");
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  const titles = {
    "1": "Product - Company View",
    "2": "Product - Distributor View",
    "3": "Product - Representative View",
    "4": "Product - Outlet View",
  };

  const {
    searchQuery: distributorSearchQuery,
    setSearchQuery: setDistributorSearchQuery,
    selectedStatus: distributorSelectedStatus,
    setSelectedStatus: setDistributorSelectedStatus,
    searchedRows: searchedDistributorRows,
  } = useColumnFilter<(typeof distributorList)[number]>(
    distributorList,
    DistributorMappedViewTableHeadingsAssign,
    value
  );

  const {
    searchQuery: companySearchQuery,
    setSearchQuery: setCompanySearchQuery,
    selectedStatus: companySelectedStatus,
    setSelectedStatus: setCompanySelectedStatus,
    searchedRows: searchedCompanyRows,
  } = useColumnFilter<(typeof companyList)[number]>(
    companyList,
    CompanyMappedViewTableHeadingsAssign,
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
    RepresentativeMappedViewTableHeadingsAssign,
    value
  );

  const {
    searchQuery: outletSearchQuery,
    setSearchQuery: setOutletSearchQuery,
    selectedStatus: outletSelectedStatus,
    setSelectedStatus: setOutletSelectedStatus,
    searchedRows: searchedOutletRows,
  } = useColumnFilter<(typeof outletList)[number]>(
    outletList,
    OutletMappedViewTableHeadingsAssign,
    value
  );

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setPageTitle(titles[newValue as keyof typeof titles]);
    setDistributorSearchQuery("");
    setDistributorSelectedStatus({});
    setRepresentativeSearchQuery("");
    setRepresentativeSelectedStatus({});
    setOutletSearchQuery("");
    setOutletSelectedStatus({});
    setCompanySearchQuery("");
    setCompanySelectedStatus({});
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
        await getAllCompaniesByProductIdIsTrue(params.id);
      }
      if (value === "2") {
        await getAllDistributorsByProductIdIsTrue(params.id);
      }
      if (value === "3") {
        await getAllRepresentativeByProductIdIsTrue(params.id);
      }
      if (value === "4") {
        await getAllOutletByProductIdIsTrue(params.id);
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
            pageName: "Product Mapper",
            path: PATH_DASHBOARD.productMapper.list,
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
            <TabList onChange={handleChange} aria-label="Company Mapper Tabs">
              <Tab
                label="Company"
                value="1"
                icon={<PersonPinCircleRoundedIcon />}
              />
              <Tab label="Distributor" value="2" icon={<LocalShippingIcon />} />
              <Tab
                label="Representative"
                value="3"
                icon={<PersonPinCircleRoundedIcon />}
              />
              <Tab label="Outlet" value="4" icon={<StoreRoundedIcon />} />
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
              getRowId={(row) => row.companyUId}
              rows={searchedCompanyRows}
              loading={loading}
              columns={getColumnsWithTooltip(
                CompanyMappedViewTableHeadingsAssign
              )}
              rowCount={searchedCompanyRows.length}
              pageSizeOptions={tableOptions.rowsPerPageOptions}
              disableRowSelectionOnClick
              density="compact"
              slots={{
                noRowsOverlay: CustomNoRowsOverlay,
                toolbar: () => (
                  <QuickSearchToolbar
                    columns={CompanyMappedViewTableHeadingsAssign}
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
              getRowId={(row) => row.distributorUId}
              rows={searchedDistributorRows}
              loading={loading}
              columns={getColumnsWithTooltip(
                DistributorMappedViewTableHeadingsAssign
              )}
              rowCount={searchedDistributorRows.length}
              pageSizeOptions={tableOptions.rowsPerPageOptions}
              disableRowSelectionOnClick
              density="compact"
              slots={{
                noRowsOverlay: CustomNoRowsOverlay,
                toolbar: () => (
                  <QuickSearchToolbar
                    columns={DistributorMappedViewTableHeadingsAssign}
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
              getRowId={(row) => row.representativeUId}
              rows={searchedRepresentativeRows}
              loading={loading}
              columns={getColumnsWithTooltip(
                RepresentativeMappedViewTableHeadingsAssign
              )}
              rowCount={searchedRepresentativeRows.length}
              pageSizeOptions={tableOptions.rowsPerPageOptions}
              disableRowSelectionOnClick
              density="compact"
              slots={{
                noRowsOverlay: CustomNoRowsOverlay,
                toolbar: () => (
                  <QuickSearchToolbar
                    columns={RepresentativeMappedViewTableHeadingsAssign}
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
          {/****************  Table Panel 4 *****************/}
          <TabPanel
            value="4"
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
                OutletMappedViewTableHeadingsAssign
              )}
              rowCount={searchedOutletRows.length}
              pageSizeOptions={tableOptions.rowsPerPageOptions}
              disableRowSelectionOnClick
              density="compact"
              slots={{
                noRowsOverlay: CustomNoRowsOverlay,
                toolbar: () => (
                  <QuickSearchToolbar
                    columns={OutletMappedViewTableHeadingsAssign}
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

export default ProductMappingViewAll;
