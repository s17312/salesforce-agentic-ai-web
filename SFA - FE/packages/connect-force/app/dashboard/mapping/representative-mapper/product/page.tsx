"use client";

import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import { setRepresentativeProductsMsg } from "@/redux/slices/mappers/product-representative";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  assignProductRepresentativeMapping,
  unassignProductRepresentativeMapping,
} from "@/service/mapping-service/productRepresentative.service";
import { getAllActiveProducts } from "@/service/product.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  dataGridStyleMappers,
  tabViewTable,
} from "@/styles/tableStyles/tableStyle";
import { handleBreadcrumbNavigation } from "@/utils/breadcrumbNavigation";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import QuickSearchToolbar from "./components/search-filter";
import { ProductMapperTableHeadingsAssign } from "./components/table-component-representativeMapper-product";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const ProductMapper = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const prodyctList = useSelector((state) => state.product.products);
  const productRepMsg = useSelector(
    (state) => state.productRepresentativeSlice.representativeProductMsg
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setProductSearchQuery("");
    setProductSelectedStatus({});
    setProductUnassignedSearchQuery("");
    setProductUnassignedSelectedStatus({});
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
    if (productRepMsg) {
      enqueueSnackbar(productRepMsg, { variant: "success" });
      dispatch(setRepresentativeProductsMsg(null));
    }
  }, [productRepMsg]);

  useEffect(() => {
    if (value) {
      setAssignSelectionRows([]);
      setUnassignSelectionRows([]);
    }
  }, [value]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await getAllActiveProducts(
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

  const createProductRepresentativeMapping = async () => {
    const data = {
      repUIds: selectedRows,
      productUIds: assignSelectionRows,
    };

    try {
      await assignProductRepresentativeMapping(data);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
    }
  };

  const updateProductRepresentativeMapping = async () => {
    const data = {
      repUIds: selectedRows,
      productUIds: unassignSelectionRows,
    };
    try {
      await unassignProductRepresentativeMapping(data);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
    }
  };

  const handleAssignClick = async () => {
    await createProductRepresentativeMapping();
  };

  const handleUnassignClick = async () => {
    await updateProductRepresentativeMapping();
  };

  const {
    searchQuery: productSearchQuery,
    setSearchQuery: setProductSearchQuery,
    selectedStatus: productSelectedStatus,
    setSelectedStatus: setProductSelectedStatus,
    searchedRows: filteredProductRows,
  } = useColumnFilter<(typeof prodyctList)[number]>(
    prodyctList,
    ProductMapperTableHeadingsAssign,
    value
  );

  const {
    searchQuery: productUnassignedSearchQuery,
    setSearchQuery: setProductUnassignedSearchQuery,
    selectedStatus: productUnassignedSelectedStatus,
    setSelectedStatus: setProductUnassignedSelectedStatus,
    searchedRows: filteredProductUnassignedRows,
  } = useColumnFilter<(typeof prodyctList)[number]>(
    prodyctList,
    ProductMapperTableHeadingsAssign,
    value
  );

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Representative - Product Mapping"
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
                columns={ProductMapperTableHeadingsAssign}
                rows={filteredProductRows}
                rowCount={filteredProductRows.length}
                loading={loading}
                checkboxSelection
                density="compact"
                rowSelectionModel={assignSelectionRows}
                onRowSelectionModelChange={(newSelection) => {
                  setAssignSelectionRows((prev) => {
                    const visibleIds = filteredProductRows.map(
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
                      handleSaveClick={handleAssignClick}
                      isDisabled={assignSelectionRows.length === 0}
                      columns={ProductMapperTableHeadingsAssign.filter(
                        (col) => col.field !== "__check__"
                      )}
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
            {/* UNASSIGN TAB PANEL */}
            <TabPanel value="2" sx={tabViewTable}>
              <DataGrid
                sx={{ ...dataGridStyleMappers }}
                getRowId={(row) => row.uId}
                columns={ProductMapperTableHeadingsAssign}
                rows={filteredProductUnassignedRows}
                rowCount={filteredProductUnassignedRows.length}
                loading={loading}
                checkboxSelection
                density="compact"
                rowSelectionModel={unassignSelectionRows}
                onRowSelectionModelChange={(newSelection) => {
                  setUnassignSelectionRows((prev) => {
                    const visibleIds = filteredProductUnassignedRows.map(
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
                      columns={ProductMapperTableHeadingsAssign.filter(
                        (col) => col.field !== "__check__"
                      )}
                      searchQuery={productUnassignedSearchQuery}
                      setSearchQuery={setProductUnassignedSearchQuery}
                      selectedStatus={productUnassignedSelectedStatus}
                      setSelectedStatus={setProductUnassignedSelectedStatus}
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

export default ProductMapper;
