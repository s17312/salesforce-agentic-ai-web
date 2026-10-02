"use client";

import { BreadcrumbNavigation } from "@icp/react-fusion";
import ProductAddForm from "../components/ProductAddEditpage";
import { PATH_DASHBOARD } from "@/routes/paths";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const ProductRegisterPage = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Product Register"
        pageNavigation={[
          {
            pageName: "Product",
            path: PATH_DASHBOARD.product.list,
          },
          { pageName: `Register` },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <ProductAddForm />
      </Container>
    </FsBox>
  );
};

export default ProductRegisterPage;
