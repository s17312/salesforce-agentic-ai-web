"use client";

import { PATH_DASHBOARD } from "@/routes/paths";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Business as BusinessIcon } from "@mui/icons-material";
import DistributorStockReturnTransferAddForm from "../components/distributorStockReturnTransferAddPage";
import { useTheme } from "@mui/material";

const DistributorStockReturnTransferRegisterPage = () => {
  const router = useRouter();
  const theme = useTheme();
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
        pageTitle="Distributor Stock Return Transfer Register"
        pageNavigation={[
          {
            pageName: " Distributor Stock Return Transfer",
            path: PATH_DASHBOARD.distributorStock.stockReturnTransfer.list,
          },
          { pageName: "Register" },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
        icon={<BusinessIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        <DistributorStockReturnTransferAddForm />
      </Container>
    </FsBox>
  );
};

export default DistributorStockReturnTransferRegisterPage;
