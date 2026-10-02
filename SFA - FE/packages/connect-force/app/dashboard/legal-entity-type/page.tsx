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
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllLegaleEntityTypes } from "@/service/legleEntityType.service";
import {
  LegleEntityTypeTableHeadings,
  tableOptions,
} from "./components/table-component-legaleEntityType";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const LegalEntityTypePage = () => {
  const legalEntityTypesList = useSelector(
    (state) => state.legleEntityTypeSlice.legleEntityTypeStates
  );
  const page = useSelector((state) => state.legleEntityTypeSlice.newPage);
  const rowCount = useSelector(
    (state) => state.legleEntityTypeSlice.newRowsPerPage
  );
  const isLoading = useSelector(
    (state) => state.legleEntityTypeSlice.isLoading
  );
  const [isFullScreen, setIsFullScreen] = useState(false);

  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllLegaleEntityTypes();
      } catch (error) {
        dispatch(setPopupResponse(true));
      }
    };
    fetchData();
  }, [page, rowCount]);

  const onAddlegLegalEntityTypeBtnClick = () => {
    router.push(PATH_DASHBOARD.legleEntityType.add);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Legal Entity Type List"
        pageNavigation={[
          {
            pageName: "Legal Entity Type",
            path: PATH_DASHBOARD.legleEntityType.list,
          },
          { pageName: "List " },
        ]}
        onAddClick={onAddlegLegalEntityTypeBtnClick}
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
              columns={LegleEntityTypeTableHeadings}
              data={legalEntityTypesList}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              isLoading={isLoading}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.legleEntityType.add);
              }}
            />
          </Box>
        </TableContainer>
      </Container>
    </FsBox>
  );
};

export default LegalEntityTypePage;
