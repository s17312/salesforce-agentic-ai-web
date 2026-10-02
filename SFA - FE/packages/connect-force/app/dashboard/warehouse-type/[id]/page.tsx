"use client";

import { useSelector } from "@/redux/store";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import React, { useEffect } from "react";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import WarehouseTypeAddEditForm from "../components/WarehouseTypeAddEditPage";
import { getWarehouseTypeById } from "@/service/warehouseType.service";
import { useSnackbar } from "notistack";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";

const WarehouseTypeEditPage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const isLoading = useSelector((state) => state.warehouseTypeSlice.isLoading);
  const warehouseType = useSelector(
    (state) => state.warehouseTypeSlice.warehouseType
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getWarehouseTypeById(params.id);
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
        pageTitle={`Warehouse Type Update`}
        pageNavigation={[
          {
            pageName: "Warehouse Type",
            path: PATH_DASHBOARD.warehouseType.list
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
          <WarehouseTypeAddEditForm
            isEdit
            currentWarehouseType={warehouseType || undefined}
          />
        )}
      </Container>
    </>
  );
};

export default WarehouseTypeEditPage;
