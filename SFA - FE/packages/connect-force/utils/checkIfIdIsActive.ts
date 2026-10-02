export function checkIfIdIsActive(
  id: number,
  activeDataArray: { uId: number }[]
): number | null {
  if (!activeDataArray || activeDataArray.length === 0) {
    return null;
  }

  const isActive = activeDataArray.some((item) => item.uId === id);

  return isActive ? id : null;
}
