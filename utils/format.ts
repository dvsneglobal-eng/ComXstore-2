
import { Currency } from '../types';

export const formatCurrency = (amount: number, currency: Currency): string => {
  const symbols: Record<Currency, string> = {
    [Currency.USD]: '$',
    [Currency.NGN]: '₦',
    [Currency.GHS]: 'GH₵',
    [Currency.KES]: 'KSh'
  };

  return `${symbols[currency]}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};
