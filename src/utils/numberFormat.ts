const sanitizeNumericValue = (value: string): string => value.replace(/\D/g, '');

export const sanitizeNumericInput = (value: string): string => {
  if (!value) {
    return '';
  }
  return sanitizeNumericValue(value);
};

interface FormatCurrencyOptions {
  withSymbol?: boolean;
}

export const formatCurrency = (value: string, options: FormatCurrencyOptions = {}): string => {
  const numericValue = sanitizeNumericValue(value);
  if (!numericValue) {
    return '';
  }

  const amount = parseInt(numericValue, 10);

  if (options.withSymbol) {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  return new Intl.NumberFormat('nl-NL').format(amount);
};
