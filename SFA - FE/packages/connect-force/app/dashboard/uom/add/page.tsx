"use client";

import React, { useRef, useState } from "react";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import UOMAddEditForm from "../components/UOMAddEditPage";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
const UOMRegisterPage = () => {
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
        pageTitle="Unit of Measurement Register"
        pageNavigation={[
          { pageName: "Unit of Measurement", path: PATH_DASHBOARD.uom.list },
          { pageName: `Register` },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <UOMAddEditForm />
      </Container>
    </FsBox>
  );
};
export default UOMRegisterPage;
