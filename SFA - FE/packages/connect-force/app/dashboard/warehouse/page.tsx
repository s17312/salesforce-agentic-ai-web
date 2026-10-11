"use client";

import { useEffect, useRef, useState } from "react";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { BreadcrumbNavigation, DataTable } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import PopupResponse from "@/components/popup/popup-response";
import {
  tableOptions,
  WarehouseTableHeadings,
} from "./components/table-component-warehouse";
import { getAllWarehouse } from "@/service/warehouse";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

import { useServerPagination } from "@/hooks/useServerPagination";
import { DEFAULT_SORT_CONFIG, DEFAULT_PAGE_SIZE } from "@/constants";

const Warehouses = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [serverDownError, setServerDownError] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const popupResponse = useSelector((state) => state.layout.popupResponse);

  const {
    data: warehouses,
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
        return await getAllWarehouse(params);
      } catch (error) {
        dispatch(setPopupResponse(true));
        setServerDownError(true);
        return { data: [], total: 0 };
      }
    },
    defaultSort: DEFAULT_SORT_CONFIG,
    initialPageSize: DEFAULT_PAGE_SIZE,
  });

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Warehouse"
        pageNavigation={[
          {
            pageName: "Warehouse",
            path: PATH_DASHBOARD.warehouse.list,
          },
          { pageName: "List" },
        ]}
        onLinkClick={handleBreadcrumbNavigation}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <TableContainer>
          <DataTable
            getRowId={(row) => row.uId}
            sx={{ ...dataGridStyle }}
            contentHeight={400}
            // @ts-ignore
            columns={WarehouseTableHeadings}
            data={warehouses}
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
              router.push(PATH_DASHBOARD.warehouse.add);
            }}
          />
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

export default Warehouses;
