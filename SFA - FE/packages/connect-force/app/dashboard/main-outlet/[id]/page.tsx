"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getMainOutletById } from "@/service/main-outlet.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { handleBreadcrumbNavigation } from "@/utils/breadcrumbNavigation";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MainOutletAddForm from "../components/MainOutletAddEditPage";

const MainOutletEditPage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const mainOutlet = useSelector((state) => state.mainOutletSlice.mainOutlet);
  const isLoading = useSelector((state) => state.mainOutletSlice.isLoading);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

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

  console.log(isLoading, "isLoading");
  console.log(mainOutlet, "mainOutlet");

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={"Main Outlet Update"}
        pageNavigation={[
          { pageName: "Main Outlet", path: PATH_DASHBOARD.mainOutlet.list },
          { pageName: "Update" },
        ]}
        onFullScreenClick={handleFullScreenClick}
        onLinkClick={(path: any) => handleBreadcrumbNavigation(path, router)}
      />
      <Container>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "170px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <MainOutletAddForm
            isEdit
            currentMainOutlet={mainOutlet || undefined}
          />
        )}
      </Container>
    </FsBox>
  );
};

export default MainOutletEditPage;
