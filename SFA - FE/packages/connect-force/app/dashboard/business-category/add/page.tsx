"use client";

import { useRef, useState } from "react";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import BusinessCategoryAddForm from "../components/BusinessCategoryAddEditpage";
import { PATH_DASHBOARD } from "@/routes/paths";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { useRouter } from "next/navigation";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";


const BusinessCategoryRegisterPage = () => {
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
        pageTitle="Business Category Register"
        pageNavigation={[
          {
            pageName: "Business Category",
            path: PATH_DASHBOARD.businesscategory.list,
          },
          { pageName: `Register` },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
        icon={<LocalShippingIcon color="primary" />}
      />
      <Container>
        <BusinessCategoryAddForm />
      </Container>
    </FsBox>
  );
};

export default BusinessCategoryRegisterPage;
