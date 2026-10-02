import { styles } from "@/styles/reports/stockReportStyles";
import { formatCurrency } from "@/utils/formatCurrency";
import { Text, View, Document, Page } from "@react-pdf/renderer";
import React from "react";

const Header = () => (
  <View style={styles.header}>
    <Text>Connect Force</Text>
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

const localStyles = {
  smallText: {
    fontSize: 8,
  },
};

const ItemWiseSaleSummaryReport = ({
  data,
  itemWiseSaleSummaryReportInfo,
}: {
  data: any;
  itemWiseSaleSummaryReportInfo: any;
}) => {
  const itemsPerPage = 20;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const chunkSize = 9;
  const valChunkSize = 13;

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
            <Text style={styles.title}>Item Wise Sale Summary Report</Text>
            {pageIndex === 0 && (
              <View style={styles.info}>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeaderLeft}>
                      <Text style={styles.tableCellHeader}>From Date:</Text>
                    </View>
                    <View style={styles.tableColHeaderRight}>
                      <Text style={styles.tableCellHeader}>
                        {itemWiseSaleSummaryReportInfo?.fromDate}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeaderLeft}>
                      <Text style={styles.tableCellHeader}>To Date:</Text>
                    </View>
                    <View style={styles.tableColHeaderRight}>
                      <Text style={styles.tableCellHeader}>
                        {itemWiseSaleSummaryReportInfo?.toDate}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeaderLeft}>
                      <Text style={styles.tableCellHeader}>Company:</Text>
                    </View>
                    <View style={styles.tableColHeaderRight}>
                      <Text style={styles.tableCellHeader}>
                        {itemWiseSaleSummaryReportInfo?.company}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeaderLeft}>
                      <Text style={styles.tableCellHeader}>Distributor:</Text>
                    </View>
                    <View style={styles.tableColHeaderRight}>
                      <Text style={styles.tableCellHeader}>
                        {itemWiseSaleSummaryReportInfo?.distributor}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeaderLeft}>
                      <Text style={styles.tableCellHeader}>Rep:</Text>
                    </View>
                    <View style={styles.tableColHeaderRight}>
                      <Text style={styles.tableCellHeader}>
                        {itemWiseSaleSummaryReportInfo?.representatives?.join(", ")}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeaderLeft}>
                      <Text style={styles.tableCellHeader}>Products:</Text>
                    </View>
                    <View style={styles.tableColHeaderRight}>
                      <Text style={styles.tableCellHeader}>
                        {itemWiseSaleSummaryReportInfo?.products?.join(", ")}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableRow}>
                <View style={styles.PIDColHeader}>
                  <Text style={styles.tableCell}>Product ID</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Product Name</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>MRP</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Rate</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Sale Qty</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Discount Qty</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Return Qty</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Net Qty</Text>
                </View>
                <View style={styles.VALColHeader}>
                  <Text style={styles.tableCellRight}>Total Value</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Total Volume</Text>
                </View>
              </View>

              {/* Table Data */}
              {data
                .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
                .map((row: any, index: number) => (
                  <View
                    style={[
                      styles.tableRow,
                      ...(index === data.length - 1 ? [styles.lastRow] : []),
                    ]}
                    key={index}
                    wrap={false}
                  >
                    <View style={styles.PIDCol}>
                      <Text style={[styles.tableCell, localStyles.smallText]}>
                        {row.productID
                          ? String(row.productID)
                            .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                            ?.join("\n")
                          : " "}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{row.productName || " "}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {row.mrp
                          ? formatCurrency(row.mrp)
                            .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                            ?.join("\n")
                          : " "}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {row.rate
                          ? formatCurrency(row.rate)
                            .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                            ?.join("\n")
                          : " "}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {row.totalSaleQuantity ?? " "}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {row.totalDiscountQty ?? " "}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {row.totalReturnValue ?? " "}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {row.netQty ?? " "}
                      </Text>
                    </View>
                    <View style={styles.VALCol}>
                      <Text style={styles.tableCellRight}>
                        {row.totalValue
                          ? formatCurrency(row.totalValue)
                            .match(new RegExp(`.{1,${valChunkSize}}`, "g"))
                            ?.join("\n")
                          : " "}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {row.totalVolume
                          ? formatCurrency(row.totalVolume)
                            .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                            ?.join("\n")
                          : " "}
                      </Text>
                    </View>
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

export default ItemWiseSaleSummaryReport;
