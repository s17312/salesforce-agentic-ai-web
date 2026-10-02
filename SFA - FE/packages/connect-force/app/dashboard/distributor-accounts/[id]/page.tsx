"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import DistributorAccountsForm from "../components/distributorAccountsAddEditPage";
import { getDistributorAccountById } from "@/service/distributor-accounts-service";

const DistributorAccountsUpdatePage = ({
  params,
}: {
  params: { id: number };
}) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const distributorAccount = useSelector(
    (state) => state.distributorAccountsSlice.distributorAccount
  );
  const isLoading = useSelector(
    (state) => state.distributorAccountsSlice.isLoading
  );

  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

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

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle={`Distributor Account Update`}
        pageNavigation={[
          {
            pageName: "Distributor Account",
            path: PATH_DASHBOARD.distributorAccounts.list,
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
          <DistributorAccountsForm
            isEdit
            currentDistributorAccount={distributorAccount || undefined}
          />
        )}
      </Container>
    </FsBox>
  );
};

export default DistributorAccountsUpdatePage;
