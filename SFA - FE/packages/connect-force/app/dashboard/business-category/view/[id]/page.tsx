"use client";

import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useSelector } from "@/redux/store";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { getBusinessCategorysById } from "@/service/businessCategory.service";
import BusinessCategoryView from "../../components/BusinessCategoryViewpage";
import { PATH_DASHBOARD } from "@/routes/paths";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const ViewBusinessCategory = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const businesscategory = useSelector(
    (state) => state.businessCategorySlice.businessCategory
  );
  const isloading = useSelector(
    (state) => state.businessCategorySlice.isLoading
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getBusinessCategorysById(params.id);
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
        pageTitle={`Business Category View`}
        pageNavigation={[
          {
            pageName: "Business Category",
            path: PATH_DASHBOARD.businesscategory.list,
          },
          { pageName: `View` },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path);
        }}
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
          <BusinessCategoryView
            currentBusinessCategory={businesscategory || undefined}
          />
        )}
      </Container>
    </FsBox>
  );
};

export default ViewBusinessCategory;
const Container = styled.div`
  padding: 24px;
`;
