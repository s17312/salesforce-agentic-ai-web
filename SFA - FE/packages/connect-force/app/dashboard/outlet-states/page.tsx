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
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllOutletStatus } from "@/service/outletStatus.service";
import {
  OutletStatusTableHeadings,
  tableOptions,
} from "./components/table-component-outletStatus";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const OutletStatusPage = () => {
  const outletstatusList = useSelector(
    (state) => state.outletStatusSlice.outletStatuss
  );
  const page = useSelector((state) => state.outletStatusSlice.newPage);
  const rowCount = useSelector(
    (state) => state.outletStatusSlice.newRowsPerPage
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
        await getAllOutletStatus();
      } catch (error) {
        dispatch(setPopupResponse(true));
      }
    };
    fetchData();
  }, [page, rowCount]);

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Outlet Status List"
        pageNavigation={[
          {
            pageName: "Outlet Status",
            path: PATH_DASHBOARD.outletstatus.list,
          },
          { pageName: "List" },
        ]}
        onLinkClick={handleBreadcrumbNavigation}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <TableContainer>
          <Box>
            <DataTable
              getRowId={(row) => row.uId}
              sx={{ ...dataGridStyle }}
              //@ts-ignore
              columns={OutletStatusTableHeadings}
              data={outletstatusList}
              //@ts-ignore
              menuItems={tableOptions.menuItems}
              showToolbar={false}
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.outletstatus.add);
              }}
            />
          </Box>
        </TableContainer>
      </Container>
    </FsBox>
  );
};

export default OutletStatusPage;
