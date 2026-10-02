"use client";

import React, { useEffect, useRef, useState } from "react";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import { getAllOutletClassifications } from "@/service/outletClassification.service";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { BreadcrumbNavigation, DataTable } from "@icp/react-fusion";
import { Box } from "@mui/material";
import {
  OutletClassificationTableHeadings,
  tableOptions,
} from "./components/table-component-outletClassification";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";

const OutletClassification = () => {
  const OutletClassificationList = useSelector(
    (state) => state.outletClassificationSlice.outletClassifications
  );
  const page = useSelector((state) => state.outletClassificationSlice.newPage);
  const rowCount = useSelector(
    (state) => state.outletClassificationSlice.newRowsPerPage
  );
  const isLoading = useSelector(
    (state) => state.outletClassificationSlice.isLoading
  );

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
        await getAllOutletClassifications();
      } catch (error) {
        dispatch(setPopupResponse(true));
      }
    };
    fetchData();
  }, [page, rowCount]);

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Outlet Classification List"
        pageNavigation={[
          {
            pageName: "Outlet Classification",
          },
          { pageName: "List" },
        ]}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <TableContainer>
          <Box>
            <DataTable
              getRowId={(row) => row.uId}
              sx={{ ...dataGridStyle }}
              // @ts-ignore
              columns={OutletClassificationTableHeadings}
              data={OutletClassificationList}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              isLoading={isLoading}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.outletClassification.add);
              }}
            />
          </Box>
        </TableContainer>
      </Container>
    </FsBox>
  );
};

export default OutletClassification;
