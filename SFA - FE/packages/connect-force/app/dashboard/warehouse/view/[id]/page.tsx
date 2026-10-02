"use client";

import { useSelector } from "@/redux/store";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import React, { useEffect, useRef, useState } from "react";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { getWarehouseById } from "@/service/warehouse";
import WarehouseView from "../../components/WarehouseViewPage";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const WarehouseTypeEditPage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const ref = useRef<HTMLDivElement>(null);
  const isLoading = useSelector((state) => state.warehouseSlice.isLoading);
  const warehouse = useSelector((state) => state.warehouseSlice.warehouse);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
      toggleFullScreen();
      setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getWarehouseById(params.id);
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
        pageTitle={`Warehouse View`}
        pageNavigation={[
          {
            pageName: "Warehouse",
            path: PATH_DASHBOARD.warehouse.list,
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
          <WarehouseView currentWarehouse={warehouse || undefined} />
        )}
      </Container>
    </FsBox>
  );
};

export default WarehouseTypeEditPage;
