"use client";

import React, { useEffect, useRef, useState } from "react";
import { PATH_DASHBOARD } from "@/routes/paths";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { useRouter } from "next/navigation";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import StoreRoundedIcon from "@mui/icons-material/StoreRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import PersonPinCircleRoundedIcon from "@mui/icons-material/PersonPinCircleRounded";
import { DataGrid } from "@mui/x-data-grid";
import { dataGridStyleMappers } from "@/styles/tableStyles/tableStyle";
import { dispatch, useSelector } from "@/redux/store";
import { getAllProductsByDistributorIdIsChecked } from "@/service/mapping-service/distributorProduct.service";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import {
  ProductMapperViewTableHeadingsAssign,
  tableOptions,
} from "./components/table-component-productMapper-view";
import PopupResponse from "@/components/popup/popup-response";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { OutletMapperViewTableHeadingsAssign } from "./components/table-component-outletMapper-view";
import { getAllOutletByDistributorIdIsChecked } from "@/service/mapping-service/distributorOutlet.service";
import { RouteMapperViewTableHeadingsAssign } from "./components/table-component-routeMapper-view";
import { getAllRoutesByDistributorIdIsChecked } from "@/service/mapping-service/distributorRoute.service";
import { getAllCompaniesByDistributorIdIsChecked } from "@/service/mapping-service/distributorCompany.service";
import { CompanyMapperTableHeadingsAssignView } from "./components/table-component-companyMapper-view";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { getAllRepresentativesByDistributorIdIsChecked } from "@/service/mapping-service/distributorRepresentative.service";
import { RepresentativeMapperViewTableHeadingsAssign } from "./components/table-component-representativeMapper-view";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const ProductDistributorViewAll = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const productList = useSelector(
    (state) => state.distributorProductSlice.distributorProductsIsTrue
  );
  const outletList = useSelector(
    (state) => state.distributorOutletSlice.distributorOutletsIsTrue
  );
  const routeList = useSelector(
    (state) => state.distributorRouteSlice.distributorRoutesIsTrue
  );
  const representativeList = useSelector(
    (state) =>
      state.distributorRepresentativeSlice.distributorRepresentativesIsTrue
  );
  const companyList = useSelector(
    (state) => state.distributorCompanySlice.companyDistributorsIsTrue
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const [value, setValue] = useState("1");
  const [loading, setLoading] = useState(false);
  const [serverDownError, setServerDownError] = useState(false);
  const [pageTitle, setPageTitle] = useState("Distributor - Product View");
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  const {
    searchQuery: representativeSearchQuery,
    setSearchQuery: setRepresentativeSearchQuery,
    selectedStatus: representativeSelectedStatus,
    setSelectedStatus: setRepresentativeSelectedStatus,
    searchedRows: searchedRepresentativeRows,
  } = useColumnFilter<(typeof representativeList)[number]>(
    representativeList,
    RepresentativeMapperViewTableHeadingsAssign,
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
    OutletMapperViewTableHeadingsAssign,
    value
  );

  const {
    searchQuery: productSearchQuery,
    setSearchQuery: setProductSearchQuery,
    selectedStatus: productSelectedStatus,
    setSelectedStatus: setProductSelectedStatus,
    searchedRows: searchedProductRows,
  } = useColumnFilter<(typeof productList)[number]>(
    productList,
    ProductMapperViewTableHeadingsAssign,
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
    CompanyMapperTableHeadingsAssignView,
    value
  );

  const {
    searchQuery: routeSearchQuery,
    setSearchQuery: setRouteSearchQuery,
    selectedStatus: routeSelectedStatus,
    setSelectedStatus: setRouteSelectedStatus,
    searchedRows: searchedRouteRows,
  } = useColumnFilter<(typeof routeList)[number]>(
    routeList,
    RouteMapperViewTableHeadingsAssign,
    value
  );

  const titles = {
    "1": "Distributor - Product View",
    "2": "Distributor - Outlet View",
    "3": "Distributor - Route View",
    "4": "Distributor - Sales Representative View",
    "5": "Distributor - Company View",
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setPageTitle(titles[newValue as keyof typeof titles]);
    setRepresentativeSearchQuery("");
    setRepresentativeSelectedStatus({});
    setOutletSearchQuery("");
    setOutletSelectedStatus({});
    setProductSearchQuery("");
    setProductSelectedStatus({});
    setCompanySearchQuery("");
    setCompanySelectedStatus({});
    setRouteSearchQuery("");
    setRouteSelectedStatus({});
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
        await getAllProductsByDistributorIdIsChecked(params.id);
      }
      if (value === "2") {
        await getAllOutletByDistributorIdIsChecked(params.id);
      }
      if (value === "3") {
        await getAllRoutesByDistributorIdIsChecked(params.id);
      }
      if (value === "4") {
        await getAllRepresentativesByDistributorIdIsChecked(params.id);
      }
      if (value === "5") {
        await getAllCompaniesByDistributorIdIsChecked(params.id);
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
            pageName: "Distributor Mapper",
            path: PATH_DASHBOARD.distributorMapper.list,
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
            <TabList onChange={handleChange} aria-label="Product Mapper Tabs">
              <Tab label="Product" value="1" icon={<CategoryRoundedIcon />} />
              <Tab label="Outlet" value="2" icon={<StoreRoundedIcon />} />
              <Tab label="Route" value="3" icon={<RouteRoundedIcon />} />
              <Tab
                label="Sales Representative"
                value="4"
                icon={<PersonPinCircleRoundedIcon />}
              />
              <Tab
                label="Company"
                value="5"
                icon={<PersonPinCircleRoundedIcon />}
              />
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
              getRowId={(row) => row.productUId}
              rows={searchedProductRows}
              loading={loading}
              columns={getColumnsWithTooltip(
                ProductMapperViewTableHeadingsAssign
              )}
              rowCount={searchedProductRows.length}
              pageSizeOptions={tableOptions.rowsPerPageOptions}
              disableRowSelectionOnClick
              density="compact"
              slots={{
                noRowsOverlay: CustomNoRowsOverlay,
                toolbar: () => (
                  <QuickSearchToolbar
                    columns={ProductMapperViewTableHeadingsAssign}
                    searchQuery={productSearchQuery}
                    setSearchQuery={setProductSearchQuery}
                    selectedStatus={productSelectedStatus}
                    setSelectedStatus={setProductSelectedStatus}
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
              getRowId={(row) => row.outletUId}
              rows={searchedOutletRows}
              loading={loading}
              columns={getColumnsWithTooltip(
                OutletMapperViewTableHeadingsAssign
              )}
              rowCount={searchedOutletRows.length}
              pageSizeOptions={tableOptions.rowsPerPageOptions}
              disableRowSelectionOnClick
              density="compact"
              slots={{
                noRowsOverlay: CustomNoRowsOverlay,
                toolbar: () => (
                  <QuickSearchToolbar
                    columns={OutletMapperViewTableHeadingsAssign}
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
              getRowId={(row) => row.routeUId}
              rows={searchedRouteRows}
              loading={loading}
              columns={getColumnsWithTooltip(
                RouteMapperViewTableHeadingsAssign
              )}
              rowCount={searchedRouteRows.length}
              pageSizeOptions={tableOptions.rowsPerPageOptions}
              disableRowSelectionOnClick
              density="compact"
              slots={{
                noRowsOverlay: CustomNoRowsOverlay,
                toolbar: () => (
                  <QuickSearchToolbar
                    columns={RouteMapperViewTableHeadingsAssign}
                    searchQuery={routeSearchQuery}
                    setSearchQuery={setRouteSearchQuery}
                    selectedStatus={routeSelectedStatus}
                    setSelectedStatus={setRouteSelectedStatus}
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
              getRowId={(row) => row.representativeUId}
              rows={searchedRepresentativeRows}
              loading={loading}
              columns={getColumnsWithTooltip(
                RepresentativeMapperViewTableHeadingsAssign
              )}
              rowCount={searchedRepresentativeRows.length}
              pageSizeOptions={tableOptions.rowsPerPageOptions}
              disableRowSelectionOnClick
              density="compact"
              slots={{
                noRowsOverlay: CustomNoRowsOverlay,
                toolbar: () => (
                  <QuickSearchToolbar
                    columns={RepresentativeMapperViewTableHeadingsAssign}
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
          {/****************  Table Panel 5 *****************/}
          <TabPanel
            value="5"
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
                CompanyMapperTableHeadingsAssignView
              )}
              rowCount={searchedCompanyRows.length}
              pageSizeOptions={tableOptions.rowsPerPageOptions}
              disableRowSelectionOnClick
              density="compact"
              slots={{
                noRowsOverlay: CustomNoRowsOverlay,
                toolbar: () => (
                  <QuickSearchToolbar
                    columns={CompanyMapperTableHeadingsAssignView}
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

export default ProductDistributorViewAll;
