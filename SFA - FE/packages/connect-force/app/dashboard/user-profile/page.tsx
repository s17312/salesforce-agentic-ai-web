"use client";

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
  tableOptions,
  UserProfileTableHeadings,
} from "./components/table-component-userProfile";
import { getAllUserProfileDetails } from "@/service/user-management/userProfile.service";
import PopupResponse from "@/components/popup/popup-response";
import { setRequestedDetail } from "@/redux/slices/user-management/reset-requested-password-slice";
import ResetPasswordModal from "@/components/popup/reset-password-popup";

const UserProfilePage = () => {
  const userProfileList = useSelector(
    (state) => state.userProfileSlice.userProfileDetails
  );
  const page = useSelector((state) => state.userProfileSlice.newPage);
  const rowCount = useSelector(
    (state) => state.userProfileSlice.newRowsPerPage
  );
  const isLoading = useSelector((state) => state.userProfileSlice.isLoading);
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const popupView = useSelector((state) => state.layout.popupView);
  const requestedDetail = useSelector(
    (state) => state.resetRequestPasswordSlice.requestedDetail
  );
  const [serverDownError, setServerDownError] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (!popupView) {
      dispatch(setRequestedDetail(null));
    }
  }, [popupView]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllUserProfileDetails(
          undefined,
          undefined,
          undefined,
          "userDetailsUId",
          "desc"
        );
      } catch (error) {
        setServerDownError(true);
      }
    };
    fetchData();
  }, [page, rowCount]);

  const onAddUserProfileBtnClick = () => {
    router.push(PATH_DASHBOARD.userProfile.add);
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

  const mappedUserProfileList = userProfileList.map((item) => ({
    ...item,
    uId: item.userDetailsUId,
  }));

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="User Profile List"
        pageNavigation={[
          {
            pageName: "User Profile",
            path: PATH_DASHBOARD.userProfile.list,
          },
          {
            pageName: "User Profile List",
          },
        ]}
        onAddClick={onAddUserProfileBtnClick}
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
              columns={UserProfileTableHeadings}
              data={mappedUserProfileList}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              isLoading={isLoading}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.userProfile.add);
              }}
            />
          </Box>
        </TableContainer>
      </Container>
      <ResetPasswordModal
        data={requestedDetail}
        resetForAllUsers={!!userProfileList}
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

export default UserProfilePage;
