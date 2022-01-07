"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const errors_1 = require("../errors");
const data_1 = __importDefault(require("../services/data"));
const conversion_1 = require("./conversion");
describe("conversions", () => {
    describe("getCurrencyValues", async () => {
        it("it should return the currency values", async () => {
            const values = (0, data_1.default)();
            const currencyValues = await (0, conversion_1.getCurrencyValues)();
            (0, chai_1.expect)(JSON.stringify(currencyValues)).to.be.equal(JSON.stringify(values));
        });
    });
    describe("convertCurrencyValues", async () => {
        it("it should throw an error with incomplete data: no fromCurrency", async () => {
            let error;
            try {
                await (0, conversion_1.convertCurrencyValues)({
                    query: {},
                });
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).instanceOf(errors_1.InvalidQueryParams);
            (0, chai_1.expect)(error.message).to.be.equal("From currency is not valid");
        });
        it("it should throw an error with incomplete data: no toCurrency", async () => {
            let error;
            try {
                await (0, conversion_1.convertCurrencyValues)({
                    query: { fromCurrency: "GBP" },
                });
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).instanceOf(errors_1.InvalidQueryParams);
            (0, chai_1.expect)(error.message).to.be.equal("To currency is not valid");
        });
        it("it should throw an error with incomplete data: no value", async () => {
            let error;
            try {
                await (0, conversion_1.convertCurrencyValues)({
                    query: { fromCurrency: "GBP", toCurrency: "USD" },
                });
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).instanceOf(errors_1.InvalidQueryParams);
            (0, chai_1.expect)(error.message).to.be.equal("You must provide a currency");
        });
        it("it should return the correct response format", async () => {
            let error;
            let response;
            try {
                response = await (0, conversion_1.convertCurrencyValues)({
                    query: { fromCurrency: "GBP", toCurrency: "USD", value: 1 },
                });
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).to.be.undefined;
            (0, chai_1.expect)(response?.currency).to.be.exist;
            (0, chai_1.expect)(response?.value).to.exist;
        });
    });
    describe("currencyAddition", async () => {
        it("it should throw an error with incomplete data: no data", async () => {
            let error;
            try {
                await (0, conversion_1.currencyAddition)({
                    body: {},
                });
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).instanceOf(errors_1.InvalidQueryParams);
            (0, chai_1.expect)(error.message).to.be.equal("There are no values to add");
        });
        it("it should throw an error with incomplete data: no values", async () => {
            let error;
            try {
                await (0, conversion_1.currencyAddition)({
                    body: {
                        values: [],
                    },
                });
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).instanceOf(errors_1.InvalidQueryParams);
            (0, chai_1.expect)(error.message).to.be.equal("There are no values to add");
        });
        it("it should throw an error with incomplete data: no value in currencyValue array", async () => {
            let error;
            try {
                await (0, conversion_1.currencyAddition)({
                    body: {
                        values: [{ currency: "GBP", value: 1 }, { currency: "EUR" }],
                        toCurrency: "CAD",
                    },
                });
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).instanceOf(errors_1.InvalidQueryParams);
            (0, chai_1.expect)(error.message).to.be.equal("Missing value in values array: index 1");
        });
        it("it should throw an error with incomplete data: no toCurrency", async () => {
            let error;
            try {
                await (0, conversion_1.currencyAddition)({
                    body: {
                        values: [
                            { currency: "GBP", value: 1 },
                            { currency: "EUR", value: 2 },
                        ],
                    },
                });
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).instanceOf(errors_1.InvalidQueryParams);
            (0, chai_1.expect)(error.message).to.be.equal("To currency is not valid");
        });
        it("it should return the correct response format", async () => {
            let error;
            let response;
            try {
                response = await (0, conversion_1.currencyAddition)({
                    body: {
                        values: [
                            { currency: "GBP", value: 1 },
                            { currency: "EUR", value: 2 },
                        ],
                        toCurrency: "CAD",
                    },
                });
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).to.be.undefined;
            (0, chai_1.expect)(response?.currency).to.be.exist;
            (0, chai_1.expect)(response?.value).to.exist;
        });
        it("it should return the correct response values", async () => {
            let error;
            let response;
            try {
                response = await (0, conversion_1.currencyAddition)({
                    body: {
                        values: [
                            { currency: "GBP", value: 99 },
                            { currency: "EUR", value: 13.12 },
                        ],
                        toCurrency: "CAD",
                    },
                });
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).to.be.undefined;
            (0, chai_1.expect)(response?.currency).to.be.equal("CAD");
            (0, chai_1.expect)(response?.value).to.be.equal(185.64);
        });
    });
});
