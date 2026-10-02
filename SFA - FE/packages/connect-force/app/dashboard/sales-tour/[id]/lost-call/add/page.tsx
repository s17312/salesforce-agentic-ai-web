"use client";

import { BreadcrumbNavigation } from "@icp/react-fusion";
import { PATH_DASHBOARD } from "@/routes/paths";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { useRouter, useSearchParams } from "next/navigation";
import LostCallAddForm from "../components/lostCallAddEditpage";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "@/redux/store";
import { getTourScheduleById } from "@/service/tour-service/tourSchedule.service";
import { enqueueSnackbar } from "notistack";

const LostCallRegisterPage = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const tourSalesList = useSelector(
    (state) => state.tourSalesSlice.TourLostCall
  );
  const schedule = useSelector(
    (state) => state.tourScheduleSlice.TourScheduleById
  );
  const [isFullScreen, setIsFullScreen] = useState(false);
  const searchParams = useSearchParams();
  const scheduleId = searchParams.get("scheduleId");
  
  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };
  const handleFullScreenClick = () => {
      toggleFullScreen();
      setIsFullScreen((prev) => !prev);
  };
  const fetchTourScheduleID = async () => {
    try {
      await getTourScheduleById(scheduleId);
    } catch (error) {
      enqueueSnackbar("Error fetching tour schedule", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchTourScheduleID();
  }, [scheduleId]);

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Lost Call Register"
        pageNavigation={[
          {
            pageName: "Lost Call",
            path: `${PATH_DASHBOARD.salesTour.salesTour}/${scheduleId}`,
          },
          { pageName: `Register` },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <LostCallAddForm currentLostCall={tourSalesList} schedule={schedule} />
      </Container>
    </FsBox>
  );
};

export default LostCallRegisterPage;
