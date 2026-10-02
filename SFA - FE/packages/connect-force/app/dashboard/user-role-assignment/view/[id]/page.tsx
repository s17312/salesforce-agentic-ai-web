"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getUserRoleAssignmentById } from "@/service/user-management/userRoleAssignment.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { handleBreadcrumbNavigation } from "@/utils/breadcrumbNavigation";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import UserRoleAssignmentViewPage from "../../components/userRoleAssignmentViewPage";

const ViewUserRoleAssignment = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const userRoleAssignment = useSelector(
    (state) => state.userRoleAssignmentSlice.userRoleAssignment
  );
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getUserRoleAssignmentById(params.id);
      } catch (error) {
        enqueueSnackbar(`Something went wrong`, { variant: "error" });
      }
    };
    fetchData();
  }, []);

  const handleFullScreenClick = () => {
      toggleFullScreen();
      setIsFullScreen((prev) => !prev);
  };
  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={"User Role Assignment View"}
        pageNavigation={[
          {
            pageName: "User Role Assignment",
            path: PATH_DASHBOARD.userRoleAssignment.list,
          },
          { pageName: "view" },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path, router);
        }}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <UserRoleAssignmentViewPage
          currentUserRoleAssignment={userRoleAssignment || undefined}
        />
      </Container>
    </FsBox>
  );
};

export default ViewUserRoleAssignment;
