"use client";

import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useSelector } from "@/redux/store";
import React, { useEffect, useRef, useState } from "react";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import CompanyViewPage from "../../components/CompanyViewPage";
import { getCompanyById } from "@/service/company.service";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const ViewCompany = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const company = useSelector((state) => state.companySlice.company);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getCompanyById(params.id);
      } catch (error) {
        console.error(error);
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
        pageTitle={"Company View"}
        pageNavigation={[
          {
            pageName: "Company",
            path: PATH_DASHBOARD.company.list,
          },
          { pageName: "View" },
        ]}
        onLinkClick={handleBreadcrumbNavigation}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <CompanyViewPage currentCompany={company || undefined} />
      </Container>
    </FsBox>
  );
};

export default ViewCompany;
