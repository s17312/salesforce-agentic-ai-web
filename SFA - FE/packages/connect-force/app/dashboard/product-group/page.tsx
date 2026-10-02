"use client";

import { useEffect, useRef, useState } from "react";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllProductGroups } from "@/service/productGroup.service";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { BreadcrumbNavigation, DataTable } from "@icp/react-fusion";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import {
  productGroupTableHeadings,
  tableOptions,
} from "./components/table-component-product-group";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const ProductGroupPage = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const productGroupList = useSelector(
    (state) => state.productGroupSlice.productGroups
  );
  const page = useSelector((state) => state.productGroupSlice.newPage);
  const isLoading = useSelector((state) => state.productGroupSlice.isLoading);
  const rowCount = useSelector(
    (state) => state.productGroupSlice.newRowsPerPage
  );
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const fetachData = async () => {
      try {
        await getAllProductGroups();
      } catch (error) {
        dispatch(setPopupResponse(true));
      }
    };
    fetachData();
  }, [page, rowCount]);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Product Group"
        pageNavigation={[
          {
            pageName: "Product Group",
            path: PATH_DASHBOARD.productGroup.list,
          },
          { pageName: "List" },
        ]}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <TableContainer>
          <Box>
            <DataTable
              sx={{ ...dataGridStyle }}
              getRowId={(row) => row.uId}
              // @ts-ignore
              columns={productGroupTableHeadings}
              data={productGroupList}
              isLoading={isLoading}
              //@ts-ignore
              menuItems={tableOptions.menuItems}
              showToolbar={false}
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.productGroup.add);
              }}
            />
          </Box>
        </TableContainer>
      </Container>
    </FsBox>
  );
};

export default ProductGroupPage;
