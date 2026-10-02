"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import ReturnReasonForm from "../components/returnReasonAddEditPage";

const ReturnReasonUpdatePage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const returnReason = useSelector(
    (state) => state.returnReasonSlice.returnReason
  );
  const isLoading = useSelector((state) => state.returnReasonSlice.isLoading);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
      toggleFullScreen();
      setIsFullScreen((prev) => !prev);
  };
  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };
  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={`Return Reason Update`}
        pageNavigation={[
          {
            pageName: "Return Reason",
            path: PATH_DASHBOARD.returnReason.list,
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
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <ReturnReasonForm
            isEdit
            currentReturnReason={returnReason || undefined}
          />
        )}
      </Container>
    </FsBox>
  );
};

export default ReturnReasonUpdatePage;
