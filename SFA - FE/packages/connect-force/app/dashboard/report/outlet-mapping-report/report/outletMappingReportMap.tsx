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

const OutletMappingReportMap = ({
  data,
  outletMappingReportInfo,
}: {
  data: any;
  outletMappingReportInfo: any;
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
            <Text style={styles.title}>Outlet Mapping Report</Text>
            {pageIndex === 0 && (
              <View style={styles.info}>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeaderLeft}>
                      <Text style={styles.tableCellHeader}>Company:</Text>
                    </View>
                    <View style={styles.tableColHeaderRight}>
                      <Text style={styles.tableCellHeader}>
                        {outletMappingReportInfo?.company}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeaderLeft}>
                      <Text style={styles.tableCellHeader}>Distributor:</Text>
                    </View>
                    <View style={styles.tableColHeaderRight}>
                      <Text style={styles.tableCellHeader}>
                        {outletMappingReportInfo?.distributor}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeaderLeft}>
                      <Text style={styles.tableCellHeader}>Sales Rep(s):</Text>
                    </View>
                    <View style={styles.tableColHeaderRight}>
                      <Text style={styles.tableCellHeader}>
                        {outletMappingReportInfo?.representative?.join(", ")}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeaderLeft}>
                      <Text style={styles.tableCellHeader}>Route(s):</Text>
                    </View>
                    <View style={styles.tableColHeaderRight}>
                      <Text style={styles.tableCellHeader}>
                        {outletMappingReportInfo?.route?.join(", ")}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeaderLeft}>
                      <Text style={styles.tableCellHeader}>Outlet(s):</Text>
                    </View>
                    <View style={styles.tableColHeaderRight}>
                      <Text style={styles.tableCellHeader}>
                        {outletMappingReportInfo?.outlet?.join(", ")}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.mappingTableColHeader}>
                  <Text style={styles.tableCell}>Distributor ID</Text>
                </View>
                <View style={styles.mappingTableColHeader}>
                  <Text style={styles.tableCell}>Distributor Name</Text>
                </View>
                <View style={styles.mappingTableColHeader}>
                  <Text style={styles.tableCell}>Rep</Text>
                </View>
                <View style={styles.mappingTableColHeader}>
                  <Text style={styles.tableCellRight}>Route</Text>
                </View>
                <View style={styles.mappingTableColHeader}>
                  <Text style={styles.tableCellRight}>Outlet ID</Text>
                </View>
                <View style={styles.mappingTableColHeader}>
                  <Text style={styles.tableCellRight}>Outlet Name</Text>
                </View>
              </View>
              {data
                .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
                .map((row: any, index: any) => (
                  <View style={[styles.tableRow]} key={index} wrap={false}>
                    <View style={styles.mappingTableCol}>
                      <Text style={styles.tableCell}>{row.distributorID}</Text>
                    </View>
                    <View style={styles.mappingTableCol}>
                      <Text style={styles.tableCell}>
                        {row.distributorName}
                      </Text>
                    </View>
                    <View style={styles.mappingTableCol}>
                      <Text style={styles.tableCell}>
                        {row.representativeName}
                      </Text>
                    </View>
                    <View style={styles.mappingTableCol}>
                      <Text style={styles.tableCellRight}>{row.routeName}</Text>
                    </View>
                    <View style={styles.mappingTableCol}>
                      <Text style={styles.tableCellRight}>{row.outletID}</Text>
                    </View>
                    <View style={styles.mappingTableCol}>
                      <Text style={styles.tableCellRight}>
                        {row.outletName}
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

export default OutletMappingReportMap;
