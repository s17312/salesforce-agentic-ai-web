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

const ProductCategoryPage = () => {
  const productcategoryList = useSelector(
    (state) => state.productCategorySlice.productCategorys
  );
  const rowCount = useSelector(
    (state) => state.productCategorySlice.newRowsPerPage
  );
  const isLoading = useSelector(
    (state) => state.productCategorySlice.isLoading
  );
  const page = useSelector((state) => state.productCategorySlice.newPage);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
      toggleFullScreen();
      setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllProductCategory();
      } catch (error) {
        dispatch(setPopupResponse(true));
      }
    };
    fetchData();
  }, [page, rowCount]);

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
              //@ts-ignore
              columns={ProductCategoryTableHeadings}
              data={productcategoryList}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              isLoading={isLoading}
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
