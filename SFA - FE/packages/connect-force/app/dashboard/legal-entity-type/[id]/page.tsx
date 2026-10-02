"use client";

import React, { useEffect, useRef, useState } from "react";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useSelector } from "@/redux/store";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import LegaleEntityTypeAddForm from "../components/LegaleEntityTypeAddEditpage";
import { getLegleEntityTypeById } from "@/service/legleEntityType.service";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const LegaleEntityTypeUpdatePage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const legleentitytype = useSelector(
    (state) => state.legleEntityTypeSlice.legleEntityTypeState
  );
  const isloading = useSelector(
    (state) => state.legleEntityTypeSlice.isLoading
  );
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getLegleEntityTypeById(params.id);
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
        pageTitle={`Legal Entity Type Update`}
        pageNavigation={[
          {
            pageName: "Legale Entity Type",
            path: PATH_DASHBOARD.legleEntityType.list,
          },
          { pageName: `Update` },
        ]}
        onLinkClick={handleBreadcrumbNavigation}
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
          <LegaleEntityTypeAddForm
            isEdit
            currentLegalEntityType={legleentitytype || undefined}
          />
        )}
      </Container>
    </FsBox>
  );
};

export default LegaleEntityTypeUpdatePage;
