"use client";

import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import PopupResponse from "@/components/popup/popup-response";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllUserRolesDetails } from "@/service/userRole.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { UserRoleTableHeadings } from "./components/table-component-UserRole";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const UserRolePage = () => {
  const theme = useTheme();
  const userRoleList = useSelector(
    (state) => state.userRoleSlice.userRoleDetails
  );
  const page = useSelector((state) => state.assetModelSlice.newPage);
  const rowCount = useSelector((state) => state.assetModelSlice.newRowsPerPage);
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const isLoading = useSelector((state) => state.assetModelSlice.isLoading);
  const [serverDownError, setServerDownError] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const {
    searchedRows,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
  } = useColumnFilter(userRoleList, UserRoleTableHeadings);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllUserRolesDetails(page, rowCount, undefined, "uId", "desc");
      } catch (error) {
        dispatch(setPopupResponse(true));
        setServerDownError(true);
      }
    };
    fetchData();
  }, [page, rowCount]);

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
        pageTitle="User Role Permission List"
        pageNavigation={[
          {
            pageName: "User Role Permissions",
            path: PATH_DASHBOARD.userRole.list,
          },
          { pageName: "List" },
        ]}
        onFullScreenClick={handleFullScreenClick}
        icon={<KeyRoundedIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        <TableContainer>
          <Box>
            <DataGrid
              sx={{ ...dataGridStyle }}
              getRowId={(row) => row.uId}
              rows={searchedRows}
              columns={getColumnsWithTooltip(UserRoleTableHeadings)}
              slots={{
                noRowsOverlay: CustomNoRowsOverlay,
                toolbar: () => (
                  <QuickSearchToolbar
                    columns={UserRoleTableHeadings.filter(
                      (col) => col.field !== "status" && col.field !== "actions"
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
              hideFooter
              disableRowSelectionOnClick
              disableColumnMenu
              disableColumnFilter
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

export default UserRolePage;
