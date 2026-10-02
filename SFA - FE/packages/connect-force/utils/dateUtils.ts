import dayjs from "dayjs";

export const FormatDate = (dateString: any) => {
  if (dateString != null) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } else {
    return "--/--/----";
  }
};

export function formatToOnlyDate(date?: string | Date | null): string {
  if (!date) return "";
  return dayjs(date).format("YYYY-MM-DD");
}

export function FormatDateWithTime(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  const formattedHours = String(hours).padStart(2, "0");

  return `${day}/${month}/${year}, ${formattedHours}:${minutes} ${ampm}`;
}

export const toDateOnly = (d: any) => (d ? dayjs(d).format("YYYY-MM-DD") : null);
