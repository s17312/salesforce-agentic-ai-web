"use client";

import React, { useEffect, useRef, useState } from "react";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import OutletAddForm from "../components/OutletAddEditpage";
import { getOutletById } from "@/service/outlet.service";
import { useSelector } from "@/redux/store";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { handleBreadcrumbNavigation } from "@/utils/breadcrumbNavigation";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const OutletEditPage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const outlet = useSelector((state) => state.outlet.outlet);
  const isloading = useSelector((state) => state.outlet.isLoading);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    // get distributor by id
    const fetchData = async () => {
      try {
        await getOutletById(params.id);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={"Outlet Update"}
        pageNavigation={[
          { pageName: "Outlet", path: PATH_DASHBOARD.outlet.list },
          { pageName: "Update" },
        ]}
        onFullScreenClick={handleFullScreenClick}
        onLinkClick={(path: any) => handleBreadcrumbNavigation(path, router)}
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
          <OutletAddForm isEdit currentOutlet={outlet || undefined} />
        )}
      </Container>
    </FsBox>
  );
};

export default OutletEditPage;
