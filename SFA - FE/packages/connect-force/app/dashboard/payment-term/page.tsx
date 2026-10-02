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
import {
  PaymentTermTableHeadings,
  tableOptions,
} from "./components/table-component-paymentTerm";
import PopupView from "@/components/popup/popup-view";
import PopupResponse from "@/components/popup/popup-response";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllPaymentTerms } from "@/service/paymentTerm.service";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
const PaymentTermPage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const paymentTermList = useSelector(
    (state) => state.paymentTermSlice.paymentTerms
  );
  const page = useSelector((state) => state.paymentTermSlice.newPage);
  const rowCount = useSelector(
    (state) => state.paymentTermSlice.newRowsPerPage
  );
  const isLoading = useSelector((state) => state.paymentTermSlice.isLoading);
  const paymentTerm = useSelector(
    (state) => state.paymentTermSlice.paymentTerm
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);

  const [serverDownError, setServerDownError] = useState(false);

  const router = useRouter();
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllPaymentTerms();
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

  const onAddPaymentTermBtnClick = () => {
    router.push(PATH_DASHBOARD.paymentTerm.add);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Payment Term List"
        pageNavigation={[
          {
            path: PATH_DASHBOARD.paymentTerm.list,
            pageName: "Payment Term",
          },
          { pageName: "List" },
        ]}
        onFullScreenClick={handleFullScreenClick}
        onAddClick={onAddPaymentTermBtnClick}
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
              columns={PaymentTermTableHeadings}
              data={paymentTermList}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              isLoading={isLoading}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.paymentTerm.add);
              }}
            />
          </Box>
        </TableContainer>
      </Container>
      <PopupView
        data={paymentTerm}
        headerName={"Description"}
        headerContent={capitalizeAllWords(paymentTerm?.description)}
        additionalKeysToExclude={["description", "shiftId"]}
      />
      {popupResponse && <PopupResponse type={"success"} message={"success"} />}
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

export default PaymentTermPage;
