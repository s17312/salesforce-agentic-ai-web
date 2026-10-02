"use client";

import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useSelector } from "@/redux/store";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { PATH_DASHBOARD } from "@/routes/paths";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import LegalEntityTypeView from "../../components/LegaleEntityTypeViewpage";
import { getLegleEntityTypeById } from "@/service/legleEntityType.service";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const ViewLegalEntityType = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const legalEntityType = useSelector(
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
        pageTitle={`Legal Entity Type View`}
        pageNavigation={[
          {
            pageName: "Legal Entity Type",
            path: PATH_DASHBOARD.legleEntityType.list,
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
          <LegalEntityTypeView
            currentLegalEntityType={legalEntityType || undefined}
          />
        )}
      </Container>
    </FsBox>
  );
};

export default ViewLegalEntityType;
const Container = styled.div`
  padding: 24px;
`;
