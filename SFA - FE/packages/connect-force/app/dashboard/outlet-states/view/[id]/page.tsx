"use client";

import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useSelector } from "@/redux/store";
import React, { useEffect, useRef, useState } from "react";
import { PATH_DASHBOARD } from "@/routes/paths";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { getOutletStatusById } from "@/service/outletStatus.service";
import OutletStatusView from "../../components/OutletStatusViewpage";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const ViewOutletStatus = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const outletstatus = useSelector(
    (state) => state.outletStatusSlice.outletStatus
  );

  const isloading = useSelector((state) => state.outletStatusSlice.isLoading);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getOutletStatusById(params.id);
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

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={`Outlet Status View`}
        pageNavigation={[
          {
            pageName: "Outlet Status",
            path: PATH_DASHBOARD.outletstatus.list,
          },
          { pageName: `View` },
        ]}
        onLinkClick={handleBreadcrumbNavigation}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        {isloading ? (
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
          <OutletStatusView currentOutletStatus={outletstatus || undefined} />
        )}
      </Container>
    </FsBox>
  );
};

export default ViewOutletStatus;
