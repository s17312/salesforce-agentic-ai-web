"use client";

import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRef, useState } from "react";
import ReturnReasonForm from "../components/returnReasonAddEditPage";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";

const ReturnReasonRegisterPage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
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
        pageTitle="Return Reason Register"
        pageNavigation={[
          {
            pageName: "Return Reason",
            path: PATH_DASHBOARD.returnReason.list,
          },
          { pageName: "Register" },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <ReturnReasonForm />
      </Container>
    </FsBox>
  );
};

export default ReturnReasonRegisterPage;
