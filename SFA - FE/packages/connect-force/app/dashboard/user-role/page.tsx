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
import { tableOptions, UserRoleTableHeadings } from "./components/table-component-UserRole";
import { getAllUserRolesDetails } from "@/service/userRole.service";

const UserRolePage = () => {
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

  const onAddUserRoleBtnClick = () => {
    router.push(PATH_DASHBOARD.userRole.add);
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
        pageTitle="User Role List"
        pageNavigation={[
          {
            pageName: "User Role",
            path: PATH_DASHBOARD.userRole.list,
          },
          { pageName: "List" },
        ]}
        onAddClick={onAddUserRoleBtnClick}
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
              columns={UserRoleTableHeadings}
              data={userRoleList}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              isLoading={isLoading}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.userRole.add);
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

export default UserRolePage;
