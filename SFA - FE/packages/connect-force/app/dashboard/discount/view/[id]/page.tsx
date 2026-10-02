"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { handleBreadcrumbNavigation } from "@/utils/breadcrumbNavigation";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import DiscountViewPage from "../../components/discountViewPage";
import { getDiscountById } from "@/service/Discount/discount.service";
import { Box, CircularProgress, useTheme } from "@mui/material";
import DiscountIcon from "@mui/icons-material/Discount";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const ViewDiscount = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const isLoading = useSelector((state) => state.discountSlice.isLoading);
  const discount = useSelector((state) => state.discountSlice.discount);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getDiscountById(params.id);
      } catch (error) {
        enqueueSnackbar(`Something went wrong`, { variant: "error" });
      }
    };
    fetchData();
  }, []);

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={"Discount View"}
        pageNavigation={[
          {
            pageName: "Discount",
            path: PATH_DASHBOARD.discount.list,
          },
          { pageName: "view" },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path, router);
        }}
        onFullScreenClick={handleFullScreenClick}
        icon={<DiscountIcon sx={{ color: theme.palette.primary.main }} />}
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
          <DiscountViewPage currentDiscount={discount || undefined} />
        )}
      </Container>
    </FsBox>
  );
};

export default ViewDiscount;
