"use client";

import { PATH_DASHBOARD } from "@/routes/paths";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import ProductCategoryAddForm from "../components/ProductCategoryAddEditpage";
import { useSelector } from "@/redux/store";
import { useEffect, useRef, useState } from "react";
import { getProductCategoryById } from "@/service/productCategory.service";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const ProductCategoryUpdatePage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const productstegory = useSelector(
    (state) => state.productCategorySlice.productCategory
  );
  const isLoading = useSelector(
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
        pageTitle={`Product Category Update`}
        pageNavigation={[
          {
            pageName: "Product Category",
            path: PATH_DASHBOARD.productCategory.list,
          },
          { pageName: `Update` },
        ]}
        onLinkClick={handleBreadcrumbNavigation}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        {isLoading ? (
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
          <ProductCategoryAddForm
            isEdit
            currentProductCategory={productstegory || undefined}
          />
        )}
      </Container>
    </FsBox>
  );
};

export default ProductCategoryUpdatePage;
