"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { Box, CircularProgress, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SalesUnitTypeForm from "../components/salesUnitTypeAddeditPage";
import { enqueueSnackbar } from "notistack";
import { getSalesUnitTypeById } from "@/service/salesUnitType.service";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";

const SalesUnitTypeUpdatePage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const salesUnitType = useSelector(
    (state) => state.salesUnitTypeSlice.salesUnitType
  );
  const isLoading = useSelector((state) => state.salesUnitTypeSlice.isLoading);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
      toggleFullScreen();
      setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getSalesUnitTypeById(params.id);
        
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
        pageTitle={`Sales Unit Type Update`}
        pageNavigation={[
          {
            pageName: "Sales Unit Type",
            path: PATH_DASHBOARD.salesUnitType.list,
          },
          { pageName: `Update` },
        ]}
        onLinkClick={handleBreadcrumbNavigation}
        onFullScreenClick={handleFullScreenClick}
        icon={<ListAltRoundedIcon sx={{ color: theme.palette.primary.main }} />}
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
          <SalesUnitTypeForm
            isEdit
            currentSalesUnitType={salesUnitType || undefined}
          />
        )}
      </Container>
    </FsBox>
  );
};

export default SalesUnitTypeUpdatePage;
