"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getPriceTypeById } from "@/service/priceType.service";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import PriceTypeView from "../../components/PriceTypeViewPage";

const PriceTypeViewPage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const isLoading = useSelector((state) => state.priceTypeSlice.isLoading);
  const priceType = useSelector((state) => state.priceTypeSlice.priceType);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getPriceTypeById(params.id);
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
    <>
      <BreadcrumbNavigation
        pageTitle={`Price Type View`}
        pageNavigation={[
          {
            pageName: "Price Type",
            path: PATH_DASHBOARD.priceListType.list,
          },
          { pageName: `View` },
        ]}
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
          <PriceTypeView currentPriceType={priceType || undefined} />
        )}
      </Container>
    </>
  );
};

export default PriceTypeViewPage;
