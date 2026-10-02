"use client";

import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { handleBreadcrumbNavigation } from "@/utils/breadcrumbNavigation";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import QuickSearchToolbarIcons from "./components/search-filter-icons";
import { getAllProductsMapping } from "@/service/product.service";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import {
  ProductMapperTableHeadings,
  tableOptions,
} from "./components/table-component-productMapper";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const ProductMapper = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const productList = useSelector((state) => state.product.products);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const [isFullScreen, setIsFullScreen] = useState(false);

  const {
    searchedRows,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
  } = useColumnFilter(productList, ProductMapperTableHeadings);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedRows.length > 0) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [selectedRows]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await getAllProductsMapping();
    } catch (error) {
      dispatch(setPopupResponse(true));
    } finally {
      setLoading(false);
    }
  };

  const handleDistributorClick = () => {
    const selectedRowsString = JSON.stringify(selectedRows);
    router.push(
      `${
        PATH_DASHBOARD.productMapper.distributor
      }?selectedRows=${encodeURIComponent(selectedRowsString)}`
    );
  };

  const handleOutletClick = () => {
    const selectedRowsString = JSON.stringify(selectedRows);
    router.push(
      `${PATH_DASHBOARD.productMapper.outlet}?selectedRows=${encodeURIComponent(
        selectedRowsString
      )}`
    );
  };

  const handleSalesRepClick = () => {
    const selectedRowsString = JSON.stringify(selectedRows);
    router.push(
      `${
        PATH_DASHBOARD.productMapper.salesRep
      }?selectedRows=${encodeURIComponent(selectedRowsString)}`
    );
  };

  const handleCompanyClick = () => {
    const selectedRowsString = JSON.stringify(selectedRows);
    router.push(
      `${
        PATH_DASHBOARD.productMapper.company
      }?selectedRows=${encodeURIComponent(selectedRowsString)}`
    );
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Product Mapping"
        pageNavigation={[{ pageName: "Product Mapping" }, { pageName: "List" }]}
        onFullScreenClick={handleFullScreenClick}
        onLinkClick={(path: any) => handleBreadcrumbNavigation(path, router)}
      />

      <Container>
        <TableContainer>
          <DataGrid
            sx={{ ...dataGridStyle }}
            columns={getColumnsWithTooltip(ProductMapperTableHeadings)}
            rows={searchedRows}
            getRowId={(row) => row.uId}
            loading={loading}
            rowCount={searchedRows.length}
            pageSizeOptions={tableOptions.rowsPerPageOptions}
            checkboxSelection
            density="compact"
            onRowSelectionModelChange={(newSelection) => {
              setSelectedRows(newSelection);
            }}
            slots={{
              noRowsOverlay: CustomNoRowsOverlay,
              toolbar: () => (
                <QuickSearchToolbarIcons
                  handleDistributorClick={handleDistributorClick}
                  handleOutletClick={handleOutletClick}
                  handleSalesRepClick={handleSalesRepClick}
                  handleCompanyClick={handleCompanyClick}
                  isDisabled={isDisabled}
                  columns={ProductMapperTableHeadings.filter(
                    (col) => col.field !== "actions"
                  )}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                  menuItem={{
                    field: "searchColumn",
                    headerName: "Search By",
                  }}
                />
              ),
            }}
          />
        </TableContainer>
      </Container>
    </FsBox>
  );
};

export default ProductMapper;
