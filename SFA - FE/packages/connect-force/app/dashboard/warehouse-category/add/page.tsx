"use client";

import { BreadcrumbNavigation } from "@icp/react-fusion";
import { PATH_DASHBOARD } from "@/routes/paths";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { useRouter } from "next/navigation";
import WarehouseCategoryAddForm from "../components/WarehouseCategoryAddEditpage";

const WarehouseCategoryRegisterPage = () => {
  const router = useRouter();
  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <>
      <BreadcrumbNavigation
        pageTitle="Warehouse Category Register"
        pageNavigation={[
          {
            pageName: "Warehouse Category",
            path: PATH_DASHBOARD.warehouseCategory.list,
          },
          { pageName: `Register` },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path);
        }}
      />
      <Container>
        <WarehouseCategoryAddForm />
      </Container>
    </>
  );
};

export default WarehouseCategoryRegisterPage;
