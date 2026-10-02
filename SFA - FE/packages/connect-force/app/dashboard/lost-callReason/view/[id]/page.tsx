"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { handleBreadcrumbNavigation } from "@/utils/breadcrumbNavigation";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { getLostReasonByID } from "@/service/lostCallReason.service";
import LostCallReasonViewPage from "../../components/LostCallReasonViewPage";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const ViewLostCallReason = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const lostCallReason = useSelector(
    (state) => state.lostCallReasonSlice.lostCallReason
  );
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getLostReasonByID(params.id);
      } catch (error) {
        enqueueSnackbar(`Something went wrong`, { variant: "error" });
      }
    };
    fetchData();
  }, []);

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={"Lost Call Reason View"}
        pageNavigation={[
          {
            pageName: "Lost Call Reason",
            path: PATH_DASHBOARD.lostCallReason.list,
          },
          { pageName: "view" },
        ]}
        onFullScreenClick={handleFullScreenClick}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path, router);
        }}
      />
      <Container>
        <LostCallReasonViewPage
          currentLostCallReason={lostCallReason || undefined}
        />
      </Container>
    </FsBox>
  );
};

export default ViewLostCallReason;
