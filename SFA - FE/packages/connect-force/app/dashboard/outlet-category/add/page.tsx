"use client";

import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import OutletCategoryAddEditPage from "../components/OutletCategoryAddEditPage";
import { useRouter } from "next/navigation";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRef, useState } from "react";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const OutletCategoryRegisterPage = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Outlet Category Register"
        pageNavigation={[
          {
            pageName: "Outlet Category",
            path: PATH_DASHBOARD.outletCategory.list,
          },
          { pageName: "Register" },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <OutletCategoryAddEditPage />
      </Container>
    </FsBox>
  );
};

export default OutletCategoryRegisterPage;
