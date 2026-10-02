"use client";

import React, { useEffect, useRef, useState } from "react";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import ProductAddForm from "../components/ProductAddEditpage";
import { getProductById } from "@/service/product.service";
import { useSelector } from "@/redux/store";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { handleBreadcrumbNavigation } from "@/utils/breadcrumbNavigation";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const ProductEditPage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const product = useSelector((state) => state.product.product);
  const isloading = useSelector((state) => state.product.isLoading);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    // get distributor by id
    const fetchData = async () => {
      try {
        await getProductById(params.id);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={"Product Update"}
        pageNavigation={[
          { pageName: "Product", path: PATH_DASHBOARD.product.list },

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
          <ProductAddForm isEdit currentProduct={product || undefined} />
        )}
      </Container>
    </FsBox>
  );
};

export default ProductEditPage;
