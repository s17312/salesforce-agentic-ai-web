"use client";

import React, { useEffect, useRef, useState } from "react";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import DistributorAddForm from "../components/DistributorAddEditpage";
import { getDistributorById } from "@/service/distributor.service";
import { useSelector } from "@/redux/store";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { handleBreadcrumbNavigation } from "@/utils/breadcrumbNavigation";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const DistributorEditPage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const distributor = useSelector((state) => state.distributor.distributor);
  const isloading = useSelector((state) => state.distributor.isLoading);

  useEffect(() => {
    // get distributor by id
    const fetchData = async () => {
      try {
        await getDistributorById(params.id);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={"Distributor Update"}
        pageNavigation={[
          { pageName: "Distributor", path: PATH_DASHBOARD.distributor.list },
          { pageName: "Update" },
        ]}
        onLinkClick={(path: any) => handleBreadcrumbNavigation(path, router)}
        onFullScreenClick={handleFullScreenClick}
        icon={<LocalShippingIcon color="primary" />}
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
          <DistributorAddForm
            isEdit
            currentDistributor={distributor || undefined}
          />
        )}
      </Container>
    </FsBox>
  );
};

export default DistributorEditPage;
