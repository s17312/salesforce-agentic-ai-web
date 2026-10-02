"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getWarehouseCategoryById } from "@/service/warehouse-category.service";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { handleBreadcrumbNavigation } from "@/utils/breadcrumbNavigation";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import WarehouseCategoryViewPage from "../../components/WarehouseCategoryViewPage";
import { enqueueSnackbar } from "notistack";

const ViewWarehouseCategory = ({ params }: { params: { id: number } }) => {
  const router = useRouter();

  const warehouseCategory = useSelector(
    (state) => state.warehouseCategorySlice.warehouseCategory
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

  return (
    <>
      <BreadcrumbNavigation
        pageTitle={"Warehouse Category View"}
        pageNavigation={[
          {
            pageName: "Warehouse Category",
            path: PATH_DASHBOARD.warehouseCategory.list,
          },
          { pageName: "view" },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path, router);
        }}
      />
      <Container>
        <WarehouseCategoryViewPage
          currentWarehouseCategory={warehouseCategory || undefined}
        />
      </Container>
    </>
  );
};

export default ViewWarehouseCategory;
