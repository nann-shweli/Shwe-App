export const moneyFormat = ({
  amount = 0,
  lang = 'en',
  decimalDigits = 2,
}: {
  amount?: number | string;
  lang?: string;
  decimalDigits?: number;
}) => {
  const numericAmount =
    typeof amount === 'string' ? parseFloat(amount) : amount;

  return numericAmount.toLocaleString(lang, {
    minimumFractionDigits: decimalDigits,
    maximumFractionDigits: decimalDigits,
  });
};
