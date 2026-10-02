"use client";

import { PATH_DASHBOARD } from "@/routes/paths";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import AssetModelForm from "../components/assetModelAddEditpage";

const AssetModelRegisterPage = () => {
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
        pageTitle="Asset Model Register"
        pageNavigation={[
          {
            pageName: " Asset Model",
            path: PATH_DASHBOARD.assetModel.list,
          },
          { pageName: "Register" },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <AssetModelForm />
      </Container>
    </FsBox>
  );
};

export default AssetModelRegisterPage;
