"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getSalesUnitTypeById } from "@/service/salesUnitType.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { handleBreadcrumbNavigation } from "@/utils/breadcrumbNavigation";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import SalesUnitTypeViewPage from "../../components/salesUnitTypeViewPage";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import { useTheme } from "@mui/material";

const ViewSalesUnitType = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const salesUnitType = useSelector(
    (state) => state.salesUnitTypeSlice.salesUnitType
  );
  const [isFullScreen, setIsFullScreen] = useState(false);
  
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

  const handleFullScreenClick = () => {
      toggleFullScreen();
      setIsFullScreen((prev) => !prev);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={`Sales Unit Type View`}
        pageNavigation={[
          {
            pageName: "Sales Unit Type",
            path: PATH_DASHBOARD.salesUnitType.list,
          },
          { pageName: `View` },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path, router);
        }}
        onFullScreenClick={handleFullScreenClick}
        icon={<ListAltRoundedIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        <SalesUnitTypeViewPage
          currentSalesUnitType={salesUnitType || undefined}
        />
      </Container>
    </FsBox>
  );
};

export default ViewSalesUnitType;
