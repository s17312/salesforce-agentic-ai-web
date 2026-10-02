"use client";

import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { DataTable, BreadcrumbNavigation } from "@icp/react-fusion";
import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { getAllBusinessCategorys } from "@/service/businessCategory.service";
import {
  BusinessCategoryTableHeadings,
  tableOptions,
} from "./components/table-component-businessCategory";
import { PATH_DASHBOARD } from "@/routes/paths";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const BusinessCategoryPage = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const businesscategoryList = useSelector(
    (state) => state.businessCategorySlice.businessCategorys
  );
  const page = useSelector((state) => state.businessCategorySlice.newPage);
  const rowCount = useSelector(
    (state) => state.businessCategorySlice.newRowsPerPage
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllBusinessCategorys();
      } catch (error) {
        dispatch(setPopupResponse(true));
      }
    };
    fetchData();
  }, [page, rowCount]);

  const onAddBusinessCategoryBtnClick = () => {
    router.push(PATH_DASHBOARD.businesscategory.add);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Business Category List"
        pageNavigation={[
          {
            pageName: "Business Category",
            path: PATH_DASHBOARD.businesscategory.list,
          },
          { pageName: "List " },
        ]}
        onAddClick={onAddBusinessCategoryBtnClick}
        onLinkClick={handleBreadcrumbNavigation}
        onFullScreenClick={handleFullScreenClick}
        icon={<LocalShippingIcon color="primary" />}
      />
      <Container>
        <TableContainer>
          <Box>
            <DataTable
              getRowId={(row) => row.uId}
              sx={{ ...dataGridStyle }}
              contentHeight={400}
              // @ts-ignore
              columns={BusinessCategoryTableHeadings}
              data={businesscategoryList}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.businesscategory.add);
              }}
            />
          </Box>
        </TableContainer>
      </Container>
    </FsBox>
  );
};

export default BusinessCategoryPage;
