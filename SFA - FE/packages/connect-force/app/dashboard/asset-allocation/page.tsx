"use client";

import { PATH_DASHBOARD } from "@/routes/paths";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRef, useState } from "react";
import AssetallocationForm from "./components/assetAllocationPage";
import { useSelector } from "@/redux/store";
import PopupResponse from "@/components/popup/popup-response";
import { useRouter } from "next/navigation";

const AssetAllocationPage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const [serverDownError, setServerDownError] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Asset Allocation"
        pageNavigation={[
          {
            pageName: "Home",
            path: PATH_DASHBOARD.assetAllocation.add,
          },
          { pageName: "Asset Allocation" },
        ]}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <AssetallocationForm />
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

export default AssetAllocationPage;
