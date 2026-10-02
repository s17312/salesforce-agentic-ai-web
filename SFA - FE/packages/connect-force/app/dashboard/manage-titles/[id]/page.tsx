"use client";

import React, { useEffect, useRef, useState } from "react";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import TitleAddForm from "../components/TitleAddEditpage";
import { getTitleById } from "@/service/titles.service";
import { useSelector } from "@/redux/store";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { handleBreadcrumbNavigation } from "@/utils/breadcrumbNavigation";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";

const TitleEditPage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const title = useSelector((state) => state.titleSlice.title);
  const isloading = useSelector((state) => state.titleSlice.isLoading);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  useEffect(() => {
    // get Title by id
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
        pageTitle={"Title Update"}
        pageNavigation={[
          {
            pageName: "Title",
            path: PATH_DASHBOARD.title.list,
          },
          { pageName: "Update" },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path, router);
        }}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        {/* {isloading ? ( */}
        {/* <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "170px",
            }}
          >
            <CircularProgress />
          </Box> */}
        {/* ) : ( */}
        <TitleAddForm isEdit currentTitle={title || undefined} />
        {/* )} */}
      </Container>
    </FsBox>
  );
};

export default TitleEditPage;
