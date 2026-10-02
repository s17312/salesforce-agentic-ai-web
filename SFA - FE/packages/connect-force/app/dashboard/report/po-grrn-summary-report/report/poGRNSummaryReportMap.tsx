import { styles } from "@/styles/reports/stockReportStyles";
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

const POGRNSummaryReportMap = ({
  poGRNReportInfo,
  data,
  selectedSummaryValue,
}: {
  poGRNReportInfo: any;
  data: any;
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
          orientation="portrait"
          style={styles.page}
          wrap
        >
          <View style={styles.section}>
            <Header />
            <Text style={styles.title}>PO GRN Summary Report</Text>
            <View style={styles.info}>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>From Date:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {poGRNReportInfo?.fromDate}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>To Date:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {poGRNReportInfo?.toDate}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>Company:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {poGRNReportInfo?.company}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>Distributor:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {poGRNReportInfo?.distributor}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeaderLeft}>
                    <Text style={styles.tableCellHeader}>Price List Type:</Text>
                  </View>
                  <View style={styles.tableColHeaderRight}>
                    <Text style={styles.tableCellHeader}>
                      {poGRNReportInfo?.priceList}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                {selectedSummaryValue !== "Summary" && (
                  <View style={[styles.tableColHeader, { width: 100 }]}>
                    <Text style={styles.tableCell}>PO NO</Text>
                  </View>
                )}
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Product ID</Text>
                </View>
                <View style={[styles.tableColHeader, { width: 150 }]}>
                  <Text style={styles.tableCell}>Product Name</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>MRP</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Rate</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Req. Qty</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>App. Qty</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Acc. Qty</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Total Value</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Total Volume</Text>
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
                      <View style={[styles.tableCol, { width: 100 }]}>
                        <Text style={styles.tableCell}>{row.poNo}</Text>
                      </View>
                    )}
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{row.productID}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: 150 }]}>
                      <Text style={styles.tableCell}>{row.productName}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>{row.mrp}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>{row.rate}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {row.requestedQunatity}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {row.approvedQuantity}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {row.acceptedQuantity}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {row.totalValue}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {row.totalVolume}
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

export default POGRNSummaryReportMap;
