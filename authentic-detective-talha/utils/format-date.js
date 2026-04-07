export function FormatDateToMonthAndDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "short", day: "2-digit" };
  return date.toLocaleDateString("en-US", options);
}
