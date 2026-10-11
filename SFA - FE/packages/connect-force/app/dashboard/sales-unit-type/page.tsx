"use client";

import { PATH_DASHBOARD } from "@/routes/paths";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation, DataTable } from "@icp/react-fusion";
import { Box, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  SalesUnitTypeTableHeadings,
  tableOptions,
} from "./components/table-component-salesTypeUnit";
import { dispatch, useSelector } from "@/redux/store";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { getAllSalesUnitTypeDetails } from "@/service/salesUnitType.service";
import PopupResponse from "@/components/popup/popup-response";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";

import { useServerPagination } from "@/hooks/useServerPagination";

const SalesUnitTypePage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const theme = useTheme();
  const [serverDownError, setServerDownError] = useState(false);
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const {
    data: salesUnitTypeList,
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
        return await getAllSalesUnitTypeDetails(params);
      } catch (error) {
        dispatch(setPopupResponse(true));
        setServerDownError(true);
        return { data: [], total: 0 };
      }
    },
    defaultSort: { field: "uId", sort: "desc" },
    initialPageSize: 10,
  });

  const onAddSalesUnitTypeBtnClick = () => {
    router.push(PATH_DASHBOARD.salesUnitType.add);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };
  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Sales Unit Type List"
        pageNavigation={[
          {
            pageName: "Sales Unit Type",
            path: PATH_DASHBOARD.salesUnitType.list,
          },
          { pageName: "List" },
        ]}
        onAddClick={onAddSalesUnitTypeBtnClick}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
        icon={<ListAltRoundedIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        <TableContainer>
          <Box>
            <DataTable
              getRowId={(row) => row.uId}
              sx={{ ...dataGridStyle }}
              contentHeight={400}
              // @ts-ignore
              columns={SalesUnitTypeTableHeadings}
              data={salesUnitTypeList}
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
              // @ts-ignore
              filterByColumn={true} 
              handleAdd={() => router.push(PATH_DASHBOARD.salesUnitType.add)}
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

export default SalesUnitTypePage;
