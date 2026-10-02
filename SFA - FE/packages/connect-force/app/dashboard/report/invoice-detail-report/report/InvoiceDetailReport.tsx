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
  // tableColTourID: {
  //   // maxWidth: 80,
  //   flex: 1,
  // },
  // tableColChequeNumber: {
  //   // maxWidth: 100,
  //   flex: 1,
  // },
};

const InvoiceDetailReport = ({
  data,
  invoiceDetailReportInfo,
}: {
  data: any;
  invoiceDetailReportInfo: any;
}) => {
  const itemsPerPage = 20;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const chunkSize = 9;

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
            <Text style={styles.title}>Invoice Detail Report</Text>
            {pageIndex === 0 && (
              <View style={styles.info}>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeaderLeft}>
                      <Text style={styles.tableCellHeader}>From Date:</Text>
                    </View>
                    <View style={styles.tableColHeaderRight}>
                      <Text style={styles.tableCellHeader}>
                        {invoiceDetailReportInfo?.fromDate}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeaderLeft}>
                      <Text style={styles.tableCellHeader}>To Date:</Text>
                    </View>
                    <View style={styles.tableColHeaderRight}>
                      <Text style={styles.tableCellHeader}>
                        {invoiceDetailReportInfo?.toDate}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeaderLeft}>
                      <Text style={styles.tableCellHeader}>Tour Type</Text>
                    </View>
                    <View style={styles.tableColHeaderRight}>
                      <Text style={styles.tableCellHeader}>
                        {invoiceDetailReportInfo?.tourType?.join(", ")}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeaderLeft}>
                      <Text style={styles.tableCellHeader}>Company:</Text>
                    </View>
                    <View style={styles.tableColHeaderRight}>
                      <Text style={styles.tableCellHeader}>
                        {invoiceDetailReportInfo?.company}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeaderLeft}>
                      <Text style={styles.tableCellHeader}>Distributor:</Text>
                    </View>
                    <View style={styles.tableColHeaderRight}>
                      <Text style={styles.tableCellHeader}>
                        {invoiceDetailReportInfo?.distributor}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeaderLeft}>
                      <Text style={styles.tableCellHeader}>Rep:</Text>
                    </View>
                    <View style={styles.tableColHeaderRight}>
                      <Text style={styles.tableCellHeader}>
                        {invoiceDetailReportInfo?.representative?.join(", ")}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Tour Schedule ID</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Schedule Date</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Outlet ID</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Outlet Name</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Invoice Number</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Payment Date</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Payment IDs</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Sale Amt</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Discount Amt</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Return Amt</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Total Amt</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Cash Amt</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Credit Amt</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Cheque Amt</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Cheque Number</Text>
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
                      <Text style={[styles.tableCell, localStyles.smallText]}>
                        {row.tourID
                          ? String(row.tourID)
                              .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                              ?.join("\n")
                          : " "}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{row.scheduleDate}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {row.outletID
                          ? String(row.outletID)
                              .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                              ?.join("\n")
                          : " "}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{row.outletName}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {row.manualInvoiceNumber
                          ? String(row.manualInvoiceNumber)
                              .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                              ?.join("\n")
                          : " "}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {row.paymentDate
                          ? String(row.paymentDate)
                              .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                              ?.join("\n")
                          : " "}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {row.paymentIds
                          ? String(row.paymentIds)
                              .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                              ?.join("\n")
                          : " "}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {formatCurrency(row.invoiceAmount)
                          .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                          ?.join("\n")}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {formatCurrency(row.discountAmount)
                          .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                          ?.join("\n")}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {formatCurrency(row.returnAmount)
                          .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                          ?.join("\n")}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {formatCurrency(row.totalAmount)
                          .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                          ?.join("\n")}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {formatCurrency(row.cashAmount)
                          .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                          ?.join("\n")}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {formatCurrency(row.creditAmount)
                          .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                          ?.join("\n")}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {formatCurrency(row.chequeAmount)
                          .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                          ?.join("\n")}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text
                        style={[styles.tableCellRight, localStyles.smallText]}
                      >
                        {row.chequeNumber
                          ? String(row.chequeNumber)
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

export default InvoiceDetailReport;
