"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currencyAddition = exports.getConversionRate = exports.convertCurrencyValues = exports.getCurrencyValues = void 0;
const conversionService_1 = __importDefault(require("../services/conversionService"));
const data_1 = __importStar(require("../services/data"));
const errors_1 = require("../errors");
const CURRENCY_DATA = (0, data_1.default)();
const CURRENCIES = (0, data_1.getCurrencies)();
const service = new conversionService_1.default(CURRENCY_DATA);
async function getCurrencyValues() {
    return CURRENCY_DATA;
}
exports.getCurrencyValues = getCurrencyValues;
async function convertCurrencyValues(req) {
    const query = req.query;
    if (!query.fromCurrency || !CURRENCIES.includes(query.fromCurrency)) {
        throw new errors_1.InvalidQueryParams("From currency is not valid");
    }
    if (!query.toCurrency || !CURRENCIES.includes(query.toCurrency)) {
        throw new errors_1.InvalidQueryParams("To currency is not valid");
    }
    if (!query.value) {
        throw new errors_1.InvalidQueryParams("You must provide a currency");
    }
    const inputValue = parseFloat(`${query.value}`);
    const value = await service.convert(query.fromCurrency, inputValue, query.toCurrency);
    return {
        value,
        currency: query.toCurrency,
    };
}
exports.convertCurrencyValues = convertCurrencyValues;
async function getConversionRate(req) {
    const query = req.query;
    if (!query.fromCurrency || !CURRENCIES.includes(query.fromCurrency)) {
        throw new errors_1.InvalidQueryParams("From currency is not valid");
    }
    const rate = 1 / CURRENCY_DATA[query.fromCurrency];
    return {
        rate,
    };
}
exports.getConversionRate = getConversionRate;
async function currencyAddition(req) {
    const body = req.body;
    if (!body.values || body.values.length === 0) {
        throw new errors_1.InvalidQueryParams("There are no values to add");
    }
    if (!body.toCurrency || !CURRENCIES.includes(body.toCurrency)) {
        throw new errors_1.InvalidQueryParams("To currency is not valid");
    }
    for (const [i, currencyValue] of body.values.entries()) {
        if (!currencyValue.currency ||
            !CURRENCIES.includes(currencyValue.currency)) {
            throw new errors_1.InvalidQueryParams(`From currency is not valid: index ${i}`);
        }
        if (!currencyValue.value) {
            throw new errors_1.InvalidQueryParams(`Missing value in values array: index ${i}`);
        }
    }
    const usdValues = await Promise.all(body.values.map(async ({ currency, value }) => service.convert(currency, value, "USD")));
    const usdValue = usdValues.reduce((acc, value) => acc + value, 0);
    const value = await service.convert("USD", usdValue, body.toCurrency);
    return {
        currency: body.toCurrency,
        value,
    };
}
exports.currencyAddition = currencyAddition;
