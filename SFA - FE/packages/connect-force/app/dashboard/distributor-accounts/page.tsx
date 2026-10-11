"use client";

import PopupResponse from "@/components/popup/popup-response";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation, DataTable } from "@icp/react-fusion";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  DistributorAccountsTableHeadings,
  tableOptions,
} from "./components/table-component-distributor-accounts";
import { getAllDistributorAccounts } from "@/service/distributor-accounts-service";

import { useServerPagination } from "@/hooks/useServerPagination";
import { DEFAULT_SORT_CONFIG, DEFAULT_PAGE_SIZE } from "@/constants";

const DistributorAccountsPage = () => {
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const [serverDownError, setServerDownError] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const {
    data: distributorAccountsList,
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
        return await getAllDistributorAccounts(params);
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

  const onAddDistributorAccountsBtnClick = () => {
    router.push(PATH_DASHBOARD.distributorAccounts.add);
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
        pageTitle="Distributor Accounts List"
        pageNavigation={[
          {
            pageName: "Distributor Accounts",
            path: PATH_DASHBOARD.distributorAccounts.list,
          },
          { pageName: "List" },
        ]}
        onAddClick={onAddDistributorAccountsBtnClick}
        onFullScreenClick={handleFullScreenClick}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
      />
      <Container>
        <TableContainer>
          <Box>
            <DataTable
              getRowId={(row) => row.uId}
              sx={{ ...dataGridStyle }}
              contentHeight={400}
              // @ts-ignore
              columns={DistributorAccountsTableHeadings}
              data={distributorAccountsList}
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
                router.push(PATH_DASHBOARD.distributorAccounts.add);
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

export default DistributorAccountsPage;
