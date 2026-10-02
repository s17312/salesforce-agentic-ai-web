"use client";

import { PATH_DASHBOARD } from "@/routes/paths";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import ProductCategoryAddEditpage from "../components/ProductCategoryAddEditpage";
import { useRef, useState } from "react";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const ProductCategoryRegisterPage = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
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
        pageTitle="Product Category Register"
        pageNavigation={[
          {
            pageName: "Product Category",
            path: PATH_DASHBOARD.productCategory.list,
          },
          { pageName: `Register` },
        ]}
        onLinkClick={handleBreadcrumbNavigation}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <ProductCategoryAddEditpage />
      </Container>
    </FsBox>
  );
};
export default ProductCategoryRegisterPage;
