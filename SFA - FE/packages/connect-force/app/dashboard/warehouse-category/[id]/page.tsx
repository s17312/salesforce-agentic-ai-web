"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getWarehouseCategoryById } from "@/service/warehouse-category.service";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import WarehouseCategoryAddForm from "../components/WarehouseCategoryAddEditpage";
import { enqueueSnackbar } from "notistack";

const WarehouseCategoryUpdatePage = ({
  params,
}: {
  params: { id: number };
}) => {
  const router = useRouter();
  const warehouseCategory = useSelector(
    (state) => state.warehouseCategorySlice.warehouseCategory
  );
  const isLoading = useSelector(
    (state) => state.warehouseCategorySlice.isLoading
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getWarehouseCategoryById(params.id);
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
        pageTitle={`Warehouse Category Update`}
        pageNavigation={[
          {
            pageName: "Warehouse Category",
            path: PATH_DASHBOARD.warehouseCategory.list,
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
          <WarehouseCategoryAddForm
            isEdit
            currentWarehouseCategory={warehouseCategory || undefined}
          />
        )}
      </Container>
    </>
  );
};

export default WarehouseCategoryUpdatePage;
