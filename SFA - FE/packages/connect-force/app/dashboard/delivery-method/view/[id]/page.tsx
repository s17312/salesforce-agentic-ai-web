"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getDeliveryMethodById } from "@/service/deliveryMethod.service";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { handleBreadcrumbNavigation } from "@/utils/breadcrumbNavigation";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import DeliveryMethodViewPage from "../../components/deliveryMethodViewPage";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const ViewDeliveryMethod = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const deliveryMethod = useSelector(
    (state) => state.deliveryMethodSlice.deliveryMethod
  );
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getDeliveryMethodById(params.id);
      } catch (error) {
        enqueueSnackbar(`Something went wrong`, { variant: "error" });
      }
    };
    fetchData();
  }, []);

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={"Delivery Method View"}
        pageNavigation={[
          {
            pageName: "Delivery Method",
            path: PATH_DASHBOARD.deliveryMethod.list,
          },
          { pageName: "view" },
        ]}
        onFullScreenClick={handleFullScreenClick}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path, router);
        }}
      />
      <Container>
        <DeliveryMethodViewPage
          currentDeliveryMethod={deliveryMethod || undefined}
        />
      </Container>
    </FsBox>
  );
};

export default ViewDeliveryMethod;
