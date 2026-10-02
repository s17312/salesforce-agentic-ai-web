"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAssetTypeById } from "@/service/assetType.service";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { handleBreadcrumbNavigation } from "@/utils/breadcrumbNavigation";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import AssetTypeViewPage from "../../components/assetTypeViewPage";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const ViewAssetType = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const assetType = useSelector((state) => state.assetTypeSlice.assetType);
  const [isFullScreen, setIsFullScreen] = useState(false);

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

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };
  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={"Asset Type View"}
        pageNavigation={[
          {
            pageName: "Asset Type",
            path: PATH_DASHBOARD.assetType.list,
          },
          { pageName: "view" },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path, router);
        }}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <AssetTypeViewPage currentAssetType={assetType || undefined} />
      </Container>
    </FsBox>
  );
};

export default ViewAssetType;
