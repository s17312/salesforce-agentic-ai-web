"use client";

import { PATH_DASHBOARD } from "@/routes/paths";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import SalesUnitTypeForm from "../components/salesUnitTypeAddeditPage";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import { useTheme } from "@mui/material";

const SalesUnitTypeRegisterPage = () => {
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
        pageTitle="Sales Unit Type Register"
        pageNavigation={[
          {
            pageName: "Sales Unit Type",
            path: PATH_DASHBOARD.salesUnitType.list,
          },
          { pageName: "Register" },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
        icon={<ListAltRoundedIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        <SalesUnitTypeForm />
      </Container>
    </FsBox>
  );
};

export default SalesUnitTypeRegisterPage;
