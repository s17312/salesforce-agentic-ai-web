"use client";

import React, { useEffect, useRef, useState } from "react";
import PaymentModeView from "../../components/PaymentModeViewpage";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useSelector } from "@/redux/store";
import styled from "styled-components";
import { getPaymentModesById } from "@/service/paymentMode.service";
import { useRouter } from "next/navigation";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const ViewPaymentMode = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const paymentMode = useSelector(
    (state) => state.paymentModeSlice.paymentMode
  );
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getPaymentModesById(params.id);
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
        pageTitle={`Payment Mode View`}
        pageNavigation={[
          {
            pageName: "Payment Mode",
            path: PATH_DASHBOARD.paymentMode.list,
          },
          { pageName: "View" },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <PaymentModeView currentPaymentMode={paymentMode || undefined} />
      </Container>
    </FsBox>
  );
};

export default ViewPaymentMode;
