"use client";

import React, { useEffect, useRef, useState } from "react";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { PATH_DASHBOARD } from "@/routes/paths";
import { PostAdd as PostAddIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, useTheme } from "@mui/material";
import { useSelector } from "@/redux/store";
import { getPurchaseOrderApprove } from "@/service/inventory/purchaseOrder.service";
import PurchaseOrderAprroveEditComponent from "../components/purchaseOrderApproveEdit";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const PurchaseOrderApproveUpdate = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const po_PurchaseOrder = useSelector(
    (state) => state.purchaseOrderSlice.PO_PurchaseOrder
  );
  const isLoading = useSelector((state) => state.purchaseOrderSlice.isLoading);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const fetchGetPOApproval = async () => {
    try {
      await getPurchaseOrderApprove(params.id, 0, 0);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    fetchGetPOApproval();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Purchase Order Approval Edit"
        pageNavigation={[
          {
            pageName: "Purchase Orders Approval",
            path: PATH_DASHBOARD.purchaseOrder.approve.view,
          },
          { pageName: "Edit" },
        ]}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
        icon={<PostAddIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "70vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <PurchaseOrderAprroveEditComponent
            id={params.id}
            currentPO={po_PurchaseOrder}
          />
        )}
      </Container>
    </FsBox>
  );
};

export default PurchaseOrderApproveUpdate;
