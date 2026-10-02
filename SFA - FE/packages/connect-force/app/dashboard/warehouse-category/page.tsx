"use client";

import PopupResponse from "@/components/popup/popup-response";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllWarehouseCategoryDetails } from "@/service/warehouse-category.service";
import { Container, TableContainer } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { BreadcrumbNavigation, DataTable } from "@icp/react-fusion";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { WarehouseCategoryTableHeadings, tableOptions } from "./components/table-component-warehouseCategory";

const WarehouseCategoryPage = () => {
  const warehouseCategoryList = useSelector((state) => state.warehouseCategorySlice.warehouseCategoryDetails);
  const page = useSelector((state) => state.warehouseCategorySlice.newPage);
  const rowCount = useSelector((state) => state.warehouseCategorySlice.newRowsPerPage);
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const isLoading = useSelector((state) => state.warehouseCategorySlice.isLoading);
  const [serverDownError, setServerDownError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllWarehouseCategoryDetails(
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

  const onAddWarehouseCategoryBtnClick = () => {
    router.push(PATH_DASHBOARD.warehouseCategory.add);
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
    <>
      <BreadcrumbNavigation
        pageTitle="Warehouse Category List"
        pageNavigation={[
          {
            pageName: "Warehouse Category",
            path: PATH_DASHBOARD.warehouseCategory.list,
          },
          { pageName: "List" },
        ]}
        onAddClick={onAddWarehouseCategoryBtnClick}
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
              columns={WarehouseCategoryTableHeadings}
              data={warehouseCategoryList}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              isLoading={isLoading}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.warehouseCategory.add);
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
    </>
  );
};

export default WarehouseCategoryPage;
