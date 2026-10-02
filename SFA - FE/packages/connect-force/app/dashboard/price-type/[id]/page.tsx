"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getPriceTypeById } from "@/service/priceType.service";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import PriceTypeAddEditForm from "../components/PriceTypeAddEditPage";

const PriceTypeUpdatePage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const priceType = useSelector((state) => state.priceTypeSlice.priceType);
  const isLoading = useSelector((state) => state.priceTypeSlice.isLoading);

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
        pageTitle={`Price Type Update`}
        pageNavigation={[
          {
            pageName: "Price Type",
            path: PATH_DASHBOARD.priceListType.list,
          },
          { pageName: `Update` },
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
          <PriceTypeAddEditForm
            isEdit
            currentPriceType={priceType || undefined}
          />
        )}
      </Container>
    </>
  );
};

export default PriceTypeUpdatePage;
