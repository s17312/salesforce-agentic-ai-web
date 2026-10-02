"use client";

import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useSelector } from "@/redux/store";
import { getDistributorById } from "@/service/distributor.service";
import React, { useEffect, useRef, useState } from "react";
import DistributorView from "../../components/DistributorViewpage";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const ViewDistributor = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const distributor = useSelector((state) => state.distributor.distributor);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getDistributorById(params.id);
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

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={"Distributor View"}
        pageNavigation={[
          {
            pageName: "Distributor",
            path: PATH_DASHBOARD.distributor.list,
          },
          { pageName: "View"},
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
        icon={<LocalShippingIcon color="primary" />}
      />
      <Container>
        <DistributorView currentDistributor={distributor || undefined} />
      </Container>
    </FsBox>
  );
};

export default ViewDistributor;
