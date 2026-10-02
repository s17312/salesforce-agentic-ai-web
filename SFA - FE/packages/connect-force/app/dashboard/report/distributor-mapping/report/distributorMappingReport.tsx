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

const DistributorMappingViewReport = ({
  data,
  distributorMappingInfo,
  selectedRadioValue,
}: {
  data: any;
  distributorMappingInfo: any;
  selectedRadioValue: string;
}) => {
  const itemsPerPage = 20;
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
            <Text style={styles.title}>
              {`Distributor Mapping View - ${selectedRadioValue}`}
            </Text>
            {pageIndex === 0 && (
              <View style={styles.info}>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeaderLeft}>
                      <Text style={styles.tableCellHeader}>Mapping Item:</Text>
                    </View>
                    <View style={styles.tableColHeaderRight}>
                      <Text style={styles.tableCellHeader}>
                        {selectedRadioValue}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeaderLeft}>
                      <Text style={styles.tableCellHeader}>Distributor:</Text>
                    </View>
                    <View style={styles.tableColHeaderRight}>
                      <Text style={styles.tableCellHeader}>
                        {distributorMappingInfo?.distributor.join(", ")}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.mappingTableColHeader}>
                  <Text style={styles.tableCellHeader}>Distributor ID</Text>
                </View>
                <View style={styles.mappingTableColHeader}>
                  <Text style={styles.tableCellHeader}>Distributor Name</Text>
                </View>
                <View style={styles.mappingTableColHeader}>
                  <Text style={styles.tableCellHeader}>ID</Text>
                </View>
                <View style={styles.mappingTableColHeader}>
                  <Text style={styles.tableCellHeader}>Name</Text>
                </View>
              </View>
              {data
                .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
                .map((row: any, index: number) => (
                  <View key={index} style={styles.tableRow}>
                    <View style={styles.mappingTableCol}>
                      <Text style={styles.tableCell}>{row.distributorId}</Text>
                    </View>
                    <View style={styles.mappingTableCol}>
                      <Text style={styles.tableCell}>
                        {row.distributorName}
                      </Text>
                    </View>
                    <View style={styles.mappingTableCol}>
                      <Text style={styles.tableCell}>{row.id}</Text>
                    </View>
                    <View style={styles.mappingTableCol}>
                      <Text style={styles.tableCell}>{row.name}</Text>
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

export default DistributorMappingViewReport;
