"use client";

import React, { useRef, useState } from "react";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import TitleAddForm from "../components/TitleAddEditpage";
import { PATH_DASHBOARD } from "@/routes/paths";
import { handleBreadcrumbNavigation } from "@/utils/breadcrumbNavigation";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";

const TitleRegisterPage = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Title Register"
        pageNavigation={[
          { pageName: "Title", path: PATH_DASHBOARD.title.list },
          { pageName: "Register" },
        ]}
        onFullScreenClick={handleFullScreenClick}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path, router);
        }}
      />
      <Container>
        <TitleAddForm />
      </Container>
    </FsBox>
  );
};

export default TitleRegisterPage;
