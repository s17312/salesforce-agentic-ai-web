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
import { DataGrid } from "@mui/x-data-grid";
import { dataGridStyleMappers } from "@/styles/tableStyles/tableStyle";
import { dispatch, useSelector } from "@/redux/store";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import {
  ProductMapperViewTableHeadingsAssign,
  tableOptions,
} from "./components/table-component-productMapper-view";
import PopupResponse from "@/components/popup/popup-response";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { getAllProductByRepresentativeId } from "@/service/mapping-service/productRepresentative.service";
import { RouteMappedViewTableHeadingsAssign } from "./components/table-component-routeMapper-view";
import { getAllRouteByRepresentativeId } from "@/service/mapping-service/representativeRoute.service";
import { OutletMappedViewTableHeadingsAssign } from "./components/table-component-outletMapper-view";
import { getAllOutletByRepresentativeId } from "@/service/mapping-service/representativeOutlet.service";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const RepresentativeViewAll = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const productList = useSelector(
    (state) => state.productRepresentativeSlice.assignedProduct
  );
  const routeList = useSelector(
    (state) => state.routesRepresentativeSlice.assignedRoute
  );
  const outletList = useSelector(
    (state) => state.outletsRepresentativeSlice.assignedOutlet
  );

  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const [value, setValue] = useState("1");
  const [loading, setLoading] = useState(false);
  const [serverDownError, setServerDownError] = useState(false);
  const [pageTitle, setPageTitle] = useState("Representative - Product View");

  const titles = {
    "1": "Representative - Product View",
    "2": "Representative - Route View",
    "3": "Representative - Outlet View",
  };

  const [isFullScreen, setIsFullScreen] = useState(false);

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
    searchQuery: routeSearchQuery,
    setSearchQuery: setRouteSearchQuery,
    selectedStatus: routeSelectedStatus,
    setSelectedStatus: setRouteSelectedStatus,
    searchedRows: searchedRouteRows,
  } = useColumnFilter<(typeof routeList)[number]>(
    routeList,
    RouteMappedViewTableHeadingsAssign,
    value
  );

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setPageTitle(titles[newValue as keyof typeof titles]);
    setOutletSearchQuery("");
    setOutletSelectedStatus({});
    setProductSearchQuery("");
    setProductSelectedStatus({});
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
        await getAllProductByRepresentativeId(params.id);
      }
      if (value === "2") {
        await getAllRouteByRepresentativeId(params.id);
      }
      if (value === "3") {
        await getAllOutletByRepresentativeId(params.id);
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
            pageName: "Representative Mapper",
            path: PATH_DASHBOARD.representativeMapper.list,
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
              <Tab label="Route" value="2" icon={<RouteRoundedIcon />} />
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
              getRowId={(row) => row.routeUId}
              rows={searchedRouteRows}
              loading={loading}
              columns={getColumnsWithTooltip(
                RouteMappedViewTableHeadingsAssign
              )}
              rowCount={searchedRouteRows.length}
              pageSizeOptions={tableOptions.rowsPerPageOptions}
              disableRowSelectionOnClick
              density="compact"
              slots={{
                noRowsOverlay: CustomNoRowsOverlay,
                toolbar: () => (
                  <QuickSearchToolbar
                    columns={RouteMappedViewTableHeadingsAssign}
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

export default RepresentativeViewAll;
