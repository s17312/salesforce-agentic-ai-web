import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useTheme,
} from "@mui/material";
import { PDFDownloadLink, PDFViewer, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { useSelector } from "@/redux/store";
import { enqueueSnackbar } from "notistack";
import { getSalesInvoiceByID } from "@/service/tour-service/sale.service";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import { getAppliedSalesDiscountByInvoiceId } from "@/service/tour-service/discount.service";
import { getReturnInvoiceDetails } from "@/service/tour-service/return.service";
import { getOutletById } from "@/service/outlet.service";
import { getDistributorById } from "@/service/distributor.service";
import { getInvoicePayments } from "@/service/tour-service/invoicePayment.service";
import { PrintInvoiceStyles } from "@/app/dashboard/rep-tour/sale/sales-invoice/components/styles";
import { FormatDateWithTime } from "@/utils/dateUtils";

interface InvoicePrintPopupProps {
  open: boolean;
  onClose: () => void;
  invoiceIDOrLostCallID?: string;
  fileName: string;
  reportName: string;
}

const InvoicePDF = ({ invoice, pageSize = "A4" }: { invoice: any; pageSize?: "A4" | "3INCH" }) => {
  const isSmallFormat = pageSize === "3INCH";

  const smallStyles = StyleSheet.create({
    page: {
      paddingTop: 20,
      paddingLeft: 8,
      paddingRight: 18,
      fontSize: 10,
      fontFamily: "Helvetica",
    },
    smallHeader: {
      fontSize: isSmallFormat ? 14 : 20,
      fontWeight: "bold",
      marginBottom: isSmallFormat ? 2 : 4,
      textAlign: isSmallFormat ? "center" : "left" as const,
    },
    smallText: {
      fontSize: isSmallFormat ? 8 : 12,
      marginBottom: isSmallFormat ? 1 : 2,
    },
    smallTextBold: {
      fontSize: isSmallFormat ? 8 : 12,
      fontWeight: "bold",
      marginBottom: isSmallFormat ? 1 : 2,
    },
    largeText: {
      fontSize: isSmallFormat ? 10 : 14,
      marginBottom: isSmallFormat ? 1 : 2,
    },
    largeTextBold: {
      fontSize: isSmallFormat ? 10 : 14,
      fontWeight: "bold",
      marginBottom: isSmallFormat ? 1 : 2,
    },
    extraLargeText: {
      fontSize: isSmallFormat ? 12 : 16,
      marginBottom: isSmallFormat ? 1 : 2,
    },
    extraLargeTextBold: {
      fontSize: isSmallFormat ? 12 : 16,
      fontWeight: "bold",
      marginBottom: isSmallFormat ? 1 : 2,
    },
    dottedBorder: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: "#000",
      borderStyle: "dotted",
      paddingVertical: 4,
      marginTop: 4,
    }
  });

  return (
    <Document>
      <Page size={pageSize === "3INCH" ? [216, 800] : "A4"} style={pageSize === "3INCH" ? smallStyles.page : PrintInvoiceStyles.page}>
        {/* Top Section */}
        <View style={{
          flexDirection: isSmallFormat ? "column" : "row",
          justifyContent: "space-between",
          marginBottom: isSmallFormat ? 8 : 16,
          alignItems: isSmallFormat ? "center" : "flex-start"
        }}>
          {/* Left: Invoice & Company Info */}
          <View style={{
            flexDirection: "column",
            flex: isSmallFormat ? undefined : 1,
            alignItems: isSmallFormat ? "center" : "flex-start",
            marginBottom: isSmallFormat ? 4 : 0
          }}>

            <Text style={smallStyles.smallHeader}>INVOICE</Text>
          </View>
          {/* Right: Invoice No & Date */}
          <View style={{
            flexDirection: "column",
            alignItems: isSmallFormat ? "center" : "flex-end",
            flex: isSmallFormat ? undefined : 1
          }}>
            <Text style={smallStyles.smallTextBold}>Inv: {invoice.invoiceNo}</Text>
            <Text style={smallStyles.smallText}>{invoice.from?.name}</Text>
            <Text style={smallStyles.smallText}>{invoice.from.phone}</Text>
            {/* <Text style={smallStyles.smallText}>Due Date: {invoice.dueDate}</Text> */}
          </View>
        </View>
        <View style={PrintInvoiceStyles.hrHeader} />

        {/* Company Header */}
        {/* <Text style={PrintInvoiceStyles.header}>{company.name}</Text> */}
        {/* From/To Section */}
        <View style={{
          ...PrintInvoiceStyles.row,
          flexDirection: isSmallFormat ? "column" : "row",
          gap: isSmallFormat ? 4 : undefined
        }}>
          {/* <View style={{
            ...PrintInvoiceStyles.col,
            marginBottom: isSmallFormat ? 4 : 0
          }}> */}
          {/* <Text style={smallStyles.smallTextBold}>From:</Text> */}
          {/* <Text style={smallStyles.smallText}>{invoice.from?.name}</Text> */}
          {/* <Text style={smallStyles.smallText}>{invoice.from.address}</Text> */}
          {/* <Text style={smallStyles.smallText}>Phone: {invoice.from.phone}</Text> */}
          {/* </View> */}
          <View style={PrintInvoiceStyles.col}>
            {/* <Text style={smallStyles.smallTextBold}>To:</Text> */}
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={smallStyles.smallText}>{invoice.to.name}</Text>
              <Text style={smallStyles.smallText}>{invoice.date}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              {/* <Text style={smallStyles.smallText}>{invoice.to.address}</Text> */}
              <Text style={smallStyles.smallText}>{invoice.to.contact}</Text>
              <Text style={smallStyles.smallTextBold}>(Retail)</Text>
            </View>
          </View>
        </View>

        {/* Sales Detail Table */}
        {invoice.items?.length > 0 ? (
          <View>
            <View style={PrintInvoiceStyles.hr} />
            <Text style={PrintInvoiceStyles.title}>Sales</Text>
            {/* Small (3INCH) stacked layout */}
            {isSmallFormat ? (
              <View>
                {/* Header row */}
                <View style={{ flexDirection: "row", marginBottom: 4 }}>
                  <Text style={[smallStyles.smallTextBold, { flex: 2 }]}>MRP</Text>
                  <Text style={[smallStyles.smallTextBold, { flex: 2 }]}>Our Price</Text>
                  <Text style={[smallStyles.smallTextBold, { flex: 2 }]}>x Qty</Text>
                  <Text style={[smallStyles.smallTextBold, { flex: 2, textAlign: "right" }]}>Sub Total</Text>
                </View>

                {/* Items */}
                {(invoice.items ?? []).map((item: any, idx: number) => (
                  <View key={idx} style={{ marginBottom: 6 }}>
                    {/* Line 1 → index + product name */}
                    <Text style={smallStyles.smallTextBold}>
                      {idx + 1}. {item.pname}
                    </Text>

                    {/* Line 2 → stacked details */}
                    <View style={{ flexDirection: "row" }}>
                      <Text style={[smallStyles.smallText, { flex: 2 }]}>
                        {(item.mrp || 0).toLocaleString()}
                      </Text>
                      <Text style={[smallStyles.smallText, { flex: 2 }]}>
                        {(item.rate || 0).toLocaleString()}
                      </Text>
                      <Text style={[smallStyles.smallText, { flex: 2 }]}>
                        {(item.totalUnits || 0)} Nos
                      </Text>
                      <Text style={[smallStyles.smallText, { flex: 2, textAlign: "right" }]}>
                        {(item.salesValue || 0).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                ))}
                {/* <View style={smallStyles.dottedBorder}>
                  <View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={smallStyles.smallTextBold}>Sub Total (Sales)</Text>
                      {(invoice.items ?? []).reduce((sum: any, item: any) => sum + item.sales, 0).toLocaleString()}
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={smallStyles.smallTextBold}>Sub Total (Total Units)</Text>
                      {(invoice.items ?? []).reduce((sum: any, item: any) => sum + item.totalUnits, 0).toLocaleString()}
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={smallStyles.smallTextBold}>Sub Total (Sales Values)</Text>
                      {(invoice.items ?? []).reduce((sum: any, item: any) => sum + item.salesValue, 0).toLocaleString()}
                    </View>
                  </View>
                </View> */}
              </View>
            ) : (
              <View style={PrintInvoiceStyles.table}>
                {/* Table Header */}
                <View style={PrintInvoiceStyles.tableRow}>
                  <View style={PrintInvoiceStyles.tableCol}><Text style={PrintInvoiceStyles.tableCellHeader}>PID</Text></View>
                  <View style={PrintInvoiceStyles.tableCol}><Text style={PrintInvoiceStyles.tableCellHeader}>Product</Text></View>
                  <View style={PrintInvoiceStyles.tableCol}><Text style={PrintInvoiceStyles.tableCellHeaderRight}>MRP</Text></View>
                  <View style={PrintInvoiceStyles.tableCol}><Text style={PrintInvoiceStyles.tableCellHeaderRight}>Rate</Text></View>
                  <View style={PrintInvoiceStyles.tableCol}><Text style={PrintInvoiceStyles.tableCellHeaderRight}>Sales</Text></View>
                  <View style={PrintInvoiceStyles.tableCol}><Text style={PrintInvoiceStyles.tableCellHeaderRight}>Total Units</Text></View>
                  <View style={PrintInvoiceStyles.tableCol}><Text style={PrintInvoiceStyles.tableCellHeaderRight}>Sales Value</Text></View>
                </View>
                {/* Table Rows */}
                {invoice.items.map((item: any, idx: any) => (
                  <View style={PrintInvoiceStyles.tableRow} key={idx}>
                    <View style={PrintInvoiceStyles.tableCol}><Text style={PrintInvoiceStyles.tableCell}>{item.pid}</Text></View>
                    <View style={PrintInvoiceStyles.tableCol}><Text style={PrintInvoiceStyles.tableCell}>{item.pname}</Text></View>
                    <View style={PrintInvoiceStyles.tableCol}><Text style={PrintInvoiceStyles.tableCellRight}>{item.mrp.toLocaleString()}</Text></View>
                    <View style={PrintInvoiceStyles.tableCol}><Text style={PrintInvoiceStyles.tableCellRight}>{item.rate.toLocaleString()}</Text></View>
                    <View style={PrintInvoiceStyles.tableCol}><Text style={PrintInvoiceStyles.tableCellRight}>{item.sales.toLocaleString()}</Text></View>
                    <View style={PrintInvoiceStyles.tableCol}><Text style={PrintInvoiceStyles.tableCellRight}>{item.totalUnits.toLocaleString()}</Text></View>
                    <View style={PrintInvoiceStyles.tableCol}><Text style={PrintInvoiceStyles.tableCellRight}>{item.salesValue.toLocaleString()}</Text></View>
                  </View>
                ))}
                {/* Subtotal Row for Sales, Total Units, Sales Value */}
                <View style={[PrintInvoiceStyles.tableRow, { backgroundColor: "#EAF6FF" }]}>
                  {/* Colspan for first four columns */}
                  <View style={PrintInvoiceStyles.salesSubtotalColspan}>
                    <Text style={[PrintInvoiceStyles.tableCellHeaderTotal, { textAlign: "center" }]}>Sub Total</Text>
                  </View>
                  {/* Sales */}
                  <View style={PrintInvoiceStyles.tableCol}>
                    <Text style={PrintInvoiceStyles.tableCellHeaderTotal}>
                      {(invoice.items ?? []).reduce((sum: any, item: any) => sum + item.sales, 0).toLocaleString()}
                    </Text>
                  </View>
                  {/* Total Units */}
                  <View style={PrintInvoiceStyles.tableCol}>
                    <Text style={PrintInvoiceStyles.tableCellHeaderTotal}>
                      {(invoice.items ?? []).reduce((sum: any, item: any) => sum + item.totalUnits, 0).toLocaleString()}
                    </Text>
                  </View>
                  {/* Sales Value */}
                  <View style={PrintInvoiceStyles.tableCol}>
                    <Text style={PrintInvoiceStyles.tableCellHeaderTotal}>
                      {(invoice.items ?? []).reduce((sum: any, item: any) => sum + item.salesValue, 0).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        ) : (
          null
        )}

        {/* Discounts details table */}
        {invoice.discounts?.length > 0 ? (
          <View>
            <View style={PrintInvoiceStyles.hr} />
            <Text style={PrintInvoiceStyles.title}>Discounts</Text>
            {isSmallFormat ? (
              <View>
                {(invoice.discounts ?? []).map((discount: any, idx: any) => (
                  <View key={idx} style={{ marginBottom: 6 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={smallStyles.smallTextBold}>ID</Text>
                      <Text style={smallStyles.smallText}>{discount.id}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={smallStyles.smallTextBold}>Name</Text>
                      <Text style={smallStyles.smallText}>{discount.name}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={smallStyles.smallTextBold}>Applied Discount</Text>
                      <Text style={smallStyles.smallText}>{(discount.appliedDiscount || 0).toLocaleString()}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={smallStyles.smallTextBold}>Applied Discount Value</Text>
                      <Text style={smallStyles.smallText}>{(discount.appliedDiscountValue || 0).toLocaleString()}</Text>
                    </View>
                  </View>
                ))}
                {/* <View style={smallStyles.dottedBorder}>
                  <View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={smallStyles.smallTextBold}>Sub Total (Applied Discount)</Text>
                      <Text style={smallStyles.smallText}>{(invoice.discounts ?? []).reduce((sum: any, d: any) => sum + (d.appliedDiscount || 0), 0).toLocaleString()}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={smallStyles.smallTextBold}>Sub Total (Applied Discount Value)</Text>
                      <Text style={smallStyles.smallText}>{(invoice.discounts ?? []).reduce((sum: any, d: any) => sum + (d.appliedDiscountValue || 0), 0).toLocaleString()}</Text>
                    </View>
                  </View>
                </View> */}
              </View>
            ) : (
              <View style={PrintInvoiceStyles.table}>
                {/* Table Header */}
                <View style={PrintInvoiceStyles.tableRow}>
                  <View style={PrintInvoiceStyles.tableColDiscount}><Text style={PrintInvoiceStyles.tableCellHeader}>ID</Text></View>
                  <View style={PrintInvoiceStyles.tableColDiscount}><Text style={PrintInvoiceStyles.tableCellHeader}>Name</Text></View>
                  <View style={PrintInvoiceStyles.tableColDiscount}><Text style={PrintInvoiceStyles.tableCellHeaderRight}>Applied Discount</Text></View>
                  <View style={PrintInvoiceStyles.tableColDiscount}><Text style={PrintInvoiceStyles.tableCellHeaderRight}>Applied Discount Value</Text></View>
                </View>
                {/* Table Rows */}
                {(invoice.discounts ?? []).map((discount: any, idx: any) => (
                  <View style={PrintInvoiceStyles.tableRow} key={idx}>
                    <View style={PrintInvoiceStyles.tableColDiscount}><Text style={PrintInvoiceStyles.tableCell}>{discount.id}</Text></View>
                    <View style={PrintInvoiceStyles.tableColDiscount}><Text style={PrintInvoiceStyles.tableCell}>{discount.name}</Text></View>
                    <View style={PrintInvoiceStyles.tableColDiscount}><Text style={PrintInvoiceStyles.tableCellRight}>{discount.appliedDiscount?.toLocaleString()}</Text></View>
                    <View style={PrintInvoiceStyles.tableColDiscount}><Text style={PrintInvoiceStyles.tableCellRight}>{discount.appliedDiscountValue?.toLocaleString()}</Text></View>
                  </View>
                ))}

                {/* Sub Total for Applied Discount and Applied Discount Value */}
                <View style={[PrintInvoiceStyles.tableRow, PrintInvoiceStyles.discountSubtotalRow]}>
                  {/* Colspan for first two columns */}
                  <View style={PrintInvoiceStyles.discountSubtotalColspan}>
                    <Text style={[PrintInvoiceStyles.tableCellHeaderTotal, PrintInvoiceStyles.discountSubtotalText]}>Sub Total</Text>
                  </View>
                  {/* Applied Discount */}
                  <View style={PrintInvoiceStyles.tableColDiscount}>
                    <Text style={PrintInvoiceStyles.tableCellHeaderTotal}>
                      {(invoice.discounts ?? []).reduce((sum: any, discount: any) => sum + discount.appliedDiscount, 0).toLocaleString()}
                    </Text>
                  </View>
                  {/* Applied Discount Value */}
                  <View style={PrintInvoiceStyles.tableColDiscount}>
                    <Text style={PrintInvoiceStyles.tableCellHeaderTotal}>
                      {(invoice.discounts ?? []).reduce((sum: any, discount: any) => sum + discount.appliedDiscountValue, 0).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        ) : (
          null
        )}

        {/* Returns details table */}
        {invoice.returns?.length > 0 ? (
          <View>
            <View style={PrintInvoiceStyles.hr} />
            <Text style={PrintInvoiceStyles.title}>Returns</Text>
            {/* Small (3INCH) stacked layout */}
            {isSmallFormat ? (
              <View>
                {/* Header row */}
                <View style={{ flexDirection: "row", marginBottom: 4 }}>
                  <Text style={[smallStyles.smallTextBold, { flex: 2 }]}>MRP</Text>
                  <Text style={[smallStyles.smallTextBold, { flex: 2 }]}>Rate</Text>
                  <Text style={[smallStyles.smallTextBold, { flex: 2 }]}>x Qty</Text>
                  <Text style={[smallStyles.smallTextBold, { flex: 2, textAlign: "right" }]}>
                    Return Value
                  </Text>
                </View>

                {/* Return Items */}
                {(invoice.returns ?? []).map((item: any, idx: number) => (
                  <View key={idx} style={{ marginBottom: 6 }}>
                    {/* Line 1 → index + product name */}
                    <Text style={smallStyles.smallTextBold}>
                      {idx + 1}. {item.pname}
                    </Text>

                    {/* Line 2 → stacked details */}
                    <View style={{ flexDirection: "row" }}>
                      <Text style={[smallStyles.smallText, { flex: 2 }]}>
                        {(item.mrp || 0).toLocaleString()}
                      </Text>
                      <Text style={[smallStyles.smallText, { flex: 2 }]}>
                        {(item.rate || 0).toLocaleString()}
                      </Text>
                      <Text style={[smallStyles.smallText, { flex: 2 }]}>
                        {(item.qty || 0)} Nos
                      </Text>
                      <Text style={[smallStyles.smallText, { flex: 2, textAlign: "right" }]}>
                        {(item.returnValue || 0).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                ))}

                {/* Subtotal with dotted border */}
                {/* <View style={smallStyles.dottedBorder}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                    <Text style={smallStyles.smallTextBold}>Sub Total (Qty)</Text>
                    <Text style={smallStyles.smallText}>
                      {(invoice.returns ?? []).reduce((sum: any, it: any) => sum + (it.qty || 0), 0).toLocaleString()}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={smallStyles.smallTextBold}>Sub Total (Return Value)</Text>
                    <Text style={smallStyles.smallText}>
                      {(invoice.returns ?? []).reduce((sum: any, it: any) => sum + (it.returnValue || 0), 0).toLocaleString()}
                    </Text>
                  </View>
                </View> */}
              </View>
            ) : (
              <View style={PrintInvoiceStyles.table}>
                {/* Table Header */}
                <View style={PrintInvoiceStyles.tableRow}>
                  <View style={PrintInvoiceStyles.tableColReturn}><Text style={PrintInvoiceStyles.tableCellHeader}>PID</Text></View>
                  <View style={PrintInvoiceStyles.tableColReturn}><Text style={PrintInvoiceStyles.tableCellHeader}>Product</Text></View>
                  <View style={PrintInvoiceStyles.tableColReturn}><Text style={PrintInvoiceStyles.tableCellHeaderRight}>MRP</Text></View>
                  <View style={PrintInvoiceStyles.tableColReturn}><Text style={PrintInvoiceStyles.tableCellHeaderRight}>Rate</Text></View>
                  <View style={PrintInvoiceStyles.tableColReturn}><Text style={PrintInvoiceStyles.tableCellHeaderRight}>Qty</Text></View>
                  <View style={PrintInvoiceStyles.tableColReturn}><Text style={PrintInvoiceStyles.tableCellHeaderRight}>Return Value</Text></View>
                </View>
                {/* Table Rows */}
                {(invoice.returns ?? []).map((item: any, idx: any) => (
                  <View style={PrintInvoiceStyles.tableRow} key={idx}>
                    <View style={PrintInvoiceStyles.tableColReturn}><Text style={PrintInvoiceStyles.tableCell}>{item.pid}</Text></View>
                    <View style={PrintInvoiceStyles.tableColReturn}><Text style={PrintInvoiceStyles.tableCell}>{item.pname}</Text></View>
                    <View style={PrintInvoiceStyles.tableColReturn}><Text style={PrintInvoiceStyles.tableCellRight}>{item.mrp?.toLocaleString()}</Text></View>
                    <View style={PrintInvoiceStyles.tableColReturn}><Text style={PrintInvoiceStyles.tableCellRight}>{item.rate?.toLocaleString()}</Text></View>
                    <View style={PrintInvoiceStyles.tableColReturn}><Text style={PrintInvoiceStyles.tableCellRight}>{item.qty?.toLocaleString()}</Text></View>
                    <View style={PrintInvoiceStyles.tableColReturn}><Text style={PrintInvoiceStyles.tableCellRight}>{item.returnValue?.toLocaleString()}</Text></View>
                  </View>
                ))}
                {/* Subtotal Row for Sub Total for QTY and Return Value */}
                <View style={[PrintInvoiceStyles.tableRow, { backgroundColor: "#EAF6FF" }]}>
                  {/* Colspan for first four columns */}
                  <View style={PrintInvoiceStyles.returnSubtotalColspan}>
                    <Text style={[PrintInvoiceStyles.tableCellHeaderTotal, { textAlign: "center" }]}>Sub Total</Text>
                  </View>
                  {/* QTY */}
                  <View style={{ ...PrintInvoiceStyles.tableColReturn, width: "16.66%" }}>
                    <Text style={PrintInvoiceStyles.tableCellHeaderTotal}>
                      {(invoice.returns ?? []).reduce((sum: any, item: any) => sum + (item.qty || 0), 0).toLocaleString()}
                    </Text>
                  </View>
                  {/* Return Value */}
                  <View style={{ ...PrintInvoiceStyles.tableColReturn, width: "16.66%" }}>
                    <Text style={PrintInvoiceStyles.tableCellHeaderTotal}>
                      {(invoice.returns ?? []).reduce((sum: any, item: any) => sum + (item.returnValue || 0), 0).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        ) : (
          null
        )}

        {/* Summary (Right Side) */}
        <View style={pageSize === "3INCH" ? { paddingLeft: 18 } : PrintInvoiceStyles.summary}>
          <View style={PrintInvoiceStyles.hr} />
          <View style={PrintInvoiceStyles.summaryRow}>
            <Text style={pageSize === "3INCH" ? smallStyles.largeText : PrintInvoiceStyles.summaryLabel}>Gross Sale:</Text>
            <Text style={pageSize === "3INCH" ? smallStyles.largeText : PrintInvoiceStyles.summaryLabel}>
              {(invoice.items ?? []).reduce((sum: any, item: any) => sum + (item.salesValue || 0), 0).toLocaleString()}
            </Text>
          </View>
          <View style={PrintInvoiceStyles.summaryRow}>
            <Text style={pageSize === "3INCH" ? smallStyles.largeText : PrintInvoiceStyles.summaryLabel}>Discount (value):</Text>
            <Text style={pageSize === "3INCH" ? smallStyles.largeText : PrintInvoiceStyles.summaryLabel}>
              {(invoice.discounts ?? []).reduce((sum: any, d: any) => sum + (d.appliedDiscountValue || 0), 0).toLocaleString()}
            </Text>
          </View>
          <View style={PrintInvoiceStyles.summaryRow}>
            <Text style={pageSize === "3INCH" ? smallStyles.largeText : PrintInvoiceStyles.summaryLabel}>Return (value):</Text>
            <Text style={pageSize === "3INCH" ? smallStyles.largeText : PrintInvoiceStyles.summaryLabel}>
              {(invoice.returns ?? []).reduce((sum: any, d: any) => sum + (d.returnValue || 0), 0).toLocaleString()}
            </Text>
          </View>
          {/* <View style={PrintInvoiceStyles.summaryRow}>
            <Text style={pageSize==="3INCH" ? smallStyles.largeText :PrintInvoiceStyles.summaryLabel}>Invoice Sale:</Text>
            <Text style={pageSize==="3INCH" ? smallStyles.largeText :PrintInvoiceStyles.summaryLabel}>
              {(
                (invoice.items ?? []).reduce((sum: any, item: any) => sum + (item.salesValue || 0), 0)
                - (invoice.discounts ?? []).reduce((sum: any, d: any) => sum + (d.appliedDiscountValue || 0), 0)
              ).toLocaleString()}
            </Text>
          </View> */}
          <View style={PrintInvoiceStyles.hrLine} />
          <View style={PrintInvoiceStyles.summaryRow}>
            <Text style={pageSize === "3INCH" ? smallStyles.extraLargeTextBold : PrintInvoiceStyles.summaryLabel}>Net Sale:</Text>
            <Text style={pageSize === "3INCH" ? smallStyles.extraLargeTextBold : PrintInvoiceStyles.summaryLabel}>
              {(
                (invoice.items ?? []).reduce((sum: any, item: any) => sum + (item.salesValue || 0), 0)
                - (invoice.discounts ?? []).reduce((sum: any, d: any) => sum + (d.appliedDiscountValue || 0), 0)
                - (invoice.returns ?? []).reduce((sum: any, r: any) => sum + (r.returnValue || 0), 0)
              ).toLocaleString()}
            </Text>
          </View>
          <View style={PrintInvoiceStyles.hrLine} />
          <View style={PrintInvoiceStyles.summaryRow}>
            <Text style={pageSize === "3INCH" ? smallStyles.largeText : PrintInvoiceStyles.summaryLabel}>Payment:</Text>
            <Text style={pageSize === "3INCH" ? smallStyles.largeText : PrintInvoiceStyles.summaryLabel}>
              {invoice.payment?.payment }
            </Text>
          </View>
          <View style={PrintInvoiceStyles.summaryRow}>
            <Text style={pageSize === "3INCH" ? smallStyles.largeText : PrintInvoiceStyles.summaryLabel}>Balance:</Text>
            <Text style={pageSize === "3INCH" ? smallStyles.largeText : PrintInvoiceStyles.summaryLabel}>
              {invoice.payment?.balance}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={PrintInvoiceStyles.hrFooter} />
        <View style={PrintInvoiceStyles.footerBox}>
          <Text style={PrintInvoiceStyles.footer}>Thank you for your business!</Text>
        </View>
      </Page>
    </Document>
  )
};

const InvoicePrintPopup: React.FC<InvoicePrintPopupProps> = ({
  open,
  onClose,
  fileName,
  reportName,
  invoiceIDOrLostCallID,
}) => {
  const theme = useTheme();
  const [previewFormat, setPreviewFormat] = useState<"A4" | "3INCH">("3INCH");

  const existingSalesInvoice = useSelector((state) => state.tourSalesInvoiceSlice.SalesInvoiceByID);
  const appliedSalesDiscountList = useSelector((state) => state.tourSalesDiscountSlice.AppliedSalesDiscountList);
  const returnByInvoiceId = useSelector((state) => state.tourSalesReturnSlice.ReturnByInvoiceId);
  const outlet = useSelector((state) => state.outlet.outlet);
  const distributor = useSelector((state) => state.distributor.distributor);
  const selectedOutletInvoice = useSelector((state) => state.tourSalesPaymentSlice.selectedOutletInvoices);
  const [invoice, setInvoice] = useState<any>({});

  useEffect(() => {
    if (open) {
      fetchExistingSalesInvoice();
      fetchGetAppliedSalesDiscountByInvoiceId();
      fetchGetReturnInvoiceDetails();
    }
  }, [open]);

  useEffect(() => {
    if (existingSalesInvoice?.saleInvoiceHeader?.uId) {
      fetchGetPaymentDetailsByinvoice();
    }
  }, [existingSalesInvoice]);

  useEffect(() => {
    if (existingSalesInvoice?.saleInvoiceHeader) {
      fetchOutletData(existingSalesInvoice.saleInvoiceHeader.outletUId);
      fetchDistributorData(existingSalesInvoice.saleInvoiceHeader.distributorUId);
    }
  }, [existingSalesInvoice?.saleInvoiceHeader]);

  const fetchExistingSalesInvoice = async () => {
    try {
      await getSalesInvoiceByID(
        invoiceIDOrLostCallID
          ? invoiceIDOrLostCallID
          : localStorage.getItem("invoiceID")
      );
    } catch (error) {
      enqueueSnackbar("Error fetching existing sales invoice", {
        variant: "error",
      });
    }
  };

  const fetchGetAppliedSalesDiscountByInvoiceId = async () => {
    try {
      if (existingSalesInvoice) {
        await getAppliedSalesDiscountByInvoiceId(
          existingSalesInvoice.saleInvoiceHeader.uId
        );
      }
    } catch (error) { }
  };

  const fetchGetReturnInvoiceDetails = async () => {
    try {
      await getReturnInvoiceDetails(
        invoiceIDOrLostCallID
          ? invoiceIDOrLostCallID
          : localStorage.getItem("invoiceID")
      );
    } catch (error) {
      enqueueSnackbar("Failed to fetch return invoice details", {
        variant: "error",
      });
    }
  };

  const fetchGetPaymentDetailsByinvoice = async () => {
    try {
      const invoiceUid = existingSalesInvoice?.saleInvoiceHeader?.uId;
      await getInvoicePayments([invoiceUid], [1]);
    } catch (error) {
      enqueueSnackbar("Failed to fetch payment details", {
        variant: "error",
      })
    }
  }

  const fetchOutletData = async (outletID: number) => {
    try {
      await getOutletById(outletID);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDistributorData = async (distributorUId: number) => {
    try {
      await getDistributorById(distributorUId);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    // Format: DD/MM/YYYY
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${d.getFullYear()}`;
  };

  useEffect(() => {
    if (
      existingSalesInvoice?.saleInvoiceHeader &&
      outlet &&
      distributor
    ) {
      const items =
        existingSalesInvoice.saleInvoiceDetail
          .filter((detail: any) => detail.saleValue > 0)
          .map((detail: any) => ({
            pid: detail.productId,
            pname: detail.productName,
            mrp: detail.mrp,
            rate: detail.rate,
            sales: detail.sale,
            totalUnits: detail.saleQuantity,
            salesValue: detail.saleValue,
          }));

      const discounts =
        (appliedSalesDiscountList ?? []).map((discount: any) => ({
          id: discount.discountID,
          name: discount.discountName,
          appliedDiscount: discount.appliedProductDiscountQty ?? 0,
          appliedDiscountValue:
            discount.appliedValueDiscountProductOfferAmt ??
            discount.appliedInvoiceValueDiscountAmt ??
            0,
        }));

      const returns =
        (returnByInvoiceId.saleInvoiceReturnDetails ?? []).map((ret: any) => ({
          pid: ret.productId,
          pname: ret.productName,
          mrp: ret.mrp,
          rate: ret.rate,
          qty: ret.quantity,
          returnValue: ret.returnValue,
        }));

      const payment = {
        payment: existingSalesInvoice.saleInvoiceHeader?.paidAmount,
        balance: existingSalesInvoice.saleInvoiceHeader?.balanceAmount,
      };

      setInvoice({
        invoiceNo: existingSalesInvoice.saleInvoiceHeader.invoiceId,
        date: FormatDateWithTime(existingSalesInvoice.saleInvoiceHeader.invoiceDate),
        dueDate: formatDate(existingSalesInvoice.saleInvoiceHeader.invoiceDate),
        items,
        discounts,
        returns,
        payment,
        to: {
          name: outlet?.name,
          address: outlet?.address,
          contact: outlet?.contactNo1,
        },
        from: {
          name: distributor?.distributorName,
          address:
            distributor?.address +
            ", " +
            distributor?.addressLine1 +
            ", " +
            distributor?.addressLine2,
          phone: distributor?.mobileNo,
        },
      });
    }

  }, [
    existingSalesInvoice?.saleInvoiceHeader,
    existingSalesInvoice?.saleInvoiceDetail,
    appliedSalesDiscountList,
    returnByInvoiceId?.saleInvoiceReturnDetails,
    outlet,
    selectedOutletInvoice,
    distributor,
  ]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{ color: "white" }}
    >
      <DialogTitle sx={{ color: theme.palette.primary.main }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mr={4}
        >
          {reportName}
          {invoice && Object.keys(invoice).length > 0 ? (
            <Box display="flex" gap={2}>
              <PDFDownloadLink
                document={<InvoicePDF invoice={invoice} pageSize="A4" />}
                fileName={`${fileName}-A4.pdf`}
              >
                {/* @ts-ignore  */}
                {({ loading, error }) => {
                  if (loading) {
                    return <CircularProgress />;
                  }
                  if (error) {
                    enqueueSnackbar("Error generating A4 PDF", { variant: "error" });
                  }
                  return (
                    <Button variant="outlined" startIcon={<DownloadIcon />}>
                      Download A4
                    </Button>
                  );
                }}
              </PDFDownloadLink>
              <PDFDownloadLink
                document={<InvoicePDF invoice={invoice} pageSize="3INCH" />}
                fileName={`${fileName}-3inch.pdf`}
              >
                {/* @ts-ignore  */}
                {({ loading, error }) => {
                  if (loading) {
                    return <CircularProgress />;
                  }
                  if (error) {
                    enqueueSnackbar("Error generating 3-inch PDF", { variant: "error" });
                  }
                  return (
                    <Button variant="outlined" startIcon={<DownloadIcon />}>
                      Download 3-inch
                    </Button>
                  );
                }}
              </PDFDownloadLink>
            </Box>
          ) : (
            <Box display="flex" alignItems="center">
              <CircularProgress size={24} />
              <span style={{ marginLeft: 8 }}>Loading...</span>
            </Box>
          )}

        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {invoice.items?.length > 0 ? (
          <Box>
            <Box mb={2} display="flex" justifyContent="center" gap={2}>
              <Button
                variant={previewFormat === "A4" ? "contained" : "outlined"}
                onClick={() => setPreviewFormat("A4")}
                color={previewFormat === "A4" ? "primary" : "inherit"}
              >
                A4 Preview
              </Button>
              <Button
                variant={previewFormat === "3INCH" ? "contained" : "outlined"}
                onClick={() => setPreviewFormat("3INCH")}
                color={previewFormat === "3INCH" ? "primary" : "inherit"}
              >
                3-inch Preview
              </Button>
            </Box>
            <PDFViewer height="600px" width="100%">
              <InvoicePDF invoice={invoice} pageSize={previewFormat} />
            </PDFViewer>
          </Box>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InvoicePrintPopup;