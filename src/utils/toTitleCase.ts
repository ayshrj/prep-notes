export const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) =>
      word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : ""
    )
    .join(" ");
};
