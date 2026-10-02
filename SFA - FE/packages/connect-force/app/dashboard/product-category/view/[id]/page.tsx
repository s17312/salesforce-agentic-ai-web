"use client";

import { PATH_DASHBOARD } from "@/routes/paths";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import ProductCategoryViewpage from "../../components/ProductCategoryViewpage";
import { useSelector } from "@/redux/store";
import { useEffect, useRef, useState } from "react";
import { getProductCategoryById } from "@/service/productCategory.service";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const ViewProductcategory = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const productcategory = useSelector(
    (state) => state.productCategorySlice.productCategory
  );
  const isloading = useSelector(
    (state) => state.productCategorySlice.isLoading
  );
    const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getProductCategoryById(params.id);
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
        pageTitle={`Product Category view`}
        pageNavigation={[
          {
            pageName: "Product Category",
            path: PATH_DASHBOARD.productCategory.list,
          },
          { pageName: `view` },
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
          <ProductCategoryViewpage
            currentProductCategory={productcategory || undefined}
          />
        )}
      </Container>
    </FsBox>
  );
};

export default ViewProductcategory;
