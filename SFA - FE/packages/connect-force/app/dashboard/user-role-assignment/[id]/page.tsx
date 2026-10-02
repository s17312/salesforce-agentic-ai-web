"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getUserRoleAssignmentById } from "@/service/user-management/userRoleAssignment.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import UserRoleAssignmentAddEditPage from "../components/userRoleAssignmentAddEditPage";

const UserRoleAssignmentUpdatePage = ({
  params,
}: {
  params: { id: number };
}) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userRoleAssignment = useSelector(
    (state) => state.userRoleAssignmentSlice.userRoleAssignment
  );

  const handleFullScreenClick = () => {
      toggleFullScreen();
      setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await getUserRoleAssignmentById(params.id);
      } catch (error) {
        enqueueSnackbar(`Something went wrong`, { variant: "error" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={"User Role Assignment Update"}
        pageNavigation={[
          {
            pageName: "User Role Assignment",
            path: PATH_DASHBOARD.userRoleAssignment.list,
          },
          { pageName: "Update" },
        ]}
        onLinkClick={handleBreadcrumbNavigation}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "170px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <UserRoleAssignmentAddEditPage
            isEdit
            currentUserRoleAssignment={userRoleAssignment || undefined}
          />
        )}
      </Container>
    </FsBox>
  );
};

export default UserRoleAssignmentUpdatePage;
