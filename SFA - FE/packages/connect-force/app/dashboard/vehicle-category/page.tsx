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
import {
  tableOptions,
  VehicleCategoryTableHeadings,
} from "./components/table-component-vehicleCategory";
import { getAllVehicleCategoryDetails } from "@/service/vehicleCategory.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";

import { useServerPagination } from "@/hooks/useServerPagination";

const VehicleCategoryPage = () => {
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const [serverDownError, setServerDownError] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const {
    data: vehicleCategoryList,
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
        return await getAllVehicleCategoryDetails(params);
      } catch (error) {
        dispatch(setPopupResponse(true));
        setServerDownError(true);
        return { data: [], total: 0 };
      }
    },
    defaultSort: { field: "uId", sort: "desc" },
    initialPageSize: 10,
  });

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  const onAddVehicleCategoryBtnClick = () => {
    router.push(PATH_DASHBOARD.vehicleCategory.add);
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
        pageTitle="Vehicle Category List"
        pageNavigation={[
          {
            pageName: "Vehicle Category",
            path: PATH_DASHBOARD.vehicleCategory.list,
          },
          { pageName: "List" },
        ]}
        onAddClick={onAddVehicleCategoryBtnClick}
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
              columns={VehicleCategoryTableHeadings}
              data={vehicleCategoryList}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.vehicleCategory.add);
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

export default VehicleCategoryPage;
