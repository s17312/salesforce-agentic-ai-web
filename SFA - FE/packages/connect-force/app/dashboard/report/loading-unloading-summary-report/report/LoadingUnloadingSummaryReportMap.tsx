import { styles } from "@/styles/reports/stockReportStyles";
import { Document, Page, Text, View } from "@react-pdf/renderer";
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

const LoadingUnloadingSummaryReportMap = ({
  data,
  loadingUnloadingSummaryReportInfo,
}: {
  data: any;
  loadingUnloadingSummaryReportInfo: any;
}) => {
  const itemsPerPage = 20;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const chunkSize = 8;

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
            <Text style={styles.title}>Tour Summary Report</Text>
            {pageIndex === 0 && (
              <View style={styles.info}>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeaderLeft}>
                      <Text style={styles.tableCellHeader}>From Date:</Text>
                    </View>
                    <View style={styles.tableColHeaderRight}>
                      <Text style={styles.tableCellHeader}>
                        {loadingUnloadingSummaryReportInfo?.fromDate}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeaderLeft}>
                      <Text style={styles.tableCellHeader}>To Date:</Text>
                    </View>
                    <View style={styles.tableColHeaderRight}>
                      <Text style={styles.tableCellHeader}>
                        {loadingUnloadingSummaryReportInfo?.toDate}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeaderLeft}>
                      <Text style={styles.tableCellHeader}>Tour Type</Text>
                    </View>
                    <View style={styles.tableColHeaderRight}>
                      <Text style={styles.tableCellHeader}>
                        {loadingUnloadingSummaryReportInfo?.tourType?.join(
                          ", "
                        )}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeaderLeft}>
                      <Text style={styles.tableCellHeader}>Company:</Text>
                    </View>
                    <View style={styles.tableColHeaderRight}>
                      <Text style={styles.tableCellHeader}>
                        {loadingUnloadingSummaryReportInfo?.company}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeaderLeft}>
                      <Text style={styles.tableCellHeader}>Distributor:</Text>
                    </View>
                    <View style={styles.tableColHeaderRight}>
                      <Text style={styles.tableCellHeader}>
                        {loadingUnloadingSummaryReportInfo?.distributor}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>Price List Type:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {loadingUnloadingSummaryReportInfo?.priceList}
                    </Text>
                  </View>
                </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeaderLeft}>
                      <Text style={styles.tableCellHeader}>Rep:</Text>
                    </View>
                    <View style={styles.tableColHeaderRight}>
                      <Text style={styles.tableCellHeader}>
                        {loadingUnloadingSummaryReportInfo?.representative}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeaderLeft}>
                      <Text style={styles.tableCellHeader}>Vehicle:</Text>
                    </View>
                    <View style={styles.tableColHeaderRight}>
                      <Text style={styles.tableCellHeader}>
                        {loadingUnloadingSummaryReportInfo?.vehicle?.join(", ")}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Tour Date</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Tour Schedule ID</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Tour Type</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Product ID</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Product Name</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Product Group</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Product Category</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>MRP</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Rate</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Loading Qty</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Loading Val</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Sale Qty</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Discount Qty</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Sellable Qty</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Non Sellable Qty</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Total Good Qty</Text>
                </View>
                 <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Total Good Val</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>
                    Total Non Sellable Qty
                  </Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>
                    Total Non Sellable Val
                  </Text>
                </View>
              </View>
              {data
                .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
                .map((row: any, index: any) => (
                  <View
                    style={[
                      styles.tableRow,
                      ...(index === data.length - 1 ? [styles.lastRow] : []),
                    ]}
                    key={index}
                    wrap={false}
                  >
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{row.tourDate}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {row.tourID
                          ? String(row.tourID)
                              .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                              ?.join("\n")
                          : " "}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{row.tourType}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {row.productID
                          ? String(row.productID)
                              .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                              ?.join("\n")
                          : " "}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{row.productName}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {row.productGroupName}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {row.categoryName}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>{row.mrp}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>{row.rate}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {String(row.loadingQuantity)
                          .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                          ?.join("\n")}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {String(row.loadingValue)
                          .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                          ?.join("\n")}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {String(row.saleQuantity)
                          .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                          ?.join("\n")}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {String(row.discountQuantity)
                          .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                          ?.join("\n")}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {String(row.sellableQuantity)
                          .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                          ?.join("\n")}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {String(row.nonSellableQuantity)
                          .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                          ?.join("\n")}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {String(row.totalGoodQuantity)
                          .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                          ?.join("\n")}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {String(row.totalGoodValue)
                          .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                          ?.join("\n")}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {String(row.totalNonSellableQuantity)
                          .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                          ?.join("\n")}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {String(row.totalNonSellableValue)
                          .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                          ?.join("\n")}
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

export default LoadingUnloadingSummaryReportMap;
