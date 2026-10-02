// packages/connect-force/services/reportService.ts
import { useState, useEffect } from "react";
import { getCurrentDate } from "@/utils/reports/reportUtils";

export const useCSReportGeneration = (
  getValues: any,
  companiesOptions: any,
  priceListOptions: any,
  warehousesOptions: any,
  productCategoriesOptions: any,
  productGroupsOptions: any,
  productsOptions: any
) => {
  const [companyInfo, setCompanyInfo] = useState({
    company: "",
    priceList: "",
    warehouse: [],
    productCategory: [],
    productGroup: [],
    product: [],
  });

  const [open, setOpen] = useState(false);

  const fileName = `Company Stock View - ${getCurrentDate()}`;

  const {
    companyUId,
    priceListUId,
    warehouseUId,
    productCategotiesUId,
    productGroupsUId,
    productUId,
  } = getValues();

  const companyName = companyUId
    ? companiesOptions.find((company: any) => company.value === companyUId)
        ?.label
    : "Company ID is undefined";

    const priceListName = priceListOptions.find(
    (priceList: any) => priceList.value === priceListUId
  )?.label;

  const warehouseNames = (warehouseUId || []).map((id: any) => {
    return (
      warehousesOptions.find((warehouse: any) => warehouse.value === id)
        ?.label || "Undefined Warehouse"
    );
  });

  const productCategotiesNames = (productCategotiesUId || []).map((id: any) => {
    return (
      productCategoriesOptions.find(
        (productCategory: any) => productCategory.value === id
      )?.label || "Undefined Product Category"
    );
  });

  const productGroupsNames = (productGroupsUId || []).map((id: any) => {
    return (
      productGroupsOptions.find(
        (productGroup: any) => productGroup.value === id
      )?.label || "Undefined Product Group"
    );
  });

  const productNames = (productUId || []).map((id: any) => {
    return (
      productsOptions.find((product: any) => product.value === id)?.label ||
      "Undefined Product"
    );
  });

  useEffect(() => {
    setCompanyInfo({
      company: companyName,
      priceList: priceListName,
      warehouse: warehouseNames,
      productCategory: productCategotiesNames,
      productGroup: productGroupsNames,
      product: productNames,
    });
  }, [
    companyUId,
    priceListUId,
    warehouseUId,
    productCategotiesUId,
    productGroupsUId,
    productUId,
  ]);

  const handleClose = () => {
    setOpen(false);
  };

  return { companyInfo, open, setOpen, fileName, handleClose };
};
