"use client";

import React, { useRef, useState } from "react";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import OutletAddForm from "../components/OutletAddEditpage";
import { useRouter } from "next/navigation";
import { PATH_DASHBOARD } from "@/routes/paths";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const OutletRegisterPage = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Outlet Register"
        pageNavigation={[
          { pageName: "Outlet", path: PATH_DASHBOARD.outlet.list },
          { pageName: "Register" },
        ]}
        onFullScreenClick={handleFullScreenClick}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path);
        }}
      />
      <Container>
        <OutletAddForm />
      </Container>
    </FsBox>
  );
};

export default OutletRegisterPage;
