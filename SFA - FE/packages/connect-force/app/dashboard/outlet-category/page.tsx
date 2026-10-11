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

import { useServerPagination } from "@/hooks/useServerPagination";
import { DEFAULT_SORT_CONFIG, DEFAULT_PAGE_SIZE } from "@/constants";

const OutletCategoryPage = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const {
    data: outletCategoryList,
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
        return await getAllOutletCategories(params);
      } catch (error) {
        console.error(error);
        return { data: [], total: 0 };
      }
    },
    defaultSort: DEFAULT_SORT_CONFIG,
    initialPageSize: DEFAULT_PAGE_SIZE,
  });

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  const onAddOutletCategoryBtnClick = () => {
    router.push(PATH_DASHBOARD.outletCategory.add);
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
              loading={loading}
              paginationMode="server"
              sortingMode="server"
              page={page}
              pageSize={pageSize}
              totalCount={totalCount}
              onPaginationModelChange={onPaginationModelChange}
              onSortModelChange={onSortModelChange}
              onSearchChange={onSearchChange}
              // @ts-ignore
              columns={OutletCategoryTableHeadings}
              data={outletCategoryList}
              //@ts-ignore
              menuItems={tableOptions.menuItems}
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
