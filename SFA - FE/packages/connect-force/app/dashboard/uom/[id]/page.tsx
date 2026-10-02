"use client";

import React, { useEffect, useRef, useState } from "react";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useSelector } from "@/redux/store";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { getUOMById } from "@/service/uom.service";
import UOMAddEditForm from "../components/UOMAddEditPage";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const UOMUpdatePage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const uom = useSelector((state) => state.uomSlice.uom);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
      toggleFullScreen();
      setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getUOMById(params.id);
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
        pageTitle={`Unit of Measurement Update`}
        pageNavigation={[
          {
            pageName: "Unit of Measurement",
            path: PATH_DASHBOARD.uom.list,
          },
          { pageName: `Update` },
        ]}
        onLinkClick={handleBreadcrumbNavigation}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        {uom === null ? (
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
          <UOMAddEditForm isEdit currentUOM={uom || undefined} />
        )}
      </Container>
    </FsBox>
  );
};

export default UOMUpdatePage;
