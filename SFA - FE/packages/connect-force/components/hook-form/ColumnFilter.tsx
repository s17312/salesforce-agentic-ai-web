import { useEffect, useState } from "react";

type SelectedStatus = {
  [key: string]: string;
};

const getNestedValue = (obj: any, path: string): any => {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
};

export function useColumnFilter<T>(
  rows: T[],
  columns: any[],
  selectedValueKey?: string
) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<SelectedStatus>({});
  const [searchedRows, setSearchedRows] = useState<T[]>(rows);

  useEffect(() => {
    const selectedColumn = selectedStatus["searchColumn"] || "All";
    const lower = searchQuery.toLowerCase();

    let filtered = rows;

    if (searchQuery) {
      filtered = rows.filter((row: any) => {
        if (selectedColumn === "All") {
          return columns.some((col) => {
            const value = getNestedValue(row, col.field);
            return String(value ?? "")
              .toLowerCase()
              .includes(lower);
          });
        }

        const value = getNestedValue(row, selectedColumn);
        return String(value ?? "")
          .toLowerCase()
          .includes(lower);
      });
    }

    setSearchedRows(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedStatus, rows, selectedValueKey]);

  return {
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    searchedRows,
  };
}
