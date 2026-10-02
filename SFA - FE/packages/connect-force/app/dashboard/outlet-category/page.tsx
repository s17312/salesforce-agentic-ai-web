"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllOutletCategories } from "@/service/outletCategory.service";
import { Container, TableContainer } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { BreadcrumbNavigation, DataTable } from "@icp/react-fusion";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { OutletCategoryTableHeadings, tableOptions } from "./components/table-component-outlet-category";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const OutletCategoryPage = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const outletCategoryList = useSelector((state) => state.outletCategorySlice.outletCategories);
  const page = useSelector((state) => state.outletCategorySlice.newPage);
  const isLoading = useSelector((state) => state.outletCategorySlice.isLoading);
  const rowCount = useSelector((state) => state.outletCategorySlice.newRowsPerPage);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllOutletCategories();
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [page, rowCount]);

  const onAddOutletCategoryBtnClick = () => {
    router.push(PATH_DASHBOARD.distributor.add);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Outlet Category List"
        pageNavigation={[
          {
            pageName: "Outlet Category",
            path: PATH_DASHBOARD.outletCategory.list,

          },
          { pageName: "List" },
        ]}
        onAddClick={onAddOutletCategoryBtnClick}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <TableContainer>
          <Box>
            <DataTable
              getRowId={(row) => row.uId}
              sx={{ ...dataGridStyle }}
              // @ts-ignore
              columns={OutletCategoryTableHeadings}
              data={outletCategoryList}
              isLoading={isLoading}
              //@ts-ignore
              menuItems={tableOptions.menuItems}
              showToolbar={false}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.outletCategory.add);
              }}
            />
          </Box>
        </TableContainer>
      </Container>
    </FsBox>
  );
};

export default OutletCategoryPage;
