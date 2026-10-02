"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { handleBreadcrumbNavigation } from "@/utils/breadcrumbNavigation";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { getVehicleCategoryById } from "@/service/vehicleCategory.service";
import VehicleCategoryViewPage from "../../components/VehicleCategoryViewPage";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const ViewVehicleCategory = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const vehicleCategory = useSelector(
    (state) => state.vehicleCategorySlice.vehicleCategory
  );
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
      toggleFullScreen();
      setIsFullScreen((prev) => !prev);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getVehicleCategoryById(params.id);
      } catch (error) {
        enqueueSnackbar(`Something went wrong`, { variant: "error" });
      }
    };
    fetchData();
  }, []);

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={"Vehicle Category View"}
        pageNavigation={[
          {
            pageName: "Vehicle Category",
            path: PATH_DASHBOARD.vehicleCategory.list,
          },
          { pageName: "view" },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path, router);
        }}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <VehicleCategoryViewPage
          currentVehicleCategory={vehicleCategory || undefined}
        />
      </Container>
    </FsBox>
  );
};

export default ViewVehicleCategory;
