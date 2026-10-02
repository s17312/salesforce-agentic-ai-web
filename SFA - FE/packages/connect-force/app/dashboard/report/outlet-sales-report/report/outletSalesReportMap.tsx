import { styles } from "@/styles/reports/stockReportStyles";
import { formatCurrency } from "@/utils/formatCurrency";
import { Document, Page, Text, View } from "@react-pdf/renderer";

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

const OutletSalesReportMap = ({
  data,
  outletSalesReportInfo,
  selectedSummaryValue,
}: {
  data: any;
  outletSalesReportInfo: any;
  selectedSummaryValue: string;
}) => {
  const itemsPerPage = 20;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const chunkSize = 12;

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
            <Text
              style={styles.title}
            >{`Outlet Wise Sales Report - ${selectedSummaryValue}`}</Text>
            <View style={styles.info}>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>From Date:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {outletSalesReportInfo?.fromDate}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>To Date:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {outletSalesReportInfo?.toDate}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>Tour Type</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {outletSalesReportInfo?.tourType?.join(", ")}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>Company:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {outletSalesReportInfo?.company}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>Distri:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {outletSalesReportInfo?.distributor}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>Rep:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {outletSalesReportInfo?.representative}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>Route:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {outletSalesReportInfo?.route}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>Outlet:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {outletSalesReportInfo?.outlet?.join(", ")}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                {selectedSummaryValue !== "Summary" && (
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Invoice Date</Text>
                  </View>
                )}
                {/* <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Tour Type</Text>
                {/* <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Tour Type</Text>
                </View> */}
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Outlet ID</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Outlet Name</Text>
                </View>
                {selectedSummaryValue !== "Summary" && (
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCellRight}>Invoice Num:</Text>
                  </View>
                )}
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
                    {selectedSummaryValue !== "Summary" && (
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>{row.invoiceDate}</Text>
                      </View>
                    )}
                    {/* <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{row.tourType}</Text>
                    </View> */}
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>{row.outletID}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {row.outletName}
                      </Text>
                    </View>
                    {selectedSummaryValue !== "Summary" && (
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCellRight}>
                          {row.invoiceNumber
                            ? String(row.invoiceNumber)
                                .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                                ?.join("\n")
                            : " "}
                        </Text>
                      </View>
                    )}
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

export default OutletSalesReportMap;
