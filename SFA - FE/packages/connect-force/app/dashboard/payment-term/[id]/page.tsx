"use client";

import { useSelector } from "@/redux/store";
import { getPaymentTermById } from "@/service/paymentTerm.service";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import React, { useEffect, useRef, useState } from "react";
import PaymentTermAddEditForm from "../components/PaymentTermAddEditPage";
import { PATH_DASHBOARD } from "@/routes/paths";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";

const PaymentTermEditPage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const isLoading = useSelector((state) => state.paymentTermSlice.isLoading);
  const paymentTerm = useSelector(
    (state) => state.paymentTermSlice.paymentTerm
  );
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

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

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={`Payment Term Update`}
        pageNavigation={[
          { pageName: "Payment Term", path: PATH_DASHBOARD.paymentTerm.list },
          { pageName: `Update` },
        ]}
        onLinkClick={handleBreadcrumbNavigation}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "170px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <PaymentTermAddEditForm
            isEdit
            currentPaymentTerm={paymentTerm || undefined}
          />
        )}
      </Container>
    </FsBox>
  );
};

export default PaymentTermEditPage;
const Container = styled.div`
  padding: 24px;
`;
