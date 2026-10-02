"use client";

import { getUOMById } from "@/service/uom.service";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import React, { useEffect, useRef, useState } from "react";
import UOMView from "../../components/UOMViewPage";
import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const ViewUOM = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const uom = useSelector((state) => state.uomSlice.uom);
  const isloading = useSelector((state) => state.uomSlice.isLoading);
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
        pageTitle={`Unit of Measurement View`}
        pageNavigation={[
          {
            pageName: "Unit of Measurement",
            path: PATH_DASHBOARD.uom.list,
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
          <UOMView currentUOM={uom || undefined} />
        )}
      </Container>
    </FsBox>
  );
};

export default ViewUOM;
