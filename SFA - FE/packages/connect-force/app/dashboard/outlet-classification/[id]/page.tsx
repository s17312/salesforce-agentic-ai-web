"use client";

import React, { useEffect, useRef, useState } from "react";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useSelector } from "@/redux/store";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { getOutletClassificationById } from "@/service/outletClassification.service";
import OutletClassificationAddEditForm from "../components/OutletClassificationAddEditPage";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const OutletClassificationUpdatePage = ({
  params,
}: {
  params: { id: number };
}) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const outletclassification = useSelector(
    (state) => state.outletClassificationSlice.outletClassification
  );
  const isloading = useSelector(
    (state) => state.outletClassificationSlice.isLoading
  );
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getOutletClassificationById(params.id);
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
        pageTitle={`Outlet Classification Update`}
        pageNavigation={[
          {
            pageName: "Outlet Classification",
            path: PATH_DASHBOARD.outletClassification.list,
          },
          { pageName: `Update` },
        ]}
        onLinkClick={handleBreadcrumbNavigation}
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
          <OutletClassificationAddEditForm
            isEdit
            currentOutletClassification={outletclassification || undefined}
          />
        )}
      </Container>
    </FsBox>
  );
};

export default OutletClassificationUpdatePage;
