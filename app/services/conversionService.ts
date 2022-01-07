export type TUSDConversionValues = {
  [key in ConversionCurrencyValues]: number;
};

export type ConversionCurrencies =
  | "USD"
  | "EUR"
  | "GBP"
  | "CAD"
  | "INR"
  | "MXN"
  | "AUD"
  | "CNY"
  | "MYR"
  | "COP";

export type ConversionCurrencyValues = Exclude<ConversionCurrencies, "USD">;

export class ConversionService {
  private usdValues: TUSDConversionValues;

  constructor(usdValues: TUSDConversionValues) {
    this.usdValues = usdValues;
  }

  public convert(
    fromCurrency: ConversionCurrencies,
    value: number,
    toCurrency: ConversionCurrencies,
    dp: number = 2
  ): number {
    if (fromCurrency === toCurrency) {
      return parseFloat(value.toFixed(dp));
    }

    if (fromCurrency === "USD") {
      const usd =
        value * this.usdValues[toCurrency as ConversionCurrencyValues];
      return parseFloat(usd.toFixed(dp));
    }

    // fromCurrency to USD
    const inUSD = value / this.usdValues[fromCurrency];

    if (toCurrency === "USD") {
      // Straight conversion
      return parseFloat(inUSD.toFixed(dp));
    }

    // USD to toCurrency
    const inConvertedCurrency = inUSD * this.usdValues[toCurrency];
    return parseFloat(inConvertedCurrency.toFixed(dp));
  }
}

export default ConversionService;
