"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getPriceListTypeById } from "@/service/mapping-service/priceListType.service";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import PriceListTypeView from "../../components/PriceListTypeViewPage";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const PriceListTypeViewPage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [isFullScreen, setIsFullScreen] = useState(false);

  const isLoading = useSelector((state) => state.priceListTypeSlice.isLoading);
  const priceListType = useSelector(
    (state) => state.priceListTypeSlice.priceListType
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getPriceListTypeById(params.id);
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

  const handleFullScreenClick = () => {
      toggleFullScreen();
      setIsFullScreen((prev) => !prev);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={`Price List Type View`}
        pageNavigation={[
          {
            pageName: "Price List Type",
            path: PATH_DASHBOARD.priceListType.list,
          },
          { pageName: `View` },
        ]}
        onFullScreenClick={handleFullScreenClick}
        onLinkClick={handleBreadcrumbNavigation}
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
          <PriceListTypeView
            currentPriceListType={priceListType || undefined}
          />
        )}
      </Container>
    </FsBox>
  );
};

export default PriceListTypeViewPage;
