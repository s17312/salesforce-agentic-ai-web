"use client";

import { BreadcrumbNavigation } from "@icp/react-fusion";
import { PATH_DASHBOARD } from "@/routes/paths";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { useRouter } from "next/navigation";
import PriceListTypeForm from "../components/PriceListTypeAddEditpage";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { useRef, useState } from "react";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const PriceListTypeRegisterPage = () => {
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
        pageTitle="Price List Type Register"
        pageNavigation={[
          {
            pageName: "Price List Type",
            path: PATH_DASHBOARD.priceListType.list,
          },
          { pageName: `Register` },
        ]}
        onFullScreenClick={handleFullScreenClick}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path);
        }}
      />
      <Container>
        <PriceListTypeForm />
      </Container>
    </FsBox>
  );
};

export default PriceListTypeRegisterPage;
