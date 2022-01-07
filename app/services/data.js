"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrencies = exports.getCurrencyData = void 0;
function getCurrencyData(values = {}) {
    return {
        EUR: 0.87815,
        GBP: 0.78569,
        CAD: 1.31715,
        INR: 69.3492,
        MXN: 19.2316,
        AUD: 1.43534,
        CNY: 6.88191,
        MYR: 4.13785,
        COP: 3203.18,
        ...values,
    };
}
exports.getCurrencyData = getCurrencyData;
function getCurrencies() {
    return [...new Set([...Object.keys(getCurrencyData()), "USD"])];
}
exports.getCurrencies = getCurrencies;
exports.default = getCurrencyData;
