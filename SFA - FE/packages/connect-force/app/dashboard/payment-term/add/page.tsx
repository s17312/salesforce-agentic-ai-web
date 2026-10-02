"use client";

import React, { useRef, useState } from "react";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import styled from "styled-components";
import PaymentTermAddEditForm from "../components/PaymentTermAddEditPage";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const PaymentTermRegisterPage = () => {
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
        pageTitle="Payment Term Register"
        pageNavigation={[
          {
            pageName: "Payment Term",
            path: PATH_DASHBOARD.paymentTerm.list,
          },
          { pageName: `Register` },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <PaymentTermAddEditForm />
      </Container>
    </FsBox>
  );
};
export default PaymentTermRegisterPage;
const Container = styled.div`
  padding: 24px;
`;
