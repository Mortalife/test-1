"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversionService = void 0;
class ConversionService {
    constructor(usdValues) {
        this.usdValues = usdValues;
    }
    convert(fromCurrency, value, toCurrency, dp = 2) {
        if (fromCurrency === toCurrency) {
            return parseFloat(value.toFixed(dp));
        }
        if (fromCurrency === "USD") {
            const usd = value * this.usdValues[toCurrency];
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
exports.ConversionService = ConversionService;
exports.default = ConversionService;
