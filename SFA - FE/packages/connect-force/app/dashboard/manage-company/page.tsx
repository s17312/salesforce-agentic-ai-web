"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { DataTable, BreadcrumbNavigation } from "@icp/react-fusion";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import PopupView from "@/components/popup/popup-view";
import PopupResponse from "@/components/popup/popup-response";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  CompanyTableHeadings,
  tableOptions,
} from "./components/table-component-company";
import { getAllCompany } from "@/service/company.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";

const CompanyPage = () => {
  const companyList = useSelector((state) => state.companySlice.companies);
  const page = useSelector((state) => state.companySlice.newPage);
  const rowCount = useSelector((state) => state.companySlice.newRowsPerPage);
  const company = useSelector((state) => state.companySlice.company);
  const popupResponse = useSelector((state) => state.layout.popupResponse);

  const [serverDownError, setServerDownError] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllCompany(page, rowCount, undefined, "uId", "desc");
      } catch (error) {
        dispatch(setPopupResponse(true));
        setServerDownError(true);
      }
    };
    fetchData();
  }, [page, rowCount]);

  function capitalizeFirstLetter(string: any) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function capitalizeAllWords(string: any) {
    if (!string) return "";
    return string.split(" ").map(capitalizeFirstLetter).join(" ");
  }

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  const onAddCompanyBtnClick = () => {
    router.push(PATH_DASHBOARD.company.add);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Company List"
        pageNavigation={[
          {
            pageName: "Company",
            path: PATH_DASHBOARD.company.list,
          },
          { pageName: "List" },
        ]}
        onAddClick={onAddCompanyBtnClick}
        onLinkClick={handleBreadcrumbNavigation}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <TableContainer>
          <Box>
            <DataTable
              getRowId={(row) => row.uId}
              sx={{ ...dataGridStyle }}
              contentHeight={400}
              // @ts-ignore
              columns={CompanyTableHeadings}
              data={companyList}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.company.add);
              }}
            />
          </Box>
        </TableContainer>
      </Container>
      <PopupView
        data={company}
        headerName={"Name"}
        headerContent={capitalizeAllWords(company?.companyName)}
        additionalKeysToExclude={["fullName", "shiftId"]}
      />
      {popupResponse && serverDownError && (
        <PopupResponse
          type={"error"}
          message={"Internal server error"}
          redirectBack={redirectBack}
        />
      )}
    </FsBox>
  );
};

export default CompanyPage;
