"use client";

import React, { useEffect, useRef, useState } from "react";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useSelector } from "@/redux/store";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { getBusinessCategorysById } from "@/service/businessCategory.service";
import BusinessCategoryAddForm from "../components/BusinessCategoryAddEditpage";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const BusinessCategoryUpdatePage = ({ params }: { params: { id: number } }) => {
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
        pageTitle={`Business Category Update`}
        pageNavigation={[
          {
            pageName: "Business Category",
            path: PATH_DASHBOARD.businesscategory.list,
          },
          { pageName: `Update` },
        ]}
        onLinkClick={handleBreadcrumbNavigation}
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
          <BusinessCategoryAddForm
            isEdit
            currentBusinessCategory={businesscategory || undefined}
          />
        )}
      </Container>
    </FsBox>
  );
};

export default BusinessCategoryUpdatePage;
