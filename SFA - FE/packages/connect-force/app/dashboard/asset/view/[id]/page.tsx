"use client";

import { PATH_DASHBOARD } from "@/routes/paths";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { handleBreadcrumbNavigation } from "@/utils/breadcrumbNavigation";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import AssetViewPage from "../../components/assetViewPage";
import { enqueueSnackbar } from "notistack";
import { useSelector } from "@/redux/store";
import { getAssetById } from "@/service/asset.service";

const ViewAsset = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const asset = useSelector((state) => state.assetSlice.asset);

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

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={"Asset View"}
        pageNavigation={[
          {
            pageName: "Asset",
            path: PATH_DASHBOARD.asset.list,
          },
          { pageName: "view" },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path, router);
        }}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <AssetViewPage currentAsset={asset || undefined} />
      </Container>
    </FsBox>
  );
};

export default ViewAsset;
