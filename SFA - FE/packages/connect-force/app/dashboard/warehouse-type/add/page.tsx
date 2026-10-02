"use client";

import React from "react";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";
import WarehouseTypeAddEditForm from "../components/WarehouseTypeAddEditPage";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";

const WarehouseTypeRegisterPage = () => {
  const router = useRouter();

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <>
      <BreadcrumbNavigation
        pageTitle="Warehouse Type Register"
        pageNavigation={[
          {
            pageName: "Warehouse Type",
            path: PATH_DASHBOARD.warehouseType.list
          },
          { pageName: `Register` },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path);
        }}
      />
      <Container>
        <WarehouseTypeAddEditForm />
      </Container>
    </>
  );
};
export default WarehouseTypeRegisterPage;
