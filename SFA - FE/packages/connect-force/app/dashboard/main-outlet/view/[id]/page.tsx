"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getMainOutletById } from "@/service/main-outlet.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MainOutletView from "../../components/MainOutletViewPage";

const MainViewOutlet = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const mainOutlet = useSelector((state) => state.mainOutletSlice.mainOutlet);
  const ref = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getMainOutletById(params.id);
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
        pageTitle={"Main Outlet view"}
        pageNavigation={[
          { pageName: "Main Outlet", path: PATH_DASHBOARD.mainOutlet.list },
          { pageName: "view" },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <MainOutletView currentMainOutlet={mainOutlet || undefined} />
      </Container>
    </FsBox>
  );
};

export default MainViewOutlet;
