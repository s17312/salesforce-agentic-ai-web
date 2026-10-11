"use client";

import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { DataTable, BreadcrumbNavigation } from "@icp/react-fusion";
import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllOutletStatus } from "@/service/outletStatus.service";
import {
  OutletStatusTableHeadings,
  tableOptions,
} from "./components/table-component-outletStatus";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

import { useServerPagination } from "@/hooks/useServerPagination";
import { DEFAULT_SORT_CONFIG, DEFAULT_PAGE_SIZE } from "@/constants";

const OutletStatusPage = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const {
    data: outletstatusList,
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
        return await getAllOutletStatus(params);
      } catch (error) {
        dispatch(setPopupResponse(true));
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

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Outlet Status List"
        pageNavigation={[
          {
            pageName: "Outlet Status",
            path: PATH_DASHBOARD.outletstatus.list,
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
              //@ts-ignore
              columns={OutletStatusTableHeadings}
              data={outletstatusList}
              //@ts-ignore
              menuItems={tableOptions.menuItems}
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.outletstatus.add);
              }}
            />
          </Box>
        </TableContainer>
      </Container>
    </FsBox>
  );
};

export default OutletStatusPage;
