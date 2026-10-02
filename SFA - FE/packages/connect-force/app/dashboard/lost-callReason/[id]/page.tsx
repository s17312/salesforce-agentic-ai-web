"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getLostReasonByID } from "@/service/lostCallReason.service";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import LostCallReasonForm from "../components/lostCallReasonAddEditpage";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const LostCallReasonyUpdatePage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const lostCallReason = useSelector(
    (state) => state.lostCallReasonSlice.lostCallReason
  );
  const isLoading = useSelector((state) => state.lostCallReasonSlice.isLoading);
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

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={`Lost Call Reason Update`}
        pageNavigation={[
          {
            pageName: "Lost Call Reason",
            path: PATH_DASHBOARD.lostCallReason.list,
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
          <LostCallReasonForm
            isEdit
            currentLostCallReason={lostCallReason || undefined}
          />
        )}
      </Container>
    </FsBox>
  );
};

export default LostCallReasonyUpdatePage;
