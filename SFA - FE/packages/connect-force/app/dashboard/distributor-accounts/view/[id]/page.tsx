"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAssetTypeById } from "@/service/assetType.service";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { handleBreadcrumbNavigation } from "@/utils/breadcrumbNavigation";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import DistributorAccountViewPage from "../../components/distributorAccountsViewPage";
import { getDistributorAccountById } from "@/service/distributor-accounts-service";

const ViewDistributorAccounts = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const distributorAccount = useSelector(
    (state) => state.distributorAccountsSlice.distributorAccount
  );
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getDistributorAccountById(params.id);
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
        pageTitle={"Distributor Account View"}
        pageNavigation={[
          {
            pageName: "Distributor Account",
            path: PATH_DASHBOARD.distributorAccounts.list,
          },
          { pageName: "view" },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path, router);
        }}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <DistributorAccountViewPage
          currentDistributorAccount={distributorAccount || undefined}
        />
      </Container>
    </FsBox>
  );
};

export default ViewDistributorAccounts;
