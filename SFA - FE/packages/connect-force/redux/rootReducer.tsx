import { combineReducers } from "redux";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import layoutReducer from "./slices/layout-slice";
import distributorReducer from "@/redux/slices/distributor-slice";
import outletReducer from "@/redux/slices/outlet-slice";
import provinceReducer from "./slices/province-slice";
import districtReducer from "./slices/district-slice";
import townReducer from "./slices/town-slice";
import titleReducer from "./slices/title-slice";
import businessCategoryReducer from "./slices/business-category-slice";
import paymentTermReducer from "./slices/payment-term-slice";
import paymentModeReducer from "./slices/payment-mode-slice";
import outletStatusReducer from "./slices/outlet-status-slice";
import outletClassificationReducer from "./slices/outlet-classification-slice";
import uomReducer from "./slices/uom-slice";
import routeReducer from "./slices/route-slice";
import outletCategoryReducer from "./slices/outlet-category-slice";
import productGroupReducer from "./slices/product-group-slice";
import productCategorySlice from "./slices/product-category-slice";
import warehouseTypeReducer from "./slices/warehouse-type-slice";
import warehouseCategoryReducer from "./slices/warehouse-category-slice";
import productReducer from "./slices/product-slice";
import companySliceReducer from "./slices/company-slice";
import warehouseReducer from "./slices/warehouse-slice";
import legleEntityTypeSlice from "./slices/legle-entity-type-slice";
import vehicleCategoryReducer from "./slices/vehicle-category-slice";
import vehicleReducer from "./slices/vehicle-slice";
import distributorProductReducer from "./slices/mappers/distributor-product-slice";
import distributorOutletReducer from "./slices/mappers/distributor-outlet-slice";
import distributorRouteSlice from "./slices/mappers/distributor-route-slice";
import routeOutletsSliceReducer from "./slices/mappers/route-outlet-slice";
import distributorCompanyReducer from "./slices/mappers/distributor-company-slice";
import priceTypeReducer from "./slices/price-type-slice";
import priceListTypeReducer from "./slices/price-list-type-slice";
import companyProductsReducer from "./slices/mappers/company-product-slice";
import priceListsReducer from "./slices/price-list-slice";
import outletTransferReducer from "./slices/outlet-transfer-slice";
import deliveryMethodReducer from "./slices/delivery-method-slice";
import assetTypeReducer from "./slices/asset-type-slice";
import salesRepresentativeReducer from "./slices/sales-representative-slice";
import companyStockReducer from "./slices/inventory/company-stock-slice";
import purchaseOrderSlice from "./slices/inventory/purchase-order-slice";
import companyStockAdjustmentReducer from "./slices/inventory/company-stock-adjustment-slice";
import assetBrandReducer from "./slices/asset-brand-slice";
import assetModelReducer from "./slices/asset-model-slice";
import productRepresentativeReducer from "./slices/mappers/product-representative";
import routesRepresentativeReducer from "./slices/mappers/representative-route";
import outletsRepresentativeReducer from "./slices/mappers/representative-outlet";
import assetReducer from "./slices/asset-slice";
import distributorStockAdjustmentReducer from "./slices/inventory/distributor-stock-adjustment-slice";
import distributorStockReducer from "./slices/inventory/distributor-stock-slice";
import distributorSliceReducer from "./slices/distributor-slice";
import distributorRepresentativeReducer from "./slices/mappers/distributor-representative-slice";
import productOutletReducer from "./slices/mappers/product-outlet-slice";
import assetAllocatioTypeSlice from "./slices/asset-allocation-type-slice";
import returnReasonSlice from "./slices/return-reason-slice";
import discountReducer from "./slices/discount/discount-slice";
import assetStockSlice from "./slices/asset-stock-slice";
import tourScheduleSliceReducer from "./slices/tour/tour-schedule-slice";
import tourSalesSliceReducer from "./slices/tour/tour-sales-slice";
import salesUnitTypeSlice from "./slices/sales-unit-type-slice";
import lostCallReducer from "./slices/tour/lost-call/lost-call-slice";
import lostCallReasonReducer from "./slices/lost-call-reason-slice";
import warehouseStockTransferSlice from "./slices/warehouse-stock-transfer-slice";
import tourSalesInvoiceReducer from "./slices/tour/tour-sales-invoice";
import distributorStockReturnTransferSlice from "./slices/inventory/distributor-stock-return-transfer-slice";
import tourSalesPaymentReducer from "./slices/tour/tour-sales-payment";
import unloadingReasonSlice from "./slices/unloading-Reason-slice";
import assetAllocationSlice from "./slices/asset-allocation-slice";
import tourSalesReturnReducer from "./slices/tour/tour-sales-return";
import tourUnloadingReducer from "./slices/tour/tour-sales-unloading";
import distributorMappingReportSlice from "./slices/report/distributor-mapping-report-slice";
import tourSalesDiscountReducer, {
  tourSalesDiscountSlice,
} from "./slices/tour/tour-sales-discount-slice";
import tourSummaryReportSlice from "./slices/report/tour-summary-report-slice";
import tourValueSalesReducer from "./slices/tour/tour-value-sales-slice";
import loadingUnloadingSummaryReportSlice from "./slices/report/loading-unloading-summary-report-slice";
import invoiceAgingReportSlice from "./slices/report/invoice-aging-report-slice";
import cashCollectionReportSlice from "./slices/report/cash-collection-report-slice";
import chequeCollectionReportSlice from "./slices/report/cheque-collection-report-slice";
import dailyCollectionReportSlice from "./slices/report/daily-collection-report-slice";
import outletSalesReportSlice from "./slices/report/outlet-sales-report-slice";
import distributorSalesReportSlice from "./slices/report/distributor-sales-report-slice";
import outletMappingReportSlice from "./slices/report/outlet-mapping-report-slice";
import userRoleSlice from "./slices/user-role-slice";
import userProfileSlice from "./slices/user-management/user-profile-slice";
import userRoleAssignmentSlice from "./slices/user-management/user-role-assignment-slice";
import userRolePermissionReducer from "./slices/user-management/user-role-permission-slice";
import discountEligibilityReportSlice from "./slices/report/discount-eligibility-report-slice";
import resetRequestPasswordSlice from "./slices/user-management/reset-requested-password-slice";
import discountDistributorSlice from "./slices/mappers/discount-distributor-slice";
import discountRepresentativeSlice from "./slices/mappers/discount-representative-slice";
import discountOutletSlice from "./slices/mappers/discount-outlet-slice";
import grnTypeSlice from "./slices/inventory/grn-type-slice";
import newDistributorGrnTypeReducer from "./slices/inventory/new-distributor-grn-type-slice";
import invoiceDetailReportSlice from "./slices/report/invoice-detail-report-slice";
import distributorAccountsSlice from "./slices/distributor-accounts-slice";
import itemWiseSalesSummaryReportSlice from "./slices/report/item-wise-sales-summary-report-slice";
import mainOutletSlice from "./slices/main-outlet-slice";
import poGRNSummaryReportSlice from "./slices/report/po-grn-summary-report-slice";
import annualSaleSummaryReportSlice from "./slices/report/annual-sale-summary-report";
import paymentSummarySliceReducer from "./slices/payment-summary-slice";
import tourScheduleDirectSlice from "./slices/direct-sale/tour-schedule-slice";
import tourDirectSalesSlice from "./slices/direct-sale/tour-sales-slice";
import tourDirectSalesInvoiceSlice from "./slices/direct-sale/tour-sales-invoice";
import tourDirectSalesReturnSlice from "./slices/direct-sale/tour-sales-return";

const createNoopStorage = () => ({
  getItem(_key: string) {
    return Promise.resolve(null);
  },
  setItem(_key: string, value: any) {
    return Promise.resolve(value);
  },
  removeItem(_key: string) {
    return Promise.resolve();
  },
});

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const rootPersistConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
  whitelist: ["tourSalesInvoiceSlice", "tourSalesSlice"],
};

const rootReducer = combineReducers({
  layout: layoutReducer,
  distributor: distributorReducer,
  outlet: outletReducer,
  provinceSlice: provinceReducer,
  districtSlice: districtReducer,
  townSlice: townReducer,
  titleSlice: titleReducer,
  paymentModeSlice: paymentModeReducer,
  businessCategorySlice: businessCategoryReducer,
  paymentTermSlice: paymentTermReducer,
  outletStatusSlice: outletStatusReducer,
  outletClassificationSlice: outletClassificationReducer,
  outletCategorySlice: outletCategoryReducer,
  productGroupSlice: productGroupReducer,
  productCategorySlice: productCategorySlice,
  uomSlice: uomReducer,
  routeSlice: routeReducer,
  warehouseTypeSlice: warehouseTypeReducer,
  warehouseCategorySlice: warehouseCategoryReducer,
  product: productReducer,
  companySlice: companySliceReducer,
  warehouseSlice: warehouseReducer,
  legleEntityTypeSlice: legleEntityTypeSlice,
  vehicleCategorySlice: vehicleCategoryReducer,
  vehicleSlice: vehicleReducer,
  distributorProductSlice: distributorProductReducer,
  distributorOutletSlice: distributorOutletReducer,
  distributorRouteSlice: distributorRouteSlice,
  routeOutletsSlice: routeOutletsSliceReducer,
  distributorCompanySlice: distributorCompanyReducer,
  priceTypeSlice: priceTypeReducer,
  priceListTypeSlice: priceListTypeReducer,
  companyProductsSlice: companyProductsReducer,
  priceListsSlice: priceListsReducer,
  outletTransferSlice: outletTransferReducer,
  deliveryMethodSlice: deliveryMethodReducer,
  assetTypeSlice: assetTypeReducer,
  salesRepresentativeSlice: salesRepresentativeReducer,
  companyStockSlice: companyStockReducer,
  companyStockAdjustmentSlice: companyStockAdjustmentReducer,
  assetBrandSlice: assetBrandReducer,
  assetModelSlice: assetModelReducer,
  assetSlice: assetReducer,
  purchaseOrderSlice: purchaseOrderSlice,
  productRepresentativeSlice: productRepresentativeReducer,
  routesRepresentativeSlice: routesRepresentativeReducer,
  outletsRepresentativeSlice: outletsRepresentativeReducer,
  distributorStockAdjustmentSlice: distributorStockAdjustmentReducer,
  distributorStockSlice: distributorStockReducer,
  distributorSlice: distributorSliceReducer,
  distributorRepresentativeSlice: distributorRepresentativeReducer,
  productOutletSlice: productOutletReducer,
  assetAllocatioTypeSlice: assetAllocatioTypeSlice,
  discountSlice: discountReducer,
  tourScheduleSlice: tourScheduleSliceReducer,
  tourSalesSlice: tourSalesSliceReducer,
  assetAllocationSlice: assetAllocationSlice,
  returnReasonSlice: returnReasonSlice,
  salesUnitTypeSlice: salesUnitTypeSlice,
  assetStockSlice: assetStockSlice,
  lostCallSlice: lostCallReducer,
  lostCallReasonSlice: lostCallReasonReducer,
  warehouseStockTransferSlice: warehouseStockTransferSlice,
  tourSalesInvoiceSlice: tourSalesInvoiceReducer,
  distributorStockReturnTransferSlice: distributorStockReturnTransferSlice,
  tourSalesPaymentSlice: tourSalesPaymentReducer,
  unloadingReasonSlice: unloadingReasonSlice,
  tourSalesReturnSlice: tourSalesReturnReducer,
  tourUnloadingSlice: tourUnloadingReducer,
  distributorMappingReportSlice: distributorMappingReportSlice,
  tourSalesDiscountSlice: tourSalesDiscountReducer,
  tourSummaryReportSlice: tourSummaryReportSlice,
  tourValueSalesSlice: tourValueSalesReducer,
  loadingUnloadingSummaryReportSlice: loadingUnloadingSummaryReportSlice,
  invoiceAgingReportSlice: invoiceAgingReportSlice,
  cashCollectionReportSlice: cashCollectionReportSlice,
  chequeCollectionReportSlice: chequeCollectionReportSlice,
  dailyCollectionReportSlice: dailyCollectionReportSlice,
  outletSalesReportSlice: outletSalesReportSlice,
  distributorSalesReportSlice: distributorSalesReportSlice,
  outletMappingReportSlice: outletMappingReportSlice,
  userRoleSlice: userRoleSlice,
  userProfileSlice: userProfileSlice,
  userRoleAssignmentSlice: userRoleAssignmentSlice,
  userRolePermissionSlice: userRolePermissionReducer,
  discountEligibilityReportSlice: discountEligibilityReportSlice,
  resetRequestPasswordSlice: resetRequestPasswordSlice,
  discountDistributorSlice: discountDistributorSlice,
  discountOutletSlice: discountOutletSlice,
  discountRepresentativeSlice: discountRepresentativeSlice,
  newDistributorGrnSlice: newDistributorGrnTypeReducer,
  grnTypeSlice: grnTypeSlice,
  invoiceDetailReportSlice: invoiceDetailReportSlice,
  distributorAccountsSlice: distributorAccountsSlice,
  itemWiseSalesSummaryReportSlice: itemWiseSalesSummaryReportSlice,
  mainOutletSlice: mainOutletSlice,
  poGRNSummaryReportSlice: poGRNSummaryReportSlice,
  annualSaleSummaryReportSlice: annualSaleSummaryReportSlice,
  paymentSummarySlice: paymentSummarySliceReducer,
  tourScheduleDirectSlice: tourScheduleDirectSlice,
  tourDirectSalesSlice: tourDirectSalesSlice,
  tourDirectSalesInvoiceSlice: tourDirectSalesInvoiceSlice,
  tourDirectSalesReturnSlice: tourDirectSalesReturnSlice
});

export { rootPersistConfig, rootReducer };
