"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AssetForm from "../components/assetAddEditPage";
import { getAssetById } from "@/service/asset.service";
import { enqueueSnackbar } from "notistack";

const AssetUpdatePage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const asset = useSelector((state) => state.assetSlice.asset);
  const isLoading = useSelector((state) => state.assetSlice.isLoading);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAssetById(params.id);
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
        pageTitle={`Asset Update`}
        pageNavigation={[
          {
            pageName: "Asset",
            path: PATH_DASHBOARD.asset.list,
          },
          { pageName: `update` },
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
          <AssetForm isEdit currentAsset={asset || undefined} />
        )}
      </Container>
    </FsBox>
  );
};

export default AssetUpdatePage;
