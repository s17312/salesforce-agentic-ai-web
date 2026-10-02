import React from "react";
import { Page, Text, View, Document } from "@react-pdf/renderer";
import { styles } from "@/styles/reports/stockReportStyles";
import { formatCurrency } from "@/utils/formatCurrency";

const Header = () => (
  <View style={styles.header}>
    <Text>Asset Stock Report</Text>
  </View>
);

const Footer = ({
  pageNumber,
  totalPages,
}: {
  pageNumber: number;
  totalPages: number;
}) => (
  <View style={styles.footer}>
    <Text>
      Page {pageNumber} of {totalPages}
    </Text>
  </View>
);

const AssetStockViewReport = ({
  data,
  assetInfo,
}: {
  data: any[];
  assetInfo: any;
}) => {
  const itemsPerPage = 15; // Adjust items per page
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <Document>
      {Array.from({ length: totalPages }).map((_, pageIndex) => (
        <Page
          key={pageIndex}
          size="A4"
          orientation="landscape"
          style={styles.page}
          wrap
        >
          <View style={styles.section}>
            <Header />
            <Text style={styles.title}>Asset Stock Report</Text>
            <View style={styles.info}>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>Asset Type:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {assetInfo?.assetType}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>Asset Brand:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {assetInfo?.assetBrand}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>Asset Model:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {assetInfo?.assetModel}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>Assign Status:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {assetInfo?.assignStatus}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>Allocation Type:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {assetInfo?.allocationType}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>Distributor:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {assetInfo?.distributor}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>Outlet:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {assetInfo?.outlet}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>Repair Center:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {assetInfo?.repairCenter}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>Disposal Center:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {assetInfo?.disposalCenter}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Asset ID</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Asset Name</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Serial Number</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Guarantee Information</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Manufacturer</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Purchase Date</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Cost</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Assign Status</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Asset Type</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Asset Brand</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Asset Model</Text>
                </View>
                {/* <View style={styles.tableColHeader}>
                                    <Text style={styles.tableCell}>Additional Notes</Text>
                                </View> */}
                {/* <View style={styles.tableColHeader}>
                                    <Text style={styles.tableCell}>Maintenance Schedule</Text>
                                </View> */}
              </View>
              {data
                .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
                .map((row: any, index: number) => (
                  <View style={styles.tableRow} key={index} wrap={false}>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{row.assetId}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{row.assetName}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{row.serialNumber}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {row.guaranteeInformation}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{row.manufacturer}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{row.purchaseDate}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>{formatCurrency(row.cost)}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{row.assignStatus}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{row.assetTypeName}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{row.assetBrandName}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{row.assetModelName}</Text>
                    </View>
                    {/* <View style={styles.tableCol}>
                                        <Text style={styles.tableCell}>{row.additionalNotes}</Text>
                                    </View> */}
                    {/* <View style={styles.tableCol}>
                                        <Text style={styles.tableCell}>{row.maintenanceSchedule}</Text>
                                    </View> */}
                  </View>
                ))}
            </View>
            <Footer pageNumber={pageIndex + 1} totalPages={totalPages} />
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default AssetStockViewReport;
