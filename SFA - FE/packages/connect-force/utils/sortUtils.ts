import { useCallback } from "react";

export const statusSortComparator = (propertyName: string) => {
  return (_v1: any, _v2: any, param1: any, param2: any) => {
    const value1 = param1.api.getRow(param1.id)[propertyName] ? 1 : 0;
    const value2 = param2.api.getRow(param2.id)[propertyName] ? 1 : 0;
    return value1 - value2;
  };
};

export const mapListToOptions = (
  list: any[],
  labelKey: string,
  valueKey: string,
  labelFormatter?: (item: any) => string
) => {
  if (!Array.isArray(list) || list.length === 0) {
    return [];
  }
  return list.map((item) => ({
    label: labelFormatter ? labelFormatter(item) : item[labelKey],
    value: item[valueKey],
  }));
};
