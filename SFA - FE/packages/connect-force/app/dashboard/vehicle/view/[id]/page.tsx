"use client";

import { useSelector } from "@/redux/store";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import React, { useEffect, useRef, useState } from "react";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { getVehicleById } from "@/service/vehicle.service";
import VehicleView from "../../components/VehicleViewPage";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const VehicleViewPage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const ref = useRef<HTMLDivElement>(null);
  const isLoading = useSelector((state) => state.vehicleSlice.isLoading);
  const vehicle = useSelector((state) => state.vehicleSlice.vehicle);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
      toggleFullScreen();
      setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getVehicleById(params.id);
      } catch (error) {
        enqueueSnackbar(`Something went wrong`, { variant: "error" });
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
        pageTitle={`Vehicle View`}
        pageNavigation={[
          {
            pageName: "Vehicle",
            path: PATH_DASHBOARD.vehicle.list,
          },
          { pageName: `View` },
        ]}
        onLinkClick={handleBreadcrumbNavigation}
        onFullScreenClick={handleFullScreenClick}
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
          <VehicleView currentVehicle={vehicle || undefined} />
        )}
      </Container>
    </FsBox>
  );
};

export default VehicleViewPage;
