"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { handleBreadcrumbNavigation } from "@/utils/breadcrumbNavigation";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import UnloadingReasonViewPage from "../../components/unloadingReasonViewPage";
import { getUnloadingReasonById } from "@/service/unloadingReason.service";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useTheme } from "@mui/system";

const ViewUnloadingReason = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const unloadingReason = useSelector(
    (state) => state.unloadingReasonSlice.unloadingReason
  );
  const theme = useTheme();
  const [isFullScreen, setIsFullScreen] = useState(false);
  
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

  const handleFullScreenClick = () => {
      toggleFullScreen();
      setIsFullScreen((prev) => !prev);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={"Unloading Reason View"}
        pageNavigation={[
          {
            pageName: "Unloading Reason",
            path: PATH_DASHBOARD.unloadingReason.list,
          },
          { pageName: "view" },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path, router);
        }}
        onFullScreenClick={handleFullScreenClick}
        icon={<InventoryIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        <UnloadingReasonViewPage
          currentUnloadingReason={unloadingReason || undefined}
        />
      </Container>
    </FsBox>
  );
};

export default ViewUnloadingReason;
