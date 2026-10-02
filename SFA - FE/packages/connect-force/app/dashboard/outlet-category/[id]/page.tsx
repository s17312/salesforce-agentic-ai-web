"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getOutletCategoryById } from "@/service/outletCategory.service";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import React, { useEffect, useRef, useState } from "react";
import OutletCategoryAddEditPage from "../components/OutletCategoryAddEditPage";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
const OutletCategoryEditPage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const outletCategory = useSelector(
    (state) => state.outletCategorySlice.outletCategory
  );

  const isLoading = useSelector((state) => state.outletCategorySlice.isLoading);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getOutletCategoryById(params.id);
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
        pageTitle={`Outlet Category Update`}
        pageNavigation={[
          {
            pageName: "Outlet Category",
            path: PATH_DASHBOARD.outletCategory.list,
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
          <OutletCategoryAddEditPage
            isEdit
            curruntOutletCategory={outletCategory || undefined}
          />
        )}
      </Container>
    </FsBox>
  );
};

export default OutletCategoryEditPage;
