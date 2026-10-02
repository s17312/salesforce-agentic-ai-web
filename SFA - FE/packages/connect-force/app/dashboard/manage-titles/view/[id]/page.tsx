"use client";

import { getTitleById } from "@/service/titles.service";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import React, { useEffect, useRef, useState } from "react";
import TitleView from "../../components/TitleViewPage";
import styled from "styled-components";
import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { handleBreadcrumbNavigation } from "@/utils/breadcrumbNavigation";
import { useRouter } from "next/navigation";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const ViewTitle = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const title = useSelector(
    (state) => state.titleSlice.title
  );
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getTitleById(params.id);
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
        pageTitle={"Title View"}
        pageNavigation={[
          {
            pageName: "Title",
            path: PATH_DASHBOARD.title.list,
          },
          { pageName: "View" }
        ]}
        onFullScreenClick={handleFullScreenClick}
        onLinkClick={(path) => { handleBreadcrumbNavigation(path, router) }}
      />
      <Container>
        <TitleView currentTitle={title || undefined} />
      </Container>
    </FsBox>
  );
};

export default ViewTitle;
