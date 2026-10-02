"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getUserProfileById } from "@/service/user-management/userProfile.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { handleBreadcrumbNavigation } from "@/utils/breadcrumbNavigation";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import UserProfileViewPage from "../../components/userProfileViewPage";

const UserProfileView = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = React.useRef<HTMLDivElement>(null);
  const userProfile = useSelector(
    (state) => state.userProfileSlice.userProfile
  );
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getUserProfileById(params.id);
      } catch (error) {
        enqueueSnackbar(`Something went wrong`, { variant: "error" });
      }
    };
    fetchData();
  }, [params.id]);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={"User Profile View"}
        pageNavigation={[
          {
            pageName: "User Profile",
            path: PATH_DASHBOARD.userProfile.list,
          },
          { pageName: "view" },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path, router);
        }}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <UserProfileViewPage currentUserProfile={userProfile || undefined} />
      </Container>
    </FsBox>
  );
};

export default UserProfileView;
