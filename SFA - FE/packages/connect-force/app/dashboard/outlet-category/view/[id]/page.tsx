"use client";

import React, { useEffect, useRef, useState } from "react";
import OutletCategoryView from "../../components/OutletCategoryViewPage";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useSelector } from "@/redux/store";
import styled from "styled-components";
import { getOutletCategoryById } from "@/service/outletCategory.service";
import { useRouter } from "next/navigation";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const ViewOutletCategory = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const outletCategory = useSelector(
    (state) => state.outletCategorySlice.outletCategory
  );

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
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={`Outlet Category View`}
        pageNavigation={[
          {
            pageName: "Outlet Category",
            path: PATH_DASHBOARD.outletCategory.list,
          },
          { pageName: "View" },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <OutletCategoryView
          currentOutletCategory={outletCategory || undefined}
        />
      </Container>
    </FsBox>
  );
};

export default ViewOutletCategory;
