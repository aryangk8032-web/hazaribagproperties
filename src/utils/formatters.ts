import { AreaUnit } from '../types/property';

/**
 * Format Indian currency into standard readable formats:
 * e.g., 4500000 -> "₹45 Lakh", 12500000 -> "₹1.25 Cr", 15000 -> "₹15,000"
 */
export function formatIndianPrice(amount: number, purpose: 'buy' | 'rent' = 'buy'): string {
  if (isNaN(amount) || amount === 0) return 'Price on Request';

  if (purpose === 'rent') {
    return `₹${amount.toLocaleString('en-IN')}/mo`;
  }

  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(2);
    // Remove trailing zeros like 1.50 -> 1.5
    return `₹${parseFloat(cr)} Crore`;
  } else if (amount >= 100000) {
    const lakh = (amount / 100000).toFixed(2);
    return `₹${parseFloat(lakh)} Lakh`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}k`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatIndianPriceFull(amount: number): string {
  if (isNaN(amount) || amount === 0) return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Unit conversions for Hazaribagh / Jharkhand land conventions:
 * 1 Decimal = 435.6 sq.ft
 * 1 Katha (Hazaribagh standard) = 1.65 Decimal ≈ 718.74 sq.ft (standard approx 720 sq.ft)
 * 1 Acre = 100 Decimal = 43,560 sq.ft
 * 1 Sq.Meter ≈ 10.764 sq.ft
 */
export const CONVERSION_RATES_TO_SQFT: Record<AreaUnit, number> = {
  'sq.ft': 1,
  'decimal': 435.6,
  'katha': 720,
  'acre': 43560,
  'sq.m': 10.7639,
};

export function convertArea(value: number, fromUnit: AreaUnit, toUnit: AreaUnit): number {
  if (fromUnit === toUnit) return value;
  const sqft = value * CONVERSION_RATES_TO_SQFT[fromUnit];
  const converted = sqft / CONVERSION_RATES_TO_SQFT[toUnit];
  return parseFloat(converted.toFixed(2));
}

export function formatArea(area?: number, unit: AreaUnit = 'sq.ft'): string {
  if (!area) return 'N/A';
  return `${area.toLocaleString('en-IN')} ${unit}`;
}

export function calculateRatePerUnit(price: number, area?: number, unit: AreaUnit = 'sq.ft'): string {
  if (!area || area === 0 || !price || price === 0) return '';
  const rate = Math.round(price / area);
  return `₹${rate.toLocaleString('en-IN')} / ${unit}`;
}

export function formatIndianDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
