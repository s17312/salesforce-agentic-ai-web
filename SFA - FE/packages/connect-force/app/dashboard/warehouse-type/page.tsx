"use client";

import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllWarehouseTypes } from "@/service/warehouseType.service";
import { Container, TableContainer } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { BreadcrumbNavigation, DataTable } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { WarehouseTableHeadings, tableOptions } from "./components/table-component-warehouse";
import PopupResponse from "@/components/popup/popup-response";

const WarehouseType = () => {
  const router = useRouter();
  const [serverDownError, setServerDownError] = useState(false);
  const warehouseTypes = useSelector((state) => state.warehouseTypeSlice.warehouseTypes);
  const page = useSelector((state) => state.warehouseTypeSlice.newPage);
  const rowCount = useSelector((state) => state.warehouseTypeSlice.newRowsPerPage);
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const isLoading = useSelector((state) => state.warehouseTypeSlice.isLoading);

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllWarehouseTypes(page, rowCount, undefined, "uId", 'desc');
      } catch (error) {
        dispatch(setPopupResponse(true));
        setServerDownError(true);
      }
    };
    fetchData();
  }, [page, rowCount]);

  return (
    <>
      <BreadcrumbNavigation
        pageTitle="Warehouse Type"
        pageNavigation={[
          {
            pageName: "Warehouse Type",
            path: PATH_DASHBOARD.warehouseType.list
          },
          { pageName: "List" },
        ]}
        onLinkClick={handleBreadcrumbNavigation}
      />
      <Container>
        <TableContainer>
          <DataTable
            getRowId={(row) => row.uId}
            sx={{ ...dataGridStyle }}
            contentHeight={400}
            // @ts-ignore
            columns={WarehouseTableHeadings}
            data={warehouseTypes}
            rowsPerPageOptions={tableOptions.rowsPerPageOptions}
            isLoading={isLoading}
            //@ts-ignore
            filterByColumn={true}
            handleAdd={() => {
              router.push(PATH_DASHBOARD.warehouseType.add);
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
    </>
  );
};
export default WarehouseType;
