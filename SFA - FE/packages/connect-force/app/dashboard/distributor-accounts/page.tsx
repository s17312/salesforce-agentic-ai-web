"use client";

import PopupResponse from "@/components/popup/popup-response";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
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
import {
  DistributorAccountsTableHeadings,
  tableOptions,
} from "./components/table-component-distributor-accounts";
import { getAllDistributorAccounts } from "@/service/distributor-accounts-service";

const DistributorAccountsPage = () => {
  const distributorAccountsList = useSelector(
    (state) => state.distributorAccountsSlice.distributorAccountsDetails
  );
  const page = useSelector((state) => state.distributorAccountsSlice.newPage);
  const rowCount = useSelector(
    (state) => state.distributorAccountsSlice.newRowsPerPage
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const isLoading = useSelector(
    (state) => state.distributorAccountsSlice.isLoading
  );
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
        await getAllDistributorAccounts(page, rowCount, undefined, "uId", "desc");
      } catch (error) {
        dispatch(setPopupResponse(true));
        setServerDownError(true);
      }
    };
    fetchData();
  }, [page, rowCount]);

  const onAddDistributorAccountsBtnClick = () => {
    router.push(PATH_DASHBOARD.lostCallReason.add);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Distributor Accounts List"
        pageNavigation={[
          {
            pageName: "Distributor Accounts",
            path: PATH_DASHBOARD.distributorAccounts.list,
          },
          { pageName: "List" },
        ]}
        onAddClick={onAddDistributorAccountsBtnClick}
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
              columns={DistributorAccountsTableHeadings}
              data={distributorAccountsList}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              isLoading={isLoading}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.distributorAccounts.add);
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

export default DistributorAccountsPage;
