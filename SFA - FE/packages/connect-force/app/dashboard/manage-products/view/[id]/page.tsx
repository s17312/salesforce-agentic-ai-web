"use client";

import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useSelector } from "@/redux/store";
import { getProductById } from "@/service/product.service";
import React, { useEffect, useRef, useState } from "react";
import ProductView from "../../components/ProductViewpage";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const ViewProduct = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const product = useSelector((state) => state.product.product);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getProductById(params.id);
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
        pageTitle={"Product view"}
        pageNavigation={[
          { pageName: "Product", path: PATH_DASHBOARD.product.list },

          { pageName: "view" },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <ProductView currentProduct={product || undefined} />
      </Container>
    </FsBox>
  );
};

export default ViewProduct;
