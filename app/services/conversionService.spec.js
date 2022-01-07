"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const conversionService_1 = __importDefault(require("./conversionService"));
const data_1 = require("./data");
describe("conversionService", () => {
    it("it should intialise with currency values", async () => {
        let hasError = false;
        let service;
        try {
            service = new conversionService_1.default((0, data_1.getCurrencyData)());
        }
        catch (err) {
            hasError = true;
        }
        (0, chai_1.expect)(hasError).to.be.false;
        (0, chai_1.expect)(service).to.be.instanceOf(conversionService_1.default);
    });
    it("it should convert return the same values from same couple currencies: USD-USD", async () => {
        const service = new conversionService_1.default((0, data_1.getCurrencyData)());
        const conversion = service.convert("USD", 2, "USD");
        (0, chai_1.expect)(conversion).to.equal(2);
    });
    it("it should convert return the same values from same couple currencies: USD-USD", async () => {
        const service = new conversionService_1.default((0, data_1.getCurrencyData)());
        const conversion = service.convert("EUR", 2, "EUR");
        (0, chai_1.expect)(conversion).to.equal(2);
    });
    it("it should convert from EUR to USD", async () => {
        const service = new conversionService_1.default((0, data_1.getCurrencyData)({
            EUR: 0.1,
        }));
        const conversion = service.convert("EUR", 2, "USD");
        (0, chai_1.expect)(conversion).to.equal(20);
    });
    it("it should convert from USD to EUR", async () => {
        const service = new conversionService_1.default((0, data_1.getCurrencyData)({
            EUR: 0.1,
        }));
        const conversion = service.convert("USD", 2, "EUR");
        (0, chai_1.expect)(conversion).to.equal(0.2);
    });
    it("it should convert from EUR to GBP", async () => {
        const service = new conversionService_1.default((0, data_1.getCurrencyData)({
            EUR: 0.1,
            GBP: 0.2,
        }));
        const conversion = service.convert("EUR", 2, "GBP");
        (0, chai_1.expect)(conversion).to.equal(4);
    });
});
