"use client";

import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useSelector } from "@/redux/store";
import { getOutletById } from "@/service/outlet.service";
import React, { useEffect, useRef, useState } from "react";
import OutletView from "../../components/OutletViewpage";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";

const ViewOutlet = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const outlet = useSelector((state) => state.outlet.outlet);
  const ref = useRef<HTMLDivElement>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getOutletById(params.id);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

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
        pageTitle={"Outlet view"}
        pageNavigation={[
          { pageName: "Outlet", path: PATH_DASHBOARD.outlet.list },
          { pageName: "view" },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <OutletView currentOutlet={outlet || undefined} />
      </Container>
    </FsBox>
  );
};

export default ViewOutlet;
