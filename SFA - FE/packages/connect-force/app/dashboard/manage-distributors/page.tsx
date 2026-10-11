"use client";

import PopupResponse from "@/components/popup/popup-response";
import PopupView from "@/components/popup/popup-view";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllDistributors } from "@/service/distributor.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation, DataTable } from "@icp/react-fusion";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DistributorTableHeadings, tableOptions } from "./components/table-component-distributor";

import { useServerPagination } from "@/hooks/useServerPagination";
import { DEFAULT_SORT_CONFIG, DEFAULT_PAGE_SIZE } from "@/constants";

const DistributorPage = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const distributorList = useSelector((state) => state.distributor.distributors);
  const paginationDetails = useSelector((state) => state.distributor.paginationDetails);
  const totalCount = (paginationDetails as any)?.total || (paginationDetails as any)?.Total || 0;
  const isLoading = useSelector((state) => state.distributor.isLoading);
  const distributor = useSelector((state) => state.distributor.distributor);
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const [serverDownError, setServerDownError] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const {
    page: serverPage,
    pageSize: serverPageSize,
    handleSearchChange,
    handlePaginationModelChange,
    handleSortModelChange,
  } = useServerPagination({
    fetchData: async (params) => {
      try {
        await getAllDistributors(params);
      } catch (error) {
        dispatch(setPopupResponse(true));
        setServerDownError(true);
      }
    },
    defaultSort: DEFAULT_SORT_CONFIG,
    initialPageSize: DEFAULT_PAGE_SIZE,
  });

  function capitalizeFirstLetter(string: any) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function capitalizeAllWords(string: any) {
    if (!string) return "";
    return string.split(" ").map(capitalizeFirstLetter).join(" ");
  }

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  const onAddDistributorBtnClick = () => {
    router.push(PATH_DASHBOARD.distributor.add);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Distributor List"
        pageNavigation={[
          {
            pageName: "Distributor",
            path: PATH_DASHBOARD.distributor.list,
          },
          { pageName: "List" },
        ]}
        onAddClick={onAddDistributorBtnClick}
        onLinkClick={(path: any) => { handleBreadcrumbNavigation(path) }}
        onFullScreenClick={handleFullScreenClick}
        icon={<LocalShippingIcon color="primary" />}
      />
      <Container>
        <TableContainer>
          <Box>
            <DataTable
              getRowId={(row) => row.uId}
              sx={{ ...dataGridStyle }}
              contentHeight={600}
              // @ts-ignore
              columns={DistributorTableHeadings}
              data={distributorList}
              totalCount={totalCount}
              page={serverPage}
              pageSize={serverPageSize}
              onSearchChange={handleSearchChange}
              onPaginationModelChange={handlePaginationModelChange}
              onSortModelChange={handleSortModelChange}
              isLoading={isLoading}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.distributor.add);
              }}
            />
          </Box>
        </TableContainer>
      </Container>
      <PopupView
        data={distributor}
        headerName={"Name"}
        headerContent={capitalizeAllWords(distributor?.distributorName)}
        additionalKeysToExclude={["fullName", "shiftId"]}
      />
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

export default DistributorPage;
