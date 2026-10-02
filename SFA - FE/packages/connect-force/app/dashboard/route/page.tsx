"use client";

import React, { useEffect, useRef, useState } from "react";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import { getAllRoutes } from "@/service/route.service";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { BreadcrumbNavigation, DataTable } from "@icp/react-fusion";
import { Box } from "@mui/material";
import { tableOptions } from "../route/components/table-component-route";
import { RouteTableHeadings } from "./components/table-component-route";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const Route = () => {
  const RouteList = useSelector((state) => state.routeSlice.routes);
  const page = useSelector((state) => state.routeSlice.newPage);
  const rowCount = useSelector((state) => state.routeSlice.newRowsPerPage);
  const isLoading = useSelector((state) => state.routeSlice.isLoading);

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
        await getAllRoutes();
      } catch (error) {
        dispatch(setPopupResponse(true));
      }
    };
    fetchData();
  }, [page, rowCount]);

  const onAddRouteBtnClick = () => {
    router.push(PATH_DASHBOARD.route.add);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Route List"
        pageNavigation={[
          {
            pageName: "Route",
            path: PATH_DASHBOARD.route.list,
          },
          { pageName: "List" },
        ]}
        onAddClick={onAddRouteBtnClick}
        onFullScreenClick={handleFullScreenClick}
        onLinkClick={handleBreadcrumbNavigation}
      />
      <Container>
        <TableContainer>
          <Box>
            <DataTable
              getRowId={(row) => row.uId}
              sx={{ ...dataGridStyle }}
              contentHeight={400}
              // @ts-ignore
              columns={RouteTableHeadings}
              data={RouteList}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              isLoading={isLoading}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.route.add);
              }}
            />
          </Box>
        </TableContainer>
      </Container>
    </FsBox>
  );
};

export default Route;
