"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getUserProfileById } from "@/service/user-management/userProfile.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import UserProfileEditPage from "../components/userProfileEditPage";

const UserProfileUpdatePage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const userProfile = useSelector(
    (state) => state.userProfileSlice.userProfile
  );
  const isLoading = useSelector((state) => state.userProfileSlice.isLoading);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getUserProfileById(params.id);
      } catch (error) {
        enqueueSnackbar(`Something went wrong`, { variant: "error" });
      }
    };
    fetchData();
  }, []);

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const changedUserProfile = {
    userDetailsUId: userProfile?.userDetailsUId || 0,
    firstName: userProfile?.profile?.firstName || "",
    lastName: userProfile?.profile?.lastName || "",
    dob: userProfile?.profile?.dob || null,
    nic: userProfile?.profile?.nic || "",
    address: userProfile?.profile?.address || "",
    addressLine2: userProfile?.profile?.addressLine2 || "",
    mobileNumber: userProfile?.profile?.mobileNumber || "",
    email: userProfile?.profile?.email || "",
    emergencyContactName: userProfile?.profile?.emergencyContactName || "",
    emergencyContactNumber: userProfile?.profile?.emergencyContactNumber || "",
    employeeID: userProfile?.profile?.employeeID || "",
    designation: userProfile?.profile?.designation || "",
    epF_ETF_Number: userProfile?.profile?.epF_ETF_Number || "",
    appointedDate: userProfile?.profile?.appointedDate || "",
    userName: userProfile?.userName || "",
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={`User Profile Update`}
        pageNavigation={[
          {
            pageName: "User Profile",
            path: PATH_DASHBOARD.userProfile.list,
          },
          { pageName: `Update` },
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
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <UserProfileEditPage
            currentUserProfile={changedUserProfile || undefined}
          />
        )}
      </Container>
    </FsBox>
  );
};

export default UserProfileUpdatePage;
