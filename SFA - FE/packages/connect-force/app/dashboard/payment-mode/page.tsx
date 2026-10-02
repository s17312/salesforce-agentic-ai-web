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
import { getAllPaymentModes } from "@/service/paymentMode.service";
import {
  PaymentModeTableHeadings,
  tableOptions,
} from "./components/table-component-paymentMode";
import PopupView from "@/components/popup/popup-view";
import PopupResponse from "@/components/popup/popup-response";
import { PATH_DASHBOARD } from "@/routes/paths";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const PaymentModePage = () => {
  const paymentModeList = useSelector(
    (state) => state.paymentModeSlice.paymentModes
  );
  const page = useSelector((state) => state.paymentModeSlice.newPage);
  const rowCount = useSelector(
    (state) => state.paymentModeSlice.newRowsPerPage
  );
  const isLoading = useSelector((state) => state.paymentModeSlice.isLoading);
  const paymentMode = useSelector(
    (state) => state.paymentModeSlice.paymentMode
  );
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
        await getAllPaymentModes();
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

  const onAddPaymentModeBtnClick = () => {
    router.push(PATH_DASHBOARD.paymentMode.add);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Payment Mode List"
        pageNavigation={[
          {
            pageName: "Payment Mode",
            path: PATH_DASHBOARD.paymentMode.list,
          },
          { pageName: "List" },
        ]}
        onAddClick={onAddPaymentModeBtnClick}
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
              columns={PaymentModeTableHeadings}
              data={paymentModeList}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              isLoading={isLoading}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.paymentMode.add);
              }}
            />
          </Box>
        </TableContainer>
      </Container>
      <PopupView
        data={paymentMode}
        headerName={"Description"}
        headerContent={capitalizeAllWords(paymentMode?.description)}
        additionalKeysToExclude={["description", "shiftId"]}
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

export default PaymentModePage;
