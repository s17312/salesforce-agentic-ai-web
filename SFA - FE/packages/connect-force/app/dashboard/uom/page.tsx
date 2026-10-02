"use client";

import React, { useEffect, useRef, useState } from "react";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import { getAllUOMs } from "@/service/uom.service";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { BreadcrumbNavigation, DataTable } from "@icp/react-fusion";
import { Box } from "@mui/material";
import { tableOptions } from "../uom/components/table-component-uom";
import { UOMTableHeadings } from "./components/table-component-uom";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const UOM = () => {
  const UOMList = useSelector((state) => state.uomSlice.uoms);
  const page = useSelector((state) => state.uomSlice.newPage);
  const rowCount = useSelector((state) => state.uomSlice.newRowsPerPage);
  const isLoading = useSelector((state) => state.uomSlice.isLoading);

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
        await getAllUOMs(page, rowCount, undefined, "uId", "desc");
      } catch (error) {
        dispatch(setPopupResponse(true));
      }
    };
    fetchData();
  }, [page, rowCount]);

  const onAddUOMBtnClick = () => {
    router.push(PATH_DASHBOARD.uom.add);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };
  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Unit of Measurement List"
        pageNavigation={[
          {
            pageName: "Unit of Measurement",
            path: PATH_DASHBOARD.uom.list,
          },
          { pageName: "List" },
        ]}
        onAddClick={onAddUOMBtnClick}
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
              columns={UOMTableHeadings}
              data={UOMList}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              isLoading={isLoading}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.uom.add);
              }}
            />
          </Box>
        </TableContainer>
      </Container>
    </FsBox>
  );
};

export default UOM;
