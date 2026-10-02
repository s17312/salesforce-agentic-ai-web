"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getProductGroupById } from "@/service/productGroup.service";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ProductGroupView from "../../components/ProductGroupViewPage";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const ViewProductGroup = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const productGroup = useSelector(
    (status) => status.productGroupSlice.productGroup
  );
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
      toggleFullScreen();
      setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getProductGroupById(params.id);
      } catch (error: any) {
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
        pageTitle={`Product Group view`}
        pageNavigation={[
          {
            pageName: "Product Group",
            path: PATH_DASHBOARD.productGroup.list,
          },
          { pageName: `view` },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <ProductGroupView currentProductGroup={productGroup || undefined} />
      </Container>
    </FsBox>
  );
};

export default ViewProductGroup;
