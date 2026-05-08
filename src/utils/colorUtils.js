// utils/colorUtils.js
export const getHeatmapColor = (percentage) => {
  // Light blue (#f0f9ff) to dark blue (#0284c7)
  const startColor = { r: 240, g: 249, b: 255 }; // #f0f9ff
  const endColor = { r: 2, g: 132, b: 199 }; // #0284c7
  
  const r = Math.round(startColor.r + (endColor.r - startColor.r) * percentage);
  const g = Math.round(startColor.g + (endColor.g - startColor.g) * percentage);
  const b = Math.round(startColor.b + (endColor.b - startColor.b) * percentage);
  
  return `rgb(${r}, ${g}, ${b})`;
};

export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};