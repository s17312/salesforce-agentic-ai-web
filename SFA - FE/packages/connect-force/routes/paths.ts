// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = "/dashboard/";

// ----------------------------------------------------------------------

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,

  distributor: {
    add: path(ROOTS_DASHBOARD, "manage-distributors/add"),
    list: path(ROOTS_DASHBOARD, "manage-distributors/"),
    view: path(ROOTS_DASHBOARD, "manage-distributors/view"),
  },
  businesscategory: {
    add: path(ROOTS_DASHBOARD, "business-category/add"),
    list: path(ROOTS_DASHBOARD, "business-category/"),
    view: path(ROOTS_DASHBOARD, "business-category/view"),
  },
  title: {
    add: path(ROOTS_DASHBOARD, "manage-titles/add"),
    list: path(ROOTS_DASHBOARD, "manage-titles/"),
    view: path(ROOTS_DASHBOARD, "manage-titles/view"),
  },
  paymentTerm: {
    add: path(ROOTS_DASHBOARD, "payment-term/add"),
    list: path(ROOTS_DASHBOARD, "payment-term/"),
    view: path(ROOTS_DASHBOARD, "payment-term/view"),
  },
  outletstatus: {
    add: path(ROOTS_DASHBOARD, "outlet-states/add"),
    list: path(ROOTS_DASHBOARD, "outlet-states/"),
    view: path(ROOTS_DASHBOARD, "outlet-states/view"),
  },
  outletClassification: {
    add: path(ROOTS_DASHBOARD, "outlet-classification/add"),
    list: path(ROOTS_DASHBOARD, "outlet-classification/"),
    view: path(ROOTS_DASHBOARD, "outlet-classification/view"),
  },
  outletCategory: {
    add: path(ROOTS_DASHBOARD, "outlet-category/add"),
    list: path(ROOTS_DASHBOARD, "outlet-category/"),
    view: path(ROOTS_DASHBOARD, "outlet-category/view"),
  },
  outlet: {
    addBulk: path(ROOTS_DASHBOARD, "manage-outlets/add-bulk"),
    add: path(ROOTS_DASHBOARD, "manage-outlets/add"),
    list: path(ROOTS_DASHBOARD, "manage-outlets/"),
    view: path(ROOTS_DASHBOARD, "manage-outlets/view"),
  },
  mainOutlet: {
    add: path(ROOTS_DASHBOARD, "main-outlet/add"),
    list: path(ROOTS_DASHBOARD, "main-outlet/"),
    view: path(ROOTS_DASHBOARD, "main-outlet/view"),
  },
  productGroup: {
    add: path(ROOTS_DASHBOARD, "product-group/add"),
    list: path(ROOTS_DASHBOARD, "product-group/"),
    view: path(ROOTS_DASHBOARD, "product-group/view"),
  },
  productCategory: {
    add: path(ROOTS_DASHBOARD, "product-category/add"),
    list: path(ROOTS_DASHBOARD, "product-category/"),
    view: path(ROOTS_DASHBOARD, "product-category/view"),
  },

  paymentMode: {
    add: path(ROOTS_DASHBOARD, "payment-mode/add"),
    list: path(ROOTS_DASHBOARD, "payment-mode/"),
    view: path(ROOTS_DASHBOARD, "payment-mode/view"),
  },
  uom: {
    add: path(ROOTS_DASHBOARD, "uom/add"),
    list: path(ROOTS_DASHBOARD, "uom/"),
    view: path(ROOTS_DASHBOARD, "uom/view"),
  },
  warehouseCategory: {
    add: path(ROOTS_DASHBOARD, "warehouse-category/add"),
    list: path(ROOTS_DASHBOARD, "warehouse-category/"),
    view: path(ROOTS_DASHBOARD, "warehouse-category/view"),
  },
  warehouseType: {
    add: path(ROOTS_DASHBOARD, "warehouse-type/add"),
    list: path(ROOTS_DASHBOARD, "warehouse-type/"),
    view: path(ROOTS_DASHBOARD, "warehouse-type/view"),
  },
  product: {
    addBulk: path(ROOTS_DASHBOARD, "manage-products/add-bulk"),
    add: path(ROOTS_DASHBOARD, "manage-products/add"),
    list: path(ROOTS_DASHBOARD, "manage-products/"),
    view: path(ROOTS_DASHBOARD, "manage-products/view"),
  },
  company: {
    add: path(ROOTS_DASHBOARD, "manage-company/add"),
    list: path(ROOTS_DASHBOARD, "manage-company/"),
    view: path(ROOTS_DASHBOARD, "manage-company/view"),
  },
  warehouse: {
    add: path(ROOTS_DASHBOARD, "warehouse/add"),
    list: path(ROOTS_DASHBOARD, "warehouse/"),
    view: path(ROOTS_DASHBOARD, "warehouse/view"),
  },
  legleEntityType: {
    add: path(ROOTS_DASHBOARD, "legal-entity-type/add"),
    list: path(ROOTS_DASHBOARD, "legal-entity-type/"),
    view: path(ROOTS_DASHBOARD, "legal-entity-type/view"),
  },
  vehicleCategory: {
    add: path(ROOTS_DASHBOARD, "vehicle-category/add"),
    list: path(ROOTS_DASHBOARD, "vehicle-category/"),
    view: path(ROOTS_DASHBOARD, "vehicle-category/view"),
  },
  route: {
    add: path(ROOTS_DASHBOARD, "route/add"),
    list: path(ROOTS_DASHBOARD, "route/"),
    view: path(ROOTS_DASHBOARD, "route/view"),
  },
  vehicle: {
    add: path(ROOTS_DASHBOARD, "vehicle/add"),
    list: path(ROOTS_DASHBOARD, "vehicle/"),
    view: path(ROOTS_DASHBOARD, "vehicle/view"),
  },
  distributorMapper: {
    list: path(ROOTS_DASHBOARD, "mapping/distributor-mapper/"),
    product: path(ROOTS_DASHBOARD, "mapping/distributor-mapper/product"),
    representative: path(
      ROOTS_DASHBOARD,
      "mapping/distributor-mapper/representative"
    ),
    outlet: path(ROOTS_DASHBOARD, "mapping/distributor-mapper/outlet"),
    route: path(ROOTS_DASHBOARD, "mapping/distributor-mapper/route"),
    view: path(ROOTS_DASHBOARD, "mapping/distributor-mapper/view"),
    company: path(ROOTS_DASHBOARD, "mapping/distributor-mapper/company"),
  },
  productMapper: {
    list: path(ROOTS_DASHBOARD, "mapping/product-mapper/"),
    distributor: path(ROOTS_DASHBOARD, "mapping/product-mapper/distributor"),
    view: path(ROOTS_DASHBOARD, "mapping/product-mapper/view"),
    outlet: path(ROOTS_DASHBOARD, "mapping/product-mapper/outlet"),
    company: path(ROOTS_DASHBOARD, "mapping/product-mapper/company"),
    salesRep: path(ROOTS_DASHBOARD, "mapping/product-mapper/salesrep"),
  },
  routeMapper: {
    list: path(ROOTS_DASHBOARD, "mapping/route-mapper/"),
    outlet: path(ROOTS_DASHBOARD, "mapping/route-mapper/outlet"),
    salesrep: path(ROOTS_DASHBOARD, "mapping/route-mapper/salesrep"),
    view: path(ROOTS_DASHBOARD, "mapping/route-mapper/view"),
  },
  companyMapper: {
    list: path(ROOTS_DASHBOARD, "mapping/company-mapper/"),
    product: path(ROOTS_DASHBOARD, "mapping/company-mapper/product"),
    view: path(ROOTS_DASHBOARD, "mapping/company-mapper/view"),
    distributor: path(ROOTS_DASHBOARD, "mapping/company-mapper/distributor"),
  },
  representativeMapper: {
    list: path(ROOTS_DASHBOARD, "mapping/representative-mapper/"),
    product: path(ROOTS_DASHBOARD, "mapping/representative-mapper/product"),
    view: path(ROOTS_DASHBOARD, "mapping/representative-mapper/view"),
    route: path(ROOTS_DASHBOARD, "mapping/representative-mapper/route"),
    outlet: path(ROOTS_DASHBOARD, "mapping/representative-mapper/outlet"),
  },
  outletTransfer: {
    view: path(ROOTS_DASHBOARD, "outlet-transfer/"),
  },
  priceList: {
    add: path(ROOTS_DASHBOARD, "price-list/add"),
    list: path(ROOTS_DASHBOARD, "price-list/"),
    view: path(ROOTS_DASHBOARD, "price-list/view"),
  },
  priceListType: {
    list: path(ROOTS_DASHBOARD, "price-list-type/"),
    add: path(ROOTS_DASHBOARD, "price-list-type/add"),
    view: path(ROOTS_DASHBOARD, "price-list-type/view"),
  },
  deliveryMethod: {
    add: path(ROOTS_DASHBOARD, "delivery-method/add"),
    list: path(ROOTS_DASHBOARD, "delivery-method/"),
    view: path(ROOTS_DASHBOARD, "delivery-method/view"),
  },
  companyStock: {
    view: path(ROOTS_DASHBOARD, "inventory/company-stock/view"),
    adjustment: path(ROOTS_DASHBOARD, "inventory/company-stock/adjustment-add"),
    adjustmentView: path(
      ROOTS_DASHBOARD,
      "inventory/company-stock/adjustment-view"
    ),
    edit: path(ROOTS_DASHBOARD, "inventory/company-stock/adjustment-edit"),
    companyWarehouseStockTransfer: {
      add: path(
        ROOTS_DASHBOARD,
        "inventory/company-stock/company-warehouse-stock-transfer/add"
      ),
      list: path(
        ROOTS_DASHBOARD,
        "inventory/company-stock/company-warehouse-stock-transfer/"
      ),
      view: path(
        ROOTS_DASHBOARD,
        "inventory/company-stock/company-warehouse-stock-transfer/view"
      ),
      edit: path(
        ROOTS_DASHBOARD,
        "inventory/company-stock/company-warehouse-stock-transfer/edit"
      ),
    },
  },
  purchaseOrder: {
    creation: {
      add: path(ROOTS_DASHBOARD, "inventory/purchase-order/add"),
      list: path(ROOTS_DASHBOARD, "inventory/purchase-order/"),
      view: path(ROOTS_DASHBOARD, "inventory/purchase-order/view"),
      edit: path(ROOTS_DASHBOARD, "inventory/purchase-order/edit"),
    },
    approve: {
      view: path(ROOTS_DASHBOARD, "inventory/purchase-order-approve/view"),
      edit: path(ROOTS_DASHBOARD, "inventory/purchase-order-approve/edit"),
    },
    grn: {
      view: path(ROOTS_DASHBOARD, "inventory/grn/view"),
      edit: path(ROOTS_DASHBOARD, "inventory/grn/edit"),
    },
  },
  grnType: {
    add: path(ROOTS_DASHBOARD, "inventory/grn-type/add"),
    list: path(ROOTS_DASHBOARD, "inventory/grn-type/"),
    view: path(ROOTS_DASHBOARD, "inventory/grn-type/view"),
  },
  newDistributorGrn: {
    add: path(ROOTS_DASHBOARD, "inventory/new-grn/add"),
    list: path(ROOTS_DASHBOARD, "inventory/new-grn/view"),
    edit: path(ROOTS_DASHBOARD, "inventory/new-grn/edit"),
  },
  newDistributorGrnDelete: {
    list: path(ROOTS_DASHBOARD, "inventory/new-grn-delete/view"),
    edit: path(ROOTS_DASHBOARD, "inventory/new-grn-delete/edit"),
  },
  assetType: {
    add: path(ROOTS_DASHBOARD, "asset-type/add"),
    list: path(ROOTS_DASHBOARD, "asset-type/"),
    view: path(ROOTS_DASHBOARD, "asset-type/view"),
  },
  salesRepresentative: {
    add: path(ROOTS_DASHBOARD, "sales-representative/add"),
    list: path(ROOTS_DASHBOARD, "sales-representative/"),
    view: path(ROOTS_DASHBOARD, "sales-representative/view"),
  },
  assetBrand: {
    add: path(ROOTS_DASHBOARD, "asset-brand/add"),
    list: path(ROOTS_DASHBOARD, "asset-brand/"),
    view: path(ROOTS_DASHBOARD, "asset-brand/view"),
  },
  assetModel: {
    add: path(ROOTS_DASHBOARD, "asset-model/add"),
    list: path(ROOTS_DASHBOARD, "asset-model/"),
    view: path(ROOTS_DASHBOARD, "asset-model/view"),
  },
  asset: {
    add: path(ROOTS_DASHBOARD, "asset/add"),
    list: path(ROOTS_DASHBOARD, "asset/"),
    view: path(ROOTS_DASHBOARD, "asset/view"),
  },
  distributorStock: {
    adjustmentView: path(
      ROOTS_DASHBOARD,
      "inventory/distributor-stock/adjustment-view"
    ),
    adjustment: path(
      ROOTS_DASHBOARD,
      "inventory/distributor-stock/adjustment-add"
    ),
    edit: path(ROOTS_DASHBOARD, "inventory/distributor-stock/adjustment-edit"),
    view: path(ROOTS_DASHBOARD, "inventory/distributor-stock/view"),
    stockReturnTransfer: {
      list: path(
        ROOTS_DASHBOARD,
        "inventory/distributor-stock/return-transfer"
      ),
      view: path(
        ROOTS_DASHBOARD,
        "inventory/distributor-stock/return-transfer/view"
      ),
      add: path(
        ROOTS_DASHBOARD,
        "inventory/distributor-stock/return-transfer/add"
      ),
      edit: path(
        ROOTS_DASHBOARD,
        "inventory/distributor-stock/return-transfer/edit"
      ),
    },
    distributorWarehouseStockTransfer: {
      add: path(
        ROOTS_DASHBOARD,
        "inventory/distributor-stock/distributor-warehouse-stock-transfer/add"
      ),
      list: path(
        ROOTS_DASHBOARD,
        "inventory/distributor-stock/distributor-warehouse-stock-transfer/"
      ),
      view: path(
        ROOTS_DASHBOARD,
        "inventory/distributor-stock/distributor-warehouse-stock-transfer/view"
      ),
      edit: path(
        ROOTS_DASHBOARD,
        "inventory/distributor-stock/distributor-warehouse-stock-transfer/edit"
      ),
    },
  },
  assetAllocation: {
    add: path(ROOTS_DASHBOARD, "asset-allocation/"),
  },
  assetTransfer: {
    view: path(ROOTS_DASHBOARD, "asset-transfer/"),
  },
  lostCallReason: {
    add: path(ROOTS_DASHBOARD, "lost-callReason/add"),
    list: path(ROOTS_DASHBOARD, "lost-callReason/"),
    view: path(ROOTS_DASHBOARD, "lost-callReason/view"),
  },
  discount: {
    add: path(ROOTS_DASHBOARD, "discount/add"),
    list: path(ROOTS_DASHBOARD, "discount/"),
    view: path(ROOTS_DASHBOARD, "discount/view"),
  },
  discountMapper: {
    list: path(ROOTS_DASHBOARD, "mapping/discount-mapper/"),
    outlet: path(ROOTS_DASHBOARD, "mapping/discount-mapper/outlet"),
    view: path(ROOTS_DASHBOARD, "mapping/discount-mapper/view"),
    distributor: path(ROOTS_DASHBOARD, "mapping/discount-mapper/distributor"),
    representative: path(
      ROOTS_DASHBOARD,
      "mapping/discount-mapper/representative"
    ),
  },
  repTour: {
    repTour: path(ROOTS_DASHBOARD, "rep-tour/"),
    add: path(ROOTS_DASHBOARD, "rep-tour/add"),
    salesInvoice: path(ROOTS_DASHBOARD, "rep-tour/sale/sales-invoice"),
    return: path(ROOTS_DASHBOARD, "rep-tour/sale/sales-invoice/return"),
    lostCall: {
      add: path(ROOTS_DASHBOARD, "rep-tour/sale/lost-call/add"),
    },
    loading: {
      add: path(ROOTS_DASHBOARD, "rep-tour/loading/add"),
      list: path(ROOTS_DASHBOARD, "rep-tour/loading/"),
    },
    invoice: {
      payment: path(ROOTS_DASHBOARD, "rep-tour/sale/sales-invoice/payment"),
    },
    payment: {
      list: path(ROOTS_DASHBOARD, "rep-tour/sale/payment/"),
    },
    createNewInvoice: path(ROOTS_DASHBOARD, "rep-tour/sale/create-new-invoice"),
  },
  salesTour: {
    salesTour: path(ROOTS_DASHBOARD, "sales-tour/"),
    add: path(ROOTS_DASHBOARD, "sales-tour/add"),
    edit: path(ROOTS_DASHBOARD, "sales-tour/edit"),
    salesInvoice: path(ROOTS_DASHBOARD, "sales-tour/sale/sales-invoice"),
    lostCall: {
      add: path(ROOTS_DASHBOARD, "sales-tour/sale/lost-call/add"),
    },
    loading: {
      add: path(ROOTS_DASHBOARD, "sales-tour/loading/add"),
      list: path(ROOTS_DASHBOARD, "sales-tour/loading/"),
    },
    invoice: {
      payment: path(ROOTS_DASHBOARD, "sales-tour/sale/sales-invoice/payment"),
    },
    payment: {
      list: path(ROOTS_DASHBOARD, "sales-tour/sale/payment/"),
      delete: path(ROOTS_DASHBOARD, "sales-tour/sale/payment-deletion"),
    },
    createNewInvoice: path(
      ROOTS_DASHBOARD,
      "sales-tour/sale/create-new-invoice"
    ),
  },
  directSaleTour: {
    directSaleTour: path(ROOTS_DASHBOARD, "direct-sale-tour/"),
    add: path(ROOTS_DASHBOARD, "direct-sale-tour/add"),
    salesInvoice: path(ROOTS_DASHBOARD, "direct-sale-tour/sale/sales-invoice"),
    return: path(ROOTS_DASHBOARD, "direct-sale-tour/sale/sales-invoice/return"),
    lostCall: {
      add: path(ROOTS_DASHBOARD, "direct-sale-tour/sale/lost-call/add"),
    },
    invoice: {
      payment: path(
        ROOTS_DASHBOARD,
        "direct-sale-tour/sale/sales-invoice/payment"
      ),
    },
    payment: {
      list: path(ROOTS_DASHBOARD, "direct-sale-tour/sale/payment/"),
    },
    createNewInvoice: path(
      ROOTS_DASHBOARD,
      "direct-sale-tour/sale/create-new-invoice"
    ),
  },
  returnReason: {
    add: path(ROOTS_DASHBOARD, "return-reason/add"),
    list: path(ROOTS_DASHBOARD, "return-reason/"),
    view: path(ROOTS_DASHBOARD, "return-reason/view"),
  },
  salesUnitType: {
    add: path(ROOTS_DASHBOARD, "sales-unit-type/add"),
    list: path(ROOTS_DASHBOARD, "sales-unit-type/"),
    view: path(ROOTS_DASHBOARD, "sales-unit-type/view"),
  },
  unloadingReason: {
    add: path(ROOTS_DASHBOARD, "unloading-reason/add"),
    list: path(ROOTS_DASHBOARD, "unloading-reason/"),
    view: path(ROOTS_DASHBOARD, "unloading-reason/view"),
  },
  report: {
    companyView: path(ROOTS_DASHBOARD, "report/company-stock/view"),
    distriView: path(ROOTS_DASHBOARD, "report/distributor-stock/view"),
    poGRNSummary: path(ROOTS_DASHBOARD, "report/po-grrn-summary-report"),
    distriMapping: path(ROOTS_DASHBOARD, "report/distributor-mapping"),
    loadingUnloadingSummaryReport: path(
      ROOTS_DASHBOARD,
      "report/loading-unloading-summary-report"
    ),
    tourSummaryReport: path(ROOTS_DASHBOARD, "report/tour-summary-report"),
    invoiceDetailReport: path(ROOTS_DASHBOARD, "report/invoice-detail-report"),
    itemWiseSaleSummaryReport: path(
      ROOTS_DASHBOARD,
      "report/item-wise-sale-summary-report"
    ),
    annualSaleSummaryReport: path(
      ROOTS_DASHBOARD,
      "report/annual-sale-summary-report"
    ),
    invoiceAgingReport: path(ROOTS_DASHBOARD, "report/invoice-aging-report"),
    cashCollectionReport: path(
      ROOTS_DASHBOARD,
      "report/cash-collection-report"
    ),
    chequeCollectionReport: path(
      ROOTS_DASHBOARD,
      "report/cheque-collection-report"
    ),
    dailyCollectionReport: path(
      ROOTS_DASHBOARD,
      "report/daily-collection-report"
    ),
    outletSalesReport: path(ROOTS_DASHBOARD, "report/outlet-sales-report"),
    distributorSalesReport: path(
      ROOTS_DASHBOARD,
      "report/distributor-sales-report"
    ),
    routeWiseOutletReport: path(
      ROOTS_DASHBOARD,
      "report/outlet-mapping-report"
    ),
    discountEligibilityReport: path(
      ROOTS_DASHBOARD,
      "report/discount-eligibility-report"
    ),
    assetStockReport: path(ROOTS_DASHBOARD, "report/asset-stock/"),
  },
  userRole: {
    add: path(ROOTS_DASHBOARD, "user-role/add"),
    list: path(ROOTS_DASHBOARD, "user-role/"),
    view: path(ROOTS_DASHBOARD, "user-role/view"),
  },
  userProfile: {
    add: path(ROOTS_DASHBOARD, "user-profile/add"),
    list: path(ROOTS_DASHBOARD, "user-profile/"),
    view: path(ROOTS_DASHBOARD, "user-profile/view"),
  },
  userRoleAssignment: {
    add: path(ROOTS_DASHBOARD, "user-role-assignment/add"),
    list: path(ROOTS_DASHBOARD, "user-role-assignment/"),
    view: path(ROOTS_DASHBOARD, "user-role-assignment/view"),
  },
  userRolePermission: {
    add: path(ROOTS_DASHBOARD, "user-role-permission/permissions"),
    list: path(ROOTS_DASHBOARD, "user-role-permission/"),
    view: path(ROOTS_DASHBOARD, "user-role-permission/view"),
  },
  resetRequestedPassword: {
    list: path(ROOTS_DASHBOARD, "reset-password/"),
  },
  inventoryDashboard: {
    view: path(ROOTS_DASHBOARD, "inventory/"),
  },
  distributorAccounts: {
    add: path(ROOTS_DASHBOARD, "distributor-accounts/add"),
    list: path(ROOTS_DASHBOARD, "distributor-accounts/"),
    view: path(ROOTS_DASHBOARD, "distributor-accounts/view"),
  },
  paymentSummary: {
    list: path(ROOTS_DASHBOARD, "payment/payment-summary"),
  },
  directPayment: {
    invoicePayment: path(ROOTS_DASHBOARD, "payment/invoice-payment"),
    invoice: {
      payment: path(ROOTS_DASHBOARD, "payment/invoice-payment/payment"),
    },
  },
};
