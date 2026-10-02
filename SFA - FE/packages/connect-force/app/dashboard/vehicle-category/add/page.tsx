"use client";

import { BreadcrumbNavigation } from "@icp/react-fusion";
import { PATH_DASHBOARD } from "@/routes/paths";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { useRouter } from "next/navigation";
import VehicleCategoryForm from "../components/vehicleCategoryAddEditpage";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { useRef, useState } from "react";

const VehicleCategoryRegisterPage = () => {
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
        pageTitle="Vehicle Category Register"
        pageNavigation={[
          {
            pageName: "Vehicle Category",
            path: PATH_DASHBOARD.vehicleCategory.list,
          },
          { pageName: `Register` },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <VehicleCategoryForm />
      </Container>
    </FsBox>
  );
};

export default VehicleCategoryRegisterPage;
