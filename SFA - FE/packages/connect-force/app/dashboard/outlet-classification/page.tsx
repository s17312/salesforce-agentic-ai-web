"use client";

import React, { useEffect, useRef, useState } from "react";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import { getAllOutletClassifications } from "@/service/outletClassification.service";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { BreadcrumbNavigation, DataTable } from "@icp/react-fusion";
import { Box } from "@mui/material";
import {
  OutletClassificationTableHeadings,
  tableOptions,
} from "./components/table-component-outletClassification";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";

import { useServerPagination } from "@/hooks/useServerPagination";
import { DEFAULT_SORT_CONFIG, DEFAULT_PAGE_SIZE } from "@/constants";

const OutletClassification = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const {
    data: OutletClassificationList,
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
        return await getAllOutletClassifications(params);
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

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Outlet Classification List"
        pageNavigation={[
          {
            pageName: "Outlet Classification",
          },
          { pageName: "List" },
        ]}
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
              columns={OutletClassificationTableHeadings}
              data={OutletClassificationList}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.outletClassification.add);
              }}
            />
          </Box>
        </TableContainer>
      </Container>
    </FsBox>
  );
};

export default OutletClassification;
