"use client";

import PopupResponse from "@/components/popup/popup-response";
import PopupView from "@/components/popup/popup-view";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllDistributors } from "@/service/distributor.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation, DataTable } from "@icp/react-fusion";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DistributorTableHeadings, tableOptions } from "./components/table-component-distributor";

const DistributorPage = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const distributorList = useSelector((state) => state.distributor.distributors);
  const page = useSelector((state) => state.distributor.newPage);
  const rowCount = useSelector((state) => state.distributor.newRowsPerPage);
  const isLoading = useSelector((state) => state.distributor.isLoading);
  const distributor = useSelector((state) => state.distributor.distributor);
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const [serverDownError, setServerDownError] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllDistributors(undefined, undefined, undefined, "uId", "desc");
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

  const onAddDistributorBtnClick = () => {
    router.push(PATH_DASHBOARD.distributor.add);
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
        pageTitle="Distributor List"
        pageNavigation={[
          {
            pageName: "Distributor",
            path: PATH_DASHBOARD.distributor.list,
          },
          { pageName: "List" },
        ]}
        onAddClick={onAddDistributorBtnClick}
        onLinkClick={(path: any) => { handleBreadcrumbNavigation(path) }}
        onFullScreenClick={handleFullScreenClick}
        icon={<LocalShippingIcon color="primary" />}
      />
      <Container>
        <TableContainer>
          <Box>
            <DataTable
              getRowId={(row) => row.uId}
              sx={{ ...dataGridStyle }}
              contentHeight={600}
              // @ts-ignore
              columns={DistributorTableHeadings}
              data={distributorList}
              isLoading={isLoading}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.distributor.add);
              }}
            />
          </Box>
        </TableContainer>
      </Container>
      <PopupView
        data={distributor}
        headerName={"Name"}
        headerContent={capitalizeAllWords(distributor?.distributorName)}
        additionalKeysToExclude={["fullName", "shiftId"]}
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

export default DistributorPage;
