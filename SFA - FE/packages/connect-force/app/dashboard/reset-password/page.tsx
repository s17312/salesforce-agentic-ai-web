"use client";

import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import PopupResponse from "@/components/popup/popup-response";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllRequestedResetPasswordList } from "@/service/user-management/reset-request-password.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ResetRequestedPasswordTableHeadings } from "./components/table-component-resetRequestedPassword";
import { setRequestedDetail } from "@/redux/slices/user-management/reset-requested-password-slice";
import ResetPasswordModal from "@/components/popup/reset-password-popup";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const ResetRequestedPasswordListPage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [serverDownError, setServerDownError] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const popupView = useSelector((state) => state.layout.popupView);
  const requestedListDetails = useSelector(
    (state) => state.resetRequestPasswordSlice.requestedListDetails
  );
  const requestedDetail = useSelector(
    (state) => state.resetRequestPasswordSlice.requestedDetail
  );

  const page = useSelector((state) => state.resetRequestPasswordSlice.newPage);
  const rowCount = useSelector(
    (state) => state.resetRequestPasswordSlice.newRowsPerPage
  );

  const {
    searchedRows,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
  } = useColumnFilter(
    requestedListDetails,
    ResetRequestedPasswordTableHeadings
  );

  useEffect(() => {
    if (!popupView) {
      dispatch(setRequestedDetail(null));
    }
  }, [popupView]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllRequestedResetPasswordList(
          page,
          rowCount,
          undefined,
          "uId",
          "desc"
        );
      } catch (error) {
        dispatch(setPopupResponse(true));
        setServerDownError(true);
      }
    };
    fetchData();
  }, [page, rowCount]);

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
        pageTitle="Reset Password List"
        pageNavigation={[
          {
            pageName: "Reset Password",
            path: PATH_DASHBOARD.resetRequestedPassword.list,
          },
          { pageName: "List" },
        ]}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <TableContainer>
          <Box>
            <DataGrid
              sx={{ ...dataGridStyle }}
              getRowId={(row) => row.uId}
              rows={searchedRows}
              columns={getColumnsWithTooltip(
                ResetRequestedPasswordTableHeadings
              )}
              slots={{
                noRowsOverlay: CustomNoRowsOverlay,
                toolbar: () => (
                  <QuickSearchToolbar
                    columns={ResetRequestedPasswordTableHeadings.filter(
                      (col) => col.field !== "actions"
                    )}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                    menuItem={{
                      field: "searchColumn",
                      headerName: "Search By",
                    }}
                  />
                ),
              }}
              density="standard"
              disableRowSelectionOnClick
              disableColumnMenu
            />
          </Box>
        </TableContainer>
      </Container>
      <ResetPasswordModal data={requestedDetail} />
      {PopupResponse && serverDownError && (
        <PopupResponse
          type={"error"}
          message={"Internal server error"}
          redirectBack={redirectBack}
        />
      )}
    </FsBox>
  );
};

export default ResetRequestedPasswordListPage;
