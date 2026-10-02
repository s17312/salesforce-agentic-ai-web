"use client";

import { useEffect, useRef, useState } from "react";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { BreadcrumbNavigation, DataTable } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import PopupResponse from "@/components/popup/popup-response";
import {
  tableOptions,
  WarehouseTableHeadings,
} from "./components/table-component-warehouse";
import { getAllWarehouse } from "@/service/warehouse";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const Warehouses = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [serverDownError, setServerDownError] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const warehouses = useSelector((state) => state.warehouseSlice.warehouses);
  const page = useSelector((state) => state.warehouseSlice.newPage);
  const rowCount = useSelector((state) => state.warehouseSlice.newRowsPerPage);
  const popupResponse = useSelector((state) => state.layout.popupResponse);

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const handleFullScreenClick = () => {
      toggleFullScreen();
      setIsFullScreen((prev) => !prev);
  };

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllWarehouse(page, rowCount, undefined, "uId", "desc");
      } catch (error) {
        dispatch(setPopupResponse(true));
        setServerDownError(true);
      }
    };
    fetchData();
  }, [page, rowCount]);

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Warehouse"
        pageNavigation={[
          {
            pageName: "Warehouse",
            path: PATH_DASHBOARD.warehouse.list,
          },
          { pageName: "List" },
        ]}
        onLinkClick={handleBreadcrumbNavigation}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <TableContainer>
          <DataTable
            getRowId={(row) => row.uId}
            sx={{ ...dataGridStyle }}
            contentHeight={400}
            // @ts-ignore
            columns={WarehouseTableHeadings}
            data={warehouses}
            rowsPerPageOptions={tableOptions.rowsPerPageOptions}
            //@ts-ignore
            filterByColumn={true}
            handleAdd={() => {
              router.push(PATH_DASHBOARD.warehouse.add);
            }}
          />
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

export default Warehouses;
