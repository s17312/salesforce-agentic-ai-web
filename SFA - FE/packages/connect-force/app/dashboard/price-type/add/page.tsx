"use client";

import { PATH_DASHBOARD } from "@/routes/paths";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import PriceTypeAddEditForm from "../components/PriceTypeAddEditPage";

const PriceTypeRegisterPage = () => {
  const router = useRouter();

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <>
      <BreadcrumbNavigation
        pageTitle="Price Type Register"
        pageNavigation={[
          {
            pageName: "Price Type",
            path: PATH_DASHBOARD.priceListType.list,
          },
          { pageName: `Register` },
        ]}
        onLinkClick={(path) => {
          handleBreadcrumbNavigation(path);
        }}
      />
      <Container>
        <PriceTypeAddEditForm />
      </Container>
    </>
  );
};
export default PriceTypeRegisterPage;
