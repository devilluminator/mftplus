function removeCommas(numberString: string) {
  return numberString.replace(/,/g, "");
}
// calculating the percentage
function calculatePercentage(numberString: string, percentage: string) {
  const number = parseFloat(removeCommas(numberString));
  const result = (number * Number(percentage)) / 100;
  return result.toLocaleString("en-US");
}

export { calculatePercentage, removeCommas };
