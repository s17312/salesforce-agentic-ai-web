"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { DataTable, BreadcrumbNavigation } from "@icp/react-fusion";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllLegaleEntityTypes } from "@/service/legleEntityType.service";
import {
  LegleEntityTypeTableHeadings,
  tableOptions,
} from "./components/table-component-legaleEntityType";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

import { useServerPagination } from "@/hooks/useServerPagination";
import { DEFAULT_SORT_CONFIG, DEFAULT_PAGE_SIZE } from "@/constants";

const LegalEntityTypePage = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const {
    data: legalEntityTypesList,
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
        return await getAllLegaleEntityTypes(params);
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

  const onAddlegLegalEntityTypeBtnClick = () => {
    router.push(PATH_DASHBOARD.legleEntityType.add);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Legal Entity Type List"
        pageNavigation={[
          {
            pageName: "Legal Entity Type",
            path: PATH_DASHBOARD.legleEntityType.list,
          },
          { pageName: "List " },
        ]}
        onAddClick={onAddlegLegalEntityTypeBtnClick}
        onLinkClick={handleBreadcrumbNavigation}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <TableContainer>
          <Box>
            <DataTable
              getRowId={(row) => row.uId}
              sx={{ ...dataGridStyle }}
              contentHeight={400}
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
              columns={LegleEntityTypeTableHeadings}
              data={legalEntityTypesList}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.legleEntityType.add);
              }}
            />
          </Box>
        </TableContainer>
      </Container>
    </FsBox>
  );
};

export default LegalEntityTypePage;
