"use client";

import { getPaymentTermById } from "@/service/paymentTerm.service";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import React, { useEffect, useRef, useState } from "react";
import PaymentTermView from "../../components/PaymentTermViewPage";
import styled from "styled-components";
import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";

const ViewPaymentTerm = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const paymentTerm = useSelector(
    (state) => state.paymentTermSlice.paymentTerm
  );
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getPaymentTermById(params.id);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={`Payment Term View`}
        pageNavigation={[
          {
            pageName: "Payment Term",
            path: PATH_DASHBOARD.paymentTerm.list,
          },
          {
            pageName: "View",
          },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <PaymentTermView currentPaymentTerm={paymentTerm || undefined} />
      </Container>
    </FsBox>
  );
};

export default ViewPaymentTerm;
const Container = styled.div`
  padding: 24px;
`;
