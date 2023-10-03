export const extractPrice = (...elements: any) => {
  for (const element of elements) {
    const priceText = element.text().trim();

    if (priceText) return priceText.replace(/[^\d.]/g, '');
  }

  return '';
};

export const extractCurrency = (element: any) => {
  const currentText = element.text().trim().slice(0, 1);
  return currentText ? currentText : '';
};
