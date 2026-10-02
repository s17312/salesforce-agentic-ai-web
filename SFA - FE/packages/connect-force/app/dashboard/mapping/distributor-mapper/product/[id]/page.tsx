"use client";

import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  dataGridStyleMappers,
  tabViewTable,
} from "@/styles/tableStyles/tableStyle";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import PopupResponse from "@/components/popup/popup-response";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  ProductMapperTableHeadingsAssign,
  tableOptions,
} from "./table-component-productMapper-assign";
import { DataGrid } from "@mui/x-data-grid";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import {
  setAssignProduct,
  setDistributorProductMsg,
} from "@/redux/slices/mappers/distributor-product-slice";
import {
  distributorProductBulkUpdate,
  getAllProductsByDistributorId,
} from "@/service/mapping-service/distributorProduct.service";
import { enqueueSnackbar } from "notistack";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const ProductDistributorMapper = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const productList = useSelector(
    (state) => state.distributorProductSlice.distributorProducts
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const assignProducts_s = useSelector(
    (state) => state.distributorProductSlice.assignProduct
  );
  const distributorProductMsg = useSelector(
    (state) => state.distributorProductSlice.distributorProductMsg
  );
  const [value, setValue] = useState("1");
  const [serverDownError, setServerDownError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assignSelectedRows, setAssignSelectedRows] = useState<any[]>([]);
  const [assignedSelectionModel, setAssignedSelectionModel] = useState<any[]>(
    []
  );
  const [uncheckedRows, setUncheckedRows] = useState<any[]>([]);
  const [disableSave, setDisableSave] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setProductSearchQuery("");
    setProductSelectedStatus({});
    setProductAssignedSearchQuery("");
    setProductAssignedSelectedStatus({});
  };

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    // Set all row IDs as selected by default
    const allRowIds = assignSelectedRows.map((row) => row.productUId);
    dispatch(setAssignProduct(assignSelectedRows));
    setAssignedSelectionModel(allRowIds);
  }, [assignSelectedRows, dispatch]);

  useEffect(() => {
    // Filter out unchecked rows from assignSelectedRows
    const filteredRows = assignSelectedRows.filter(
      (row) =>
        !uncheckedRows.some(
          (uncheckedRow) => uncheckedRow.productUId === row.productUId
        )
    );

    const combinedRows = [...filteredRows, ...uncheckedRows].sort((a, b) =>
      String(a.productUId).localeCompare(String(b.productUId))
    );
    const currentIds = new Set<number>(
      assignProducts_s.map((r: any) => r.productUId)
    );
    const nextIds = new Set<number>(combinedRows.map((r) => r.productUId));

    const isDifferent =
      currentIds.size !== nextIds.size ||
      Array.from(currentIds).some((id) => !nextIds.has(id));

    if (isDifferent) {
      dispatch(setAssignProduct(combinedRows));
    }
  }, [uncheckedRows, assignSelectedRows, dispatch]);

  useEffect(() => {
    // Set default selected rows based on checkedStatus
    const defaultSelectedRows = productList.filter(
      (row: any) => row.checkedStatus
    );
    const defaultSelectedRowIds = defaultSelectedRows.map(
      (row: any) => row.productUId
    );
    setAssignSelectedRows(defaultSelectedRows);
    setAssignedSelectionModel(defaultSelectedRowIds);
  }, [productList]);

  useEffect(() => {
    if (distributorProductMsg) {
      enqueueSnackbar(distributorProductMsg, { variant: "success" });
      dispatch(setDistributorProductMsg(null));
    }
  }, [distributorProductMsg]);

  const createDistributorProductModelList = () => {
    const distributorProductModelList = assignProducts_s.map(
      (product: any) => ({
        productUId: product.productUId,
        isChecked: assignedSelectionModel.includes(product.productUId),
      })
    );

    const filteredMyList = distributorProductModelList.filter((myItem: any) => {
      const matchingProduct = productList.find(
        (product: any) => product.productUId === myItem.productUId
      );
      return (
        !matchingProduct || matchingProduct.checkedStatus !== myItem.isChecked
      );
    });

    return { distributorProductModelList: filteredMyList };
  };

  const handleNextClick = () => {
    setValue("2"); // Move to the second tab (index 1)
  };

  const handleBackClick = () => {
    setValue("1"); // Move to the first tab (index 0)
  };

  const handleSaveClick = async () => {
    await handleBulkUpdateDistributorProduct(
      params.id,
      createDistributorProductModelList()
    );
    fetchData();
    setUncheckedRows([]);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  const fetchData = async () => {
    setLoading(true);
    setDisableSave(true);
    try {
      await getAllProductsByDistributorId(params.id);
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const handleBulkUpdateDistributorProduct = async (uid: number, data: any) => {
    await distributorProductBulkUpdate(uid, data);
  };

  const handleRowSelectionChange = (newSelection: any) => {
    setDisableSave(false);
    const visibleIds = filteredProductAssignedRows.map((row) => row.productUId);
    const visibleIdSet = new Set(visibleIds);
    const newSelectionSet = new Set(newSelection);
    const updatedSelectionModel = assignedSelectionModel.filter(
      (id) => !visibleIdSet.has(id)
    );
    const finalSelection = [...updatedSelectionModel, ...newSelection];

    setAssignedSelectionModel(finalSelection);
    const newUncheckedRows = assignProducts_s
      .filter(
        (row: any) =>
          visibleIdSet.has(row.productUId) &&
          !newSelectionSet.has(row.productUId)
      )
      .map((row: any) => ({ ...row, checkedStatus: false }));

    setUncheckedRows((prev) => {
      const combined = [...prev, ...newUncheckedRows];
      return Array.from(
        new Map(combined.map((r) => [r.productUId, r])).values()
      );
    });
  };

  const {
    searchQuery: productSearchQuery,
    setSearchQuery: setProductSearchQuery,
    selectedStatus: productSelectedStatus,
    setSelectedStatus: setProductSelectedStatus,
    searchedRows: filteredProductRows,
  } = useColumnFilter<(typeof productList)[number]>(
    productList,
    ProductMapperTableHeadingsAssign,
    value
  );

  const {
    searchQuery: productAssignedSearchQuery,
    setSearchQuery: setProductAssignedSearchQuery,
    selectedStatus: productAssignedSelectedStatus,
    setSelectedStatus: setProductAssignedSelectedStatus,
    searchedRows: filteredProductAssignedRows,
  } = useColumnFilter<(typeof assignProducts_s)[number]>(
    assignProducts_s,
    ProductMapperTableHeadingsAssign,
    value
  );

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Product"
        pageNavigation={[
          {
            pageName: "Distributor Mapper",
            path: PATH_DASHBOARD.distributorMapper.list,
          },
          { pageName: "Product" },
        ]}
        onLinkClick={handleBreadcrumbNavigation}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="Assign" value="1" />
                <Tab label="Assigned" value="2" />
              </TabList>
            </Box>

            {/****************  Table Panel 1 *****************/}
            <TabPanel value="1" sx={tabViewTable}>
              <DataGrid
                sx={{ ...dataGridStyleMappers }}
                getRowId={(row) => row.productUId}
                rows={filteredProductRows}
                loading={loading}
                columns={getColumnsWithTooltip(
                  ProductMapperTableHeadingsAssign
                )}
                rowCount={filteredProductRows.length}
                pageSizeOptions={tableOptions.rowsPerPageOptions}
                checkboxSelection
                density="compact"
                rowSelectionModel={assignedSelectionModel}
                isRowSelectable={(params) => !params.row.checkedStatus}
                onRowSelectionModelChange={(ids) => {
                  const selectedIDs = new Set(ids);
                  const selectedRows = productList.filter((row: any) =>
                    selectedIDs.has(row.productUId)
                  );
                  setAssignSelectedRows((prevSelected) => {
                    const prevMap = new Map(
                      prevSelected.map((row) => [row.productUId, row])
                    );
                    const newMap = new Map(
                      selectedRows.map((row: any) => [row.productUId, row])
                    );

                    selectedIDs.forEach((id) => {
                      if (newMap.has(id)) {
                        prevMap.set(id, newMap.get(id)!);
                      }
                    });

                    const updated = Array.from(prevMap.values()).filter(
                      (row) =>
                        selectedIDs.has(row.productUId) ||
                        !filteredProductRows.some(
                          (r) => r.productUId === row.productUId
                        )
                    );

                    return updated;
                  });
                  setDisableSave(false);
                }}
                slots={{
                  noRowsOverlay: CustomNoRowsOverlay,
                  toolbar: () => (
                    <QuickSearchToolbar
                      handleNextClick={handleNextClick}
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
                getRowId={(row) => row.productUId}
                rows={filteredProductAssignedRows}
                loading={loading}
                columns={getColumnsWithTooltip(
                  ProductMapperTableHeadingsAssign
                )}
                rowCount={filteredProductAssignedRows?.length}
                pageSizeOptions={tableOptions.rowsPerPageOptions}
                checkboxSelection
                density="compact"
                rowSelectionModel={assignedSelectionModel}
                onRowSelectionModelChange={handleRowSelectionChange}
                slots={{
                  noRowsOverlay: CustomNoRowsOverlay,
                  toolbar: () => (
                    <QuickSearchToolbar
                      handleBackClick={handleBackClick}
                      handleSaveClick={handleSaveClick}
                      isDisabled={disableSave}
                      columns={ProductMapperTableHeadingsAssign.filter(
                        (col) => col.field !== "__check__"
                      )}
                      searchQuery={productAssignedSearchQuery}
                      setSearchQuery={setProductAssignedSearchQuery}
                      selectedStatus={productAssignedSelectedStatus}
                      setSelectedStatus={setProductAssignedSelectedStatus}
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
export default ProductDistributorMapper;
