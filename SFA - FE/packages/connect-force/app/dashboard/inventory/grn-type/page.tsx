"use client";

import { useEffect, useRef, useState } from "react";
import PopupResponse from "@/components/popup/popup-response";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { BreadcrumbNavigation, DataTable } from "@icp/react-fusion";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { GRNTypeTableHeadings, tableOptions } from "./components/table-component-grnType";
import { getAllGRNTypeDetails } from "@/service/inventory/grn-type.service";

import { useServerPagination } from "@/hooks/useServerPagination";
import { DEFAULT_SORT_CONFIG, DEFAULT_PAGE_SIZE } from "@/constants";

const GRNTypePage = () => {
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const [serverDownError, setServerDownError] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const {
    data: grnTypeList,
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
        return await getAllGRNTypeDetails(params);
      } catch (error) {
        dispatch(setPopupResponse(true));
        setServerDownError(true);
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

  const onAddGRNTypeBtnClick = () => {
    router.push(PATH_DASHBOARD.grnType.add);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="GRN Type List"
        pageNavigation={[
          {
            pageName: "GRN Type",
            path: PATH_DASHBOARD.grnType.list,
          },
          { pageName: "List" },
        ]}
        onAddClick={onAddGRNTypeBtnClick}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <TableContainer>
          <Box>
            <DataTable
              getRowId={(row) => row.uId}
              sx={{ ...dataGridStyle }}
              contentHeight={400}
              // @ts-ignore
              columns={GRNTypeTableHeadings}
              data={grnTypeList}
              loading={loading}
              paginationMode="server"
              sortingMode="server"
              page={page}
              pageSize={pageSize}
              totalCount={totalCount}
              onPaginationModelChange={onPaginationModelChange}
              onSortModelChange={onSortModelChange}
              onSearchChange={onSearchChange}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.grnType.add);
              }}
            />
          </Box>
        </TableContainer>
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

export default GRNTypePage;
