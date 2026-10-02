"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getPriceListTypeById } from "@/service/mapping-service/priceListType.service";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import PriceListTypeForm from "../components/PriceListTypeAddEditpage";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const PriceListTypeUpdatePage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const priceListType = useSelector(
    (state) => state.priceListTypeSlice.priceListType
  );
  const isLoading = useSelector((state) => state.priceListTypeSlice.isLoading);
  const ref = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

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
        pageTitle={`Price List Type Update`}
        pageNavigation={[
          {
            pageName: "Price List Type",
            path: PATH_DASHBOARD.priceListType.list,
          },
          { pageName: `Update` },
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
          <PriceListTypeForm
            isEdit
            currentPriceListType={priceListType || undefined}
          />
        )}
      </Container>
    </FsBox>
  );
};

export default PriceListTypeUpdatePage;
