// PDF REPORT
export const getCurrentDate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// CSV REPORT
import { Parser } from "@json2csv/plainjs";

export const generateCSVWithHeader = (
  companyInfo: any,
  rowsWithTotal: any[],
  fileName: string,
  selectedSummaryValue?: string
) => {
  const parser = new Parser();

  // Convert companyInfo to CSV with merged cells
  const companyInfoCSV = Object.entries(companyInfo)
    .map(([key, value]) => `${key},${value},`)
    .join("\n");

  const filteredRows = rowsWithTotal.map((row: any) => {
    if (selectedSummaryValue === "Summary") {
      const { mrp, ...rest } = row;
      return rest;
    }
    return row;
  });

  // Convert rowsWithTotal to CSV
  //   const rowsWithTotalCSV = parser.parse(rowsWithTotal);
  const rowsWithTotalCSV = parser.parse(filteredRows);

  // Combine both CSV strings with a separator
  const combinedCSV = `${companyInfoCSV}\n\n${rowsWithTotalCSV}`;
  const blob = new Blob([combinedCSV], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${fileName}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
