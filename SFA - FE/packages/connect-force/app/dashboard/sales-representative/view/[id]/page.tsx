"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getSalesRepresentativeById } from "@/service/salesRepresentative.service";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { handleBreadcrumbNavigation } from "@/utils/breadcrumbNavigation";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import SalesRepresentativeViewPage from "../../components/SalesRepViewPage";
import { Box, CircularProgress } from "@mui/material";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const ViewSalesRepresentative = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const salesRepresentative = useSelector(
    (state) => state.salesRepresentativeSlice.salesRepresentative
  );
  const isLoading = useSelector(
    (state) => state.salesRepresentativeSlice.isLoading
  );
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
      toggleFullScreen();
      setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getSalesRepresentativeById(params.id);
      } catch (error) {
        enqueueSnackbar(`Something went wrong`, { variant: "error" });
      }
    };
    fetchData();
  }, []);

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={"Sales Representative View"}
        pageNavigation={[
          {
            pageName: "Sales Representative",
            path: PATH_DASHBOARD.salesRepresentative.list,
          },
          { pageName: "view" },
        ]}
        onFullScreenClick={handleFullScreenClick}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path, router);
        }}
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
          <SalesRepresentativeViewPage
            currentSalesRepresentative={salesRepresentative || undefined}
          />
        )}
      </Container>
    </FsBox>
  );
};

export default ViewSalesRepresentative;
