"use client";

import PopupResponse from "@/components/popup/popup-response";
import PopupView from "@/components/popup/popup-view";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllProductsList } from "@/service/product.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation, DataTable } from "@icp/react-fusion";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ProductTableHeadings,
  tableOptions,
} from "./components/table-component-product";

import { useServerPagination } from "@/hooks/useServerPagination";
import { DEFAULT_SORT_CONFIG, DEFAULT_PAGE_SIZE } from "@/constants";

const ProductPage = () => {
  const productList = useSelector((state) => state.product.products);
  const paginationDetails = useSelector((state) => state.product.paginationDetails);
  const totalCount = (paginationDetails as any)?.total || (paginationDetails as any)?.Total || 0;
  const product = useSelector((state) => state.product.product);
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const isLoading = useSelector((state) => state.product.isLoading);

  const [serverDownError, setServerDownError] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const {
    page: serverPage,
    pageSize: serverPageSize,
    handleSearchChange,
    handlePaginationModelChange,
    handleSortModelChange,
  } = useServerPagination({
    fetchData: async (params) => {
      try {
        await getAllProductsList(params);
      } catch (error) {
        dispatch(setPopupResponse(true));
        setServerDownError(true);
      }
    },
    defaultSort: DEFAULT_SORT_CONFIG,
    initialPageSize: DEFAULT_PAGE_SIZE,
  });

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  const onAddProductBtnClick = () => {
    router.push(PATH_DASHBOARD.product.add);
  };

  const handleUploadBtnClick = () => {
    router.push(PATH_DASHBOARD.product.addBulk);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Product List"
        pageNavigation={[
          {
            pageName: "Product",
            path: PATH_DASHBOARD.product.list,
          },
          { pageName: "List" },
        ]}
        onAddClick={onAddProductBtnClick}
        onFullScreenClick={handleFullScreenClick}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
      />
      <Container>
        <TableContainer>
          <Box>
            <DataTable
              getRowId={(row: any) => row.uId}
              sx={{ ...dataGridStyle }}
              contentHeight={400}
              // @ts-ignore
              columns={ProductTableHeadings}
              data={productList}
              totalCount={totalCount}
              page={serverPage}
              pageSize={serverPageSize}
              onSearchChange={handleSearchChange}
              onPaginationModelChange={handlePaginationModelChange}
              onSortModelChange={handleSortModelChange}
              isLoading={isLoading}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.product.add);
              }}
              handleTableBtnClick={handleUploadBtnClick}
              isTableBtnDisabled={false}
              tableBtnText={"Upload"}
              tableBtnIcon={<VisibilityIcon />}
            />
          </Box>
        </TableContainer>
      </Container>
      <PopupView
        data={product}
        headerName={"Name"}
        headerContent={product?.productName}
        additionalKeysToExclude={["fullName", "shiftId"]}
      />
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

export default ProductPage;
