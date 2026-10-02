"use client";

import { PATH_DASHBOARD } from "@/routes/paths";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import DistributorAccountsForm from "../components/distributorAccountsAddEditPage";

const DistributorAccountsRegisterPage = () => {
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
        pageTitle="Distributor Account Register"
        pageNavigation={[
          {
            pageName: "Distributor Account",
            path: PATH_DASHBOARD.distributorAccounts.list,
          },
          { pageName: `Register` },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <DistributorAccountsForm />
      </Container>
    </FsBox>
  );
};

export default DistributorAccountsRegisterPage;
