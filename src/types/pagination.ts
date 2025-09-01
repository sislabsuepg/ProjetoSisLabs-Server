export function getPaginationParams(
  page?: number | undefined,
  items?: number | undefined
): { offset: number | undefined; limit: number | undefined } {
  if (
    page === undefined ||
    items === undefined ||
    page < 1 ||
    items <= 0 ||
    isNaN(page) ||
    isNaN(items)
  ) {
    return { offset: undefined, limit: undefined };
  }
  const offset = (page - 1) * items;
  return { offset, limit: items };
}
