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

const ChequeCollectionReportMap = ({
  data,
  chequeCollectionReportInfo,
}: {
  data: any;
  chequeCollectionReportInfo: any;
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
            <Text style={styles.title}>Cheque Collection Report</Text>
            <View style={styles.info}>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>From Date:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {chequeCollectionReportInfo?.fromDate}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>To Date:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {chequeCollectionReportInfo?.toDate}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>Tour Type</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {chequeCollectionReportInfo?.tourType?.join(", ")}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>Company:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {chequeCollectionReportInfo?.company}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>Distri:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {chequeCollectionReportInfo?.distributor}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>Rep:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {chequeCollectionReportInfo?.representative}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>Route:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {chequeCollectionReportInfo?.route}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>Outlet:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {chequeCollectionReportInfo?.outlet?.join(", ")}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Invoice Date</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Tour ID</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Tour Type</Text>
                </View>
                {/* <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Distri ID</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Distri: Name</Text>
                </View> */}
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Rep</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Route</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Outlet ID</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Outlet Name</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Invoice Num:</Text>
                </View>
                {/* <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Invoice Amt</Text>
                </View> */}
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Cheque Date</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Cheque Num:</Text>
                </View>
                {/* <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Bank Cheque Amt:</Text>
                </View> */}
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Paid Amt:</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellRight}>Status</Text>
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
                      <Text style={styles.tableCell}>{row.invoiceDate}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{row.tourID}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{row.tourType}</Text>
                    </View>
                    {/* <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{row.distributorID}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {row.distributorName}
                      </Text>
                    </View> */}
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {row.representativeName}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>{row.routeName}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>{row.outletID}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {row.outletName}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {row.invoiceNumber
                          ? String(row.invoiceNumber)
                              .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                              ?.join("\n")
                          : " "}
                      </Text>
                    </View>
                    {/* <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {row.invoiceAmount}
                      </Text>
                    </View> */}
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {row.chequeDate}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {row.chequeNumber
                          ? String(row.chequeNumber)
                              .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                              ?.join("\n")
                          : " "}
                      </Text>
                    </View>
                    {/* <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {row.bankChequeAmount}
                      </Text>
                    </View> */}
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {formatCurrency(row.paidAmount)
                          .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                          ?.join("\n")}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>{row.status}</Text>
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

export default ChequeCollectionReportMap;
