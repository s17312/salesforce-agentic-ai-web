"use client";

import React, { useEffect, useRef, useState } from "react";
import { PATH_DASHBOARD } from "@/routes/paths";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { Box, CircularProgress, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { PostAdd as PostAddIcon } from "@mui/icons-material";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { getGRN } from "@/service/inventory/grn.service";
import { useSelector } from "@/redux/store";
import GrnEditForm from "../components/grnEditForm";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const GrnEdit = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const grn = useSelector((state) => state.purchaseOrderSlice.GRN);
  const isLoading = useSelector((state) => state.purchaseOrderSlice.isLoading);

  const fetchGetGRN = async () => {
    try {
      await getGRN(params.id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    fetchGetGRN();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };
  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Goods Received Note Edit"
        pageNavigation={[
          {
            pageName: "Goods Received Note",
            path: PATH_DASHBOARD.purchaseOrder.grn.view,
          },
          { pageName: "Edit" },
        ]}
        onFullScreenClick={handleFullScreenClick}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        icon={<PostAddIcon sx={{ color: theme.palette.primary.main }} />}
      />

      <Container>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "70vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <GrnEditForm id={params.id} currentGRN={grn} />
        )}
      </Container>
    </FsBox>
  );
};

export default GrnEdit;
