"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import SalesRepresentativeForm from "../components/salesRepAddEditpage";
import { getSalesRepresentativeById } from "@/service/salesRepresentative.service";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const SalesRepresentativeUpdatePage = ({
  params,
}: {
  params: { id: number };
}) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const salesRep = useSelector(
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

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={`Sales Representative Update`}
        pageNavigation={[
          {
            pageName: "Sales Representative",
            path: PATH_DASHBOARD.salesRepresentative.list,
          },
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
          <SalesRepresentativeForm
            isEdit
            currentSalesRepresentative={salesRep || undefined}
          />
        )}
      </Container>
    </FsBox>
  );
};

export default SalesRepresentativeUpdatePage;
