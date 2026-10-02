"use client";

import { getOutletClassificationById } from "@/service/outletClassification.service";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import React, { useEffect, useRef, useState } from "react";
import OutletClassificationView from "../../components/OutletClassificationViewPage";
import styled from "styled-components";
import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";

const ViewOutletClassification = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const outletClassification = useSelector(
    (state) => state.outletClassificationSlice.outletClassification
  );
  const isloading = useSelector(
    (state) => state.outletClassificationSlice.isLoading
  );
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getOutletClassificationById(params.id);
      } catch (error) {
        console.error(error);
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
        pageTitle={`Outlet Classification View`}
        pageNavigation={[
          {
            pageName: "Outlet Classification",
            path: PATH_DASHBOARD.outletClassification.list,
          },
          { pageName: `View` },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        {isloading ? (
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
          <OutletClassificationView
            currentOutletClassification={outletClassification || undefined}
          />
        )}
      </Container>
    </FsBox>
  );
};

export default ViewOutletClassification;
