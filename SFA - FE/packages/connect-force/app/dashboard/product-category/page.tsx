"use client";

import { useEffect, useRef, useState } from "react";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllProductCategory } from "@/service/productCategory.service";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { BreadcrumbNavigation, DataTable } from "@icp/react-fusion";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import {
  ProductCategoryTableHeadings,
  tableOptions,
} from "./components/table-component-productCategory";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

import { useServerPagination } from "@/hooks/useServerPagination";

const ProductCategoryPage = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const {
    data: productcategoryList,
    totalCount,
    loading,
    page,
    pageSize,
    onPaginationModelChange,
    onSortModelChange,
    onSearchChange,
  } = useServerPagination({
    fetchData: async (params) => {
      try {
        return await getAllProductCategory(params);
      } catch (error) {
        dispatch(setPopupResponse(true));
        return { data: [], total: 0 };
      }
    },
    defaultSort: { field: "uId", sort: "desc" },
    initialPageSize: 10,
  });

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Product Category List"
        pageNavigation={[
          {
            pageName: "Product Category",
          },
          { pageName: "List" },
        ]}
        onLinkClick={handleBreadcrumbNavigation}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <TableContainer>
          <Box>
            <DataTable
              sx={{ ...dataGridStyle }}
              getRowId={(row) => row.uId}
              loading={loading}
              paginationMode="server"
              sortingMode="server"
              page={page}
              pageSize={pageSize}
              totalCount={totalCount}
              onPaginationModelChange={onPaginationModelChange}
              onSortModelChange={onSortModelChange}
              onSearchChange={onSearchChange}
              //@ts-ignore
              columns={ProductCategoryTableHeadings}
              data={productcategoryList}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.productCategory.add);
              }}
            />
          </Box>
        </TableContainer>
      </Container>
    </FsBox>
  );
};
export default ProductCategoryPage;
