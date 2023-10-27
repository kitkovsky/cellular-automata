export const includesMultiple = (
  str: string,
  searchStrings: readonly string[],
): boolean => {
  return searchStrings.every((searchString) => str.includes(searchString))
}
