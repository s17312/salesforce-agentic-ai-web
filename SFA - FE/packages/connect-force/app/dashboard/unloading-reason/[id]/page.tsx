"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { Box, CircularProgress, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import UnloadingReasonForm from "../components/unloadingReasonAddEditpage";
import { getUnloadingReasonById } from "@/service/unloadingReason.service";
import InventoryIcon from "@mui/icons-material/Inventory";

const UnloadingReasonUpdatePage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const unloadingReason = useSelector((state) => state.unloadingReasonSlice.unloadingReason);
  const isLoading = useSelector((state) => state.unloadingReasonSlice.isLoading);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
      toggleFullScreen();
      setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getUnloadingReasonById(params.id);
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
        pageTitle={`Unloading Reason Update`}
        pageNavigation={[
          {
            pageName: "Unloading Reason",
            path: PATH_DASHBOARD.unloadingReason.list,
          },
          { pageName: `Update` },
        ]}
        onLinkClick={handleBreadcrumbNavigation}
        onFullScreenClick={handleFullScreenClick}
        icon={<InventoryIcon sx={{ color: theme.palette.primary.main }} />}
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
          <UnloadingReasonForm isEdit currentUnloadingReason={unloadingReason || undefined} />
        )}
      </Container>
    </FsBox>
  );
};

export default UnloadingReasonUpdatePage;
