"use client";

import React, { useEffect, useRef, useState } from "react";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { PATH_DASHBOARD } from "@/routes/paths";
import { PostAdd as PostAddIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, useTheme } from "@mui/material";
import { useSelector } from "@/redux/store";
import PurchaseOrderEditComponent from "../components/purchaseOrderEdit";
import { getTempPurchaseOrder } from "@/service/inventory/purchaseOrder.service";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const PurchaseOrderEdit = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const po_PurchaseOrder = useSelector(
    (state) => state.purchaseOrderSlice.PO_PurchaseOrder
  );
  const isloading = useSelector((state) => state.purchaseOrderSlice.isLoading);

  const fetchGetPO = async () => {
    try {
      await getTempPurchaseOrder(params.id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    fetchGetPO();
  }, []);

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Purchase Order Edit"
        pageNavigation={[
          {
            pageName: "Purchase Orders",
            path: PATH_DASHBOARD.purchaseOrder.creation.view,
          },
          { pageName: "Edit" },
        ]}
        onFullScreenClick={handleFullScreenClick}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        icon={<PostAddIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        {isloading ? (
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
          <PurchaseOrderEditComponent
            id={params.id}
            currentPO={po_PurchaseOrder}
          />
        )}
      </Container>
    </FsBox>
  );
};

export default PurchaseOrderEdit;
