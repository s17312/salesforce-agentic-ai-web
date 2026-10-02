"use client";

import PopupResponse from "@/components/popup/popup-response";
import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllUserRoleAssignmentDetails } from "@/service/user-management/userRoleAssignment.service";
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
import { tableOptions, UserRoleAssignmentTableHeadings } from "./components/table-component-userRoleAssignment";

const UserRoleAssignmentPage = () => {
  const userRoleAssignmentList = useSelector(
    (state) => state.userRoleAssignmentSlice.userRoleAssignmentDetails
  );
  const page = useSelector((state) => state.userRoleAssignmentSlice.newPage);
  const rowCount = useSelector(
    (state) => state.userRoleAssignmentSlice.newRowsPerPage
  );
  const isLoading = useSelector(
    (state) => state.userRoleAssignmentSlice.isLoading
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const [serverDownError, setServerDownError] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllUserRoleAssignmentDetails(
          page,
          rowCount,
          undefined,
          "uId",
          "desc"
        );
      } catch (error) {
        setServerDownError(true);
      }
    };
    fetchData();
  }, [page, rowCount]);

  const onAddUserRoleAssignmentBtnClick = () => {
    router.push(PATH_DASHBOARD.userRoleAssignment.add);
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
        pageTitle="User Role Assignment List"
        pageNavigation={[
          {
            pageName: "User Role Assignment",
            path: PATH_DASHBOARD.userRoleAssignment.list,
          },
          {
            pageName: "User Role Assignment List",
          },
        ]}
        onAddClick={onAddUserRoleAssignmentBtnClick}
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
              columns={UserRoleAssignmentTableHeadings}
              data={userRoleAssignmentList}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              isLoading={isLoading}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.userRoleAssignment.add);
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

export default UserRoleAssignmentPage;
