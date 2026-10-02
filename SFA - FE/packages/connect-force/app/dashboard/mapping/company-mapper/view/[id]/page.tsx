"use client";

import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import PopupResponse from "@/components/popup/popup-response";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllProductsByCompanyIdIsTrue } from "@/service/mapping-service/companyProduct.service";
import { getAllDistributorsByCompanyIdIsChecked } from "@/service/mapping-service/distributorCompany.service";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyleMappers } from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import QuickSearchToolbar from "../../../company-mapper/components/search-filter";
import {
  DistributorToCompanyMapperViewTableHeadingsAssign,
  tableOptions,
} from "./components/table-component-distributorMapper-view";
import { ProductMapperViewTableHeadingsAssign } from "./components/table-component-productMapper";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const CompanyMappingsViewAll = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const distributorList = useSelector(
    (state) => state.distributorCompanySlice.distributorCompaniesIsTrue
  );

  const productList = useSelector(
    (state) => state.companyProductsSlice.companyProductsIsTrue
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const [value, setValue] = useState("1");
  const [loading, setLoading] = useState(false);
  const [serverDownError, setServerDownError] = useState(false);
  const [pageTitle, setPageTitle] = useState("Company - Product View");

  const titles = {
    "1": "Company - Product View",
    "2": "Company - Distributor View",
  };

  const [isFullScreen, setIsFullScreen] = useState(false);

  const {
    searchQuery: productSearchQuery,
    setSearchQuery: setProductSearchQuery,
    selectedStatus: productSelectedStatus,
    setSelectedStatus: setProductSelectedStatus,
    searchedRows: filteredProductRows,
  } = useColumnFilter<(typeof productList)[number]>(
    productList,
    ProductMapperViewTableHeadingsAssign,
    value
  );

  const {
    searchQuery: distributorSearchQuery,
    setSearchQuery: setDistributorSearchQuery,
    selectedStatus: distributorSelectedStatus,
    setSelectedStatus: setDistributorSelectedStatus,
    searchedRows: filteredDistributorRows,
  } = useColumnFilter<(typeof distributorList)[number]>(
    distributorList,
    DistributorToCompanyMapperViewTableHeadingsAssign,
    value
  );

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setPageTitle(titles[newValue as keyof typeof titles]);
    setProductSearchQuery("");
    setProductSelectedStatus({});
    setDistributorSearchQuery("");
    setDistributorSelectedStatus({});
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
        await getAllProductsByCompanyIdIsTrue(params.id);
      }
      if (value === "2") {
        await getAllDistributorsByCompanyIdIsChecked(params.id);
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
            pageName: "Company Mapper",
            path: PATH_DASHBOARD.companyMapper.list,
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
              <Tab label="Distributor" value="2" icon={<LocalShippingIcon />} />
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
              rows={filteredProductRows}
              loading={loading}
              columns={getColumnsWithTooltip(
                ProductMapperViewTableHeadingsAssign
              )}
              rowCount={filteredProductRows.length}
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
              getRowId={(row) => row.distributorUId}
              rows={filteredDistributorRows}
              loading={loading}
              columns={getColumnsWithTooltip(
                DistributorToCompanyMapperViewTableHeadingsAssign
              )}
              rowCount={filteredDistributorRows.length}
              pageSizeOptions={tableOptions.rowsPerPageOptions}
              disableRowSelectionOnClick
              density="compact"
              slots={{
                noRowsOverlay: CustomNoRowsOverlay,
                toolbar: () => (
                  <QuickSearchToolbar
                    columns={DistributorToCompanyMapperViewTableHeadingsAssign}
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

export default CompanyMappingsViewAll;
