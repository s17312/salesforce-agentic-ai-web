export const extractProductName = (productName: string): string => {
  const mainPart = productName.split("##")[0];
  const nameParts = mainPart.split("-");
  if (nameParts.length > 1) {
    return nameParts.slice(1).join("-").trim();
  }

  return productName;
};
