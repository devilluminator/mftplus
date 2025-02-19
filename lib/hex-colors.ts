function isHexColor(str: string) {
  const hexColorPattern = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
  return hexColorPattern.test(str);
}

export const colorsPallet = (colors: string) => {
  const colors_array = colors.split(",");
  const filteredColors = colors_array.filter((color) => isHexColor(color));
  return filteredColors;
};
