"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAssetTypeById } from "@/service/assetType.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import AssetTypeForm from "../components/assetTypeAddEditpage";

const AssetTypeUpdatePage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const assetType = useSelector((state) => state.assetTypeSlice.assetType);
  const isLoading = useSelector((state) => state.assetTypeSlice.isLoading);

  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAssetTypeById(params.id);
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
        pageTitle={`Asset Type Update`}
        pageNavigation={[
          {
            pageName: "Asset Type",
            path: PATH_DASHBOARD.assetType.list,
          },
          { pageName: `Update` },
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
          <AssetTypeForm isEdit currentAssetType={assetType || undefined} />
        )}
      </Container>
    </FsBox>
  );
};

export default AssetTypeUpdatePage;
