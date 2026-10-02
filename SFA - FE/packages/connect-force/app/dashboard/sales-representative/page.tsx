"use client";

import PopupResponse from "@/components/popup/popup-response";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllSalesRepresentativeDetails } from "@/service/salesRepresentative.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import {
    Container,
    TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation, DataTable } from "@icp/react-fusion";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SalesRepresentativeTableHeadings, tableOptions } from "./components/table-component-sales-rep";

const SalesRepresentativePage = () => {
  const salesRepresentativeList = useSelector(
    (state) => state.salesRepresentativeSlice.salesRepresentativeDetails
  );
  const page = useSelector((state) => state.salesRepresentativeSlice.newPage);
  const rowCount = useSelector(
    (state) => state.salesRepresentativeSlice.newRowsPerPage
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const isLoading = useSelector((state) => state.salesRepresentativeSlice.isLoading);
  const [serverDownError, setServerDownError] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllSalesRepresentativeDetails(
          page,
          rowCount,
          undefined,
          "uId",
          "desc"
        );
      } catch (error) {
        dispatch(setPopupResponse(true));
        setServerDownError(true);
      }
    };
    fetchData();
  }, [page, rowCount]);

  const onAddSalesRepresentativeBtnClick = () => {
    router.push(PATH_DASHBOARD.salesRepresentative.add);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  const handleFullScreenClick = () => {
      toggleFullScreen();
      setIsFullScreen((prev) => !prev);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Sales Representative List"
        pageNavigation={[
          {
            pageName: "Sales Representative",
            path: PATH_DASHBOARD.salesRepresentative.list,
          },
          { pageName: "List" },
        ]}
        onAddClick={onAddSalesRepresentativeBtnClick}
        onFullScreenClick={handleFullScreenClick}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
      />
      <Container>
        <TableContainer>
          <Box>
            <DataTable
              getRowId={(row) => row.uId}
              sx={{ ...dataGridStyle }}
              contentHeight={400}
              // @ts-ignore
              columns={SalesRepresentativeTableHeadings}
              data={salesRepresentativeList}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              isLoading={isLoading}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.salesRepresentative.add);
              }}
            />
          </Box>
        </TableContainer>
      </Container>
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

export default SalesRepresentativePage;
