import { PATH_DASHBOARD } from "@/routes/paths";
import { Icon } from "@iconify/react/dist/iconify.js";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import BusinessIcon from "@mui/icons-material/Business";
import CategoryIcon from "@mui/icons-material/Category";
import DatasetLinkedIcon from "@mui/icons-material/DatasetLinked";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import InventoryIcon from "@mui/icons-material/Inventory";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MoveUpIcon from "@mui/icons-material/MoveUp";
import RouteIcon from "@mui/icons-material/Route";
import StoreIcon from "@mui/icons-material/Store";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import PeopleIcon from "@mui/icons-material/People";
import DiscountIcon from "@mui/icons-material/Discount";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SummarizeIcon from "@mui/icons-material/Summarize";
import LockResetIcon from "@mui/icons-material/LockReset";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PaidIcon from "@mui/icons-material/Paid";

export const navItems = [
  {
    id: 1000012,
    subheader: "Dashboard",
    items: [
      {
        id: 20000026,
        label: "Home",
        icon: <DashboardIcon />,
        path: PATH_DASHBOARD.root,
      },
    ],
  },
  {
    id: 1000001,
    subheader: "Master Data",
    items: [
      {
        id: 20000001,
        label: "Distributor",
        icon: <LocalShippingIcon />,
        path: PATH_DASHBOARD.distributor.list,
        subItems: [
          {
            id: 3000001,
            label: "Business Category",
            path: PATH_DASHBOARD.businesscategory.list,
          },
          { id: 3000002, label: "Title", path: PATH_DASHBOARD.title.list },
          {
            id: 3000003,
            label: "Payment Term",
            path: PATH_DASHBOARD.paymentTerm.list,
          },
        ],
      },
      {
        id: 20000057,
        label: "Main Outlet",
        icon: <StoreIcon />,
        path: PATH_DASHBOARD.mainOutlet.list,
        subItems: [],
      },
      {
        id: 20000002,
        label: "Outlet",
        icon: <StoreIcon />,
        path: PATH_DASHBOARD.outlet.list,
        subItems: [
          {
            id: 3000004,
            label: "Outlet Category",
            path: PATH_DASHBOARD.outletCategory.list,
          },
          {
            id: 3000005,
            label: "Outlet Status",
            path: PATH_DASHBOARD.outletstatus.list,
          },
          {
            id: 3000006,
            label: "Outlet Classification",
            path: PATH_DASHBOARD.outletClassification.list,
          },
          {
            id: 3000007,
            label: "Payment Mode",
            path: PATH_DASHBOARD.paymentMode.list,
          },
        ],
      },
      {
        id: 20000003,
        label: "Product",
        icon: <CategoryIcon />,
        path: PATH_DASHBOARD.product.list,
        subItems: [
          {
            id: 3000008,
            label: "Product Category",
            path: PATH_DASHBOARD.productCategory.list,
          },
          {
            id: 3000009,
            label: "Product Group",
            path: PATH_DASHBOARD.productGroup.list,
          },
          {
            id: 3000010,
            label: "Unit of Measurement",
            path: PATH_DASHBOARD.uom.list,
          },
        ],
      },
      {
        id: 20000004,
        label: "Warehouse",
        icon: <WarehouseIcon />,
        path: PATH_DASHBOARD.warehouse.list,
        subItems: [
          //commented this for now until need the future
          // {
          //   id: 3000011,
          //   label: "Warehouse Category",
          //   path: PATH_DASHBOARD.warehouseCategory.list,
          // },
        ],
      },
      {
        id: 20000005,
        label: "Vehicle",
        icon: <DirectionsCarIcon />,
        path: PATH_DASHBOARD.vehicle.list,
        subItems: [
          {
            id: 3000013,
            label: "Vehicle Category",
            path: PATH_DASHBOARD.vehicleCategory.list,
          },
        ],
      },
      {
        id: 20000006,
        label: "Company",
        icon: <BusinessIcon />,
        path: PATH_DASHBOARD.company.list,
        subItems: [
          {
            id: 3000014,
            label: "Legal Entity Type",
            path: PATH_DASHBOARD.legleEntityType.list,
          },
        ],
      },
      {
        id: 20000007,
        label: "Route",
        icon: <RouteIcon />,
        path: PATH_DASHBOARD.route.list,
        subItems: [],
      },
      {
        id: 20000024,
        label: "Sales Unit Type",
        icon: <ListAltRoundedIcon />,
        path: PATH_DASHBOARD.salesUnitType.list,
      },
      {
        id: 20000054,
        label: "GRN Type",
        icon: <FormatListBulletedIcon />,
        path: PATH_DASHBOARD.grnType.list,
      },
      {
        id: 20000055,
        label: "Account",
        icon: <AccountBoxIcon />,
        path: PATH_DASHBOARD.distributorAccounts.list,
      },
    ],
  },
  {
    id: 1000007,
    subheader: "User Management",
    items: [
      {
        id: 20000016,
        label: "Sales Representative",
        icon: <SupervisorAccountIcon />,
        path: PATH_DASHBOARD.salesRepresentative.list,
        subItems: [],
      },
      {
        id: 20000041,
        label: "User Role",
        icon: <ManageAccountsIcon />,
        path: PATH_DASHBOARD.userRole.list,
        subItems: [],
      },
      {
        id: 20000042,
        label: "User Profile",
        icon: <ManageAccountsIcon />,
        path: PATH_DASHBOARD.userProfile.list,
        subItems: [],
      },
      {
        id: 20000043,
        label: "User Role Assignment",
        icon: <ManageAccountsIcon />,
        path: PATH_DASHBOARD.userRoleAssignment.list,
        subItems: [],
      },
      {
        id: 20000044,
        label: "User Role Permission",
        path: PATH_DASHBOARD.userRolePermission.list,
        icon: <ManageAccountsIcon />,
      },
      {
        id: 20000046,
        label: "Reset Password",
        path: PATH_DASHBOARD.resetRequestedPassword.list,
        icon: <LockResetIcon />,
      },
    ],
  },
  {
    id: 1000002,
    subheader: "Mapping",
    items: [
      {
        id: 20000011,
        label: "Company Mapping",
        icon: <DatasetLinkedIcon />,
        path: PATH_DASHBOARD.companyMapper.list,
      },
      {
        id: 20000008,
        label: "Distributor Mapping",
        icon: <DatasetLinkedIcon />,
        path: PATH_DASHBOARD.distributorMapper.list,
      },
      {
        id: 20000012,
        label: "Representative Mapping",
        icon: <DatasetLinkedIcon />,
        path: PATH_DASHBOARD.representativeMapper.list,
      },
      {
        id: 20000010,
        label: "Route Mapping",
        icon: <DatasetLinkedIcon />,
        path: PATH_DASHBOARD.routeMapper.list,
      },
      {
        id: 20000009,
        label: "Product Mapping",
        icon: <DatasetLinkedIcon />,
        path: PATH_DASHBOARD.productMapper.list,
      },
      {
        id: 20000021,
        label: "Discount Mapping",
        icon: <DatasetLinkedIcon />,
        path: PATH_DASHBOARD.discountMapper.list,
      },
      {
        id: 20000013,
        label: "Outlet Transfer",
        icon: <MoveUpIcon />,
        path: PATH_DASHBOARD.outletTransfer.view,
      },
    ],
  },
  {
    id: 1000003,
    subheader: "Pricing",
    items: [
      {
        id: 20000013,
        label: "Price List Details",
        icon: <ListAltRoundedIcon />,
        path: PATH_DASHBOARD.priceList.list,
        subItems: [
          {
            id: 3000015,
            label: "Price List Type",
            path: PATH_DASHBOARD.priceListType.list,
          },
        ],
      },
    ],
  },
  {
    id: 10000017,
    subheader: "Payment",
    path: PATH_DASHBOARD.paymentSummary.list,
    items: [
      {
        id: 20000089,
        label: "Payment Summary",
        icon: <PaidIcon />,
        path: PATH_DASHBOARD.paymentSummary.list,
        subItems: [],
      },
      {
        id: 20000090,
        label: "Direct Payment",
        icon: <PaidIcon />,
        path: PATH_DASHBOARD.directPayment.invoicePayment,
        subItems: [],
      },
    ],
  },
  {
    id: 1000004,
    subheader: "Inventory",
    items: [
      {
        id: 20000053,
        label: "Inventory Dashboard",
        icon: <DashboardIcon />,
        path: PATH_DASHBOARD.inventoryDashboard.view,
      },
      {
        id: 20000014,
        label: "Company Stock",
        icon: <InventoryIcon />,
        subItems: [
          {
            id: 3000017,
            label: "Stock View",
            path: PATH_DASHBOARD.companyStock.view,
          },
          {
            id: 3000016,
            label: "Stock Adjustment",
            path: PATH_DASHBOARD.companyStock.adjustmentView,
          },
          {
            id: 3000027,
            label: "WH Stock Transfer",
            path: PATH_DASHBOARD.companyStock.companyWarehouseStockTransfer
              .list,
          },
        ],
      },
      {
        id: 20000018,
        label: "Distributor Stock",
        icon: <InventoryIcon />,
        subItems: [
          {
            id: 3000024,
            label: "Distributor Stock View",
            path: PATH_DASHBOARD.distributorStock.view,
          },
          {
            id: 3000023,
            label: "Distributor Stock Adjustment",
            path: PATH_DASHBOARD.distributorStock.adjustmentView,
          },
          {
            id: 3000025,
            label: "Stock Return Transfer",
            path: PATH_DASHBOARD.distributorStock.stockReturnTransfer.list,
          },
          {
            id: 3000026,
            label: "Distributor WH Stock Transfer",
            path: PATH_DASHBOARD.distributorStock
              .distributorWarehouseStockTransfer.list,
          },
        ],
      },
    ],
  },
  {
    id: 1000005,
    subheader: "Procurement",
    items: [
      {
        id: 20000015,
        label: "Purchase Order",
        icon: <InventoryIcon />,
        subItems: [
          {
            id: 3000020,
            label: "PO Creation",
            path: PATH_DASHBOARD.purchaseOrder.creation.view,
          },
          {
            id: 3000021,
            label: "PO Approval",
            path: PATH_DASHBOARD.purchaseOrder.approve.view,
          },
          {
            id: 3000022,
            label: "GRN",
            path: PATH_DASHBOARD.purchaseOrder.grn.view,
          },
        ],
      },
      {
        id: 200025015,
        label: "Direct GRN",
        icon: <EditNoteIcon />,
        subItems: [
          // {
          //   id: 3003020,
          //   label: "Company GRN",
          //   path: PATH_DASHBOARD.newDistributorGrn.list,
          // },
          {
            id: 3003022,
            label: "Distributor GRN",
            path: PATH_DASHBOARD.newDistributorGrn.list,
          },
          {
            id: 3003023,
            label: "Distributor GRN Delete",
            path: PATH_DASHBOARD.newDistributorGrnDelete.list,
          },
        ],
      },
    ],
  },
  {
    id: 1000006,
    subheader: "Settings",
    path: PATH_DASHBOARD.deliveryMethod.list,
    items: [
      {
        id: 20000016,
        label: "Delivery Method",
        icon: <AirportShuttleIcon />,
        path: PATH_DASHBOARD.deliveryMethod.list,
        subItems: [],
      },
      {
        id: 20000022,
        label: "Return Reason",
        icon: <InventoryIcon />,
        path: PATH_DASHBOARD.returnReason.list,
      },
      {
        id: 20000025,
        label: "Unloading Reason",
        icon: <InventoryIcon />,
        path: PATH_DASHBOARD.unloadingReason.list,
      },
      {
        id: 20000032,
        label: "Lost Call Reason",
        icon: <InventoryIcon />,
        path: PATH_DASHBOARD.lostCallReason.list,
      },
    ],
  },
  {
    id: 1000008,
    subheader: "Discount",
    path: PATH_DASHBOARD.discount.list,
    items: [
      {
        id: 20000020,
        label: "Discount",
        icon: <DiscountIcon />,
        path: PATH_DASHBOARD.discount.list,
        subItems: [],
      },
    ],
  },
  {
    id: 1000009,
    subheader: "Sales Tour",
    items: [
      {
        id: 20000023,
        path: PATH_DASHBOARD.repTour.repTour,
        label: "Sales Tour",
        icon: <PeopleIcon />,
      },
      {
        id: 20000027,
        path: PATH_DASHBOARD.salesTour.salesTour,
        label: "Sales Journey",
        icon: <PeopleIcon />,
      },
      {
        id: 20000059,
        path: PATH_DASHBOARD.directSaleTour.directSaleTour,
        label: "Direct Sale",
        icon: <PeopleIcon />,
      },
    ],
  },
  {
    id: 1000011,
    subheader: "Report",
    items: [
      {
        id: 20000047,
        label: "Inventory Reports",
        icon: <SummarizeIcon />,
        subItems: [
          {
            id: 20000028,
            label: "Company Stock Report",
            path: PATH_DASHBOARD.report.companyView,
          },
          {
            id: 20000029,
            label: "Distributor Stock Report",
            path: PATH_DASHBOARD.report.distriView,
          },
          {
            id: 20000029,
            label: "PO GRN Summary Report",
            path: PATH_DASHBOARD.report.poGRNSummary,
          },
        ],
      },
      {
        id: 20000048,
        label: "Sales Reports",
        icon: <SummarizeIcon />,
        subItems: [
          {
            id: 20000038,
            label: "Outlet Wise Sales Report",
            path: PATH_DASHBOARD.report.outletSalesReport,
          },
          {
            id: 20000039,
            label: "Distributor Wise Sales Report",
            path: PATH_DASHBOARD.report.distributorSalesReport,
          },
          {
            id: 20000033,
            label: "Loading Unloading Summary Report",
            path: PATH_DASHBOARD.report.loadingUnloadingSummaryReport,
          },
          {
            id: 20000031,
            label: "Tour Summary Report",
            path: PATH_DASHBOARD.report.tourSummaryReport,
          },
          {
            id: 20000045,
            label: "Discount Eligibility Report",
            path: PATH_DASHBOARD.report.discountEligibilityReport,
          },
          {
            id: 20000055,
            label: "Invoice Detail Report",
            path: PATH_DASHBOARD.report.invoiceDetailReport,
          },
          {
            id: 20000056,
            label: "Item Wise Sales Summary Report",
            path: PATH_DASHBOARD.report.itemWiseSaleSummaryReport,
          },
          {
            id: 20000058,
            label: "Annual Sale Summary Report",
            path: PATH_DASHBOARD.report.annualSaleSummaryReport,
          },
        ],
      },
      {
        id: 20000049,
        label: "Finance Reports",
        icon: <SummarizeIcon />,
        subItems: [
          {
            id: 20000035,
            label: "Cash Collection Report",
            path: PATH_DASHBOARD.report.cashCollectionReport,
          },
          {
            id: 20000036,
            label: "Cheque Collection Report",
            path: PATH_DASHBOARD.report.chequeCollectionReport,
          },
          {
            id: 20000037,
            label: "Daily Collection Report",
            path: PATH_DASHBOARD.report.dailyCollectionReport,
          },
          {
            id: 20000034,
            label: "Invoice Aging Report",
            path: PATH_DASHBOARD.report.invoiceAgingReport,
          },
        ],
      },
      {
        id: 20000050,
        label: "Key Performance Indicator Reports",
        icon: <SummarizeIcon />,
        subItems: [],
      },
      {
        id: 20000051,
        label: "Assets Reports",
        icon: <SummarizeIcon />,
        subItems: [
          {
            id: 20000023,
            label: "Asset Stock Report",
            path: PATH_DASHBOARD.report.assetStockReport,
          },
        ],
      },
      {
        id: 20000052,
        label: "Mapping Reports",
        icon: <SummarizeIcon />,
        subItems: [
          {
            id: 20000030,
            label: "Distributor Mapping Report",
            path: PATH_DASHBOARD.report.distriMapping,
          },
          {
            id: 20000040,
            label: "Outlet Mapping Report",
            path: PATH_DASHBOARD.report.routeWiseOutletReport,
          },
        ],
      },
    ],
  },
  {
    id: 1000010,
    subheader: "Asset Management",
    items: [
      {
        id: 20000017,
        label: "Asset",
        icon: <Icon icon="bx:cube" height={25} color="black" />,
        path: PATH_DASHBOARD.asset.list,
        subItems: [
          {
            id: 3000018,
            label: "Asset Type",
            path: PATH_DASHBOARD.assetType.list,
          },
          {
            id: 3000019,
            label: "Asset Brand",
            path: PATH_DASHBOARD.assetBrand.list,
          },
          {
            id: 30000120,
            label: "Asset Model",
            path: PATH_DASHBOARD.assetModel.list,
          },
        ],
      },
      {
        id: 20000019,
        label: "Asset Allocation",
        icon: <DatasetLinkedIcon />,
        path: PATH_DASHBOARD.assetAllocation.add,
      },
      {
        id: 20000020,
        label: "Asset Transfer",
        icon: <MoveUpIcon />,
        path: PATH_DASHBOARD.assetTransfer.view,
      },
    ],
  },
];
