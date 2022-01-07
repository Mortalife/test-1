import { expect } from "chai";
import { InvalidQueryParams } from "../errors";
import getCurrencyData from "../services/data";
import {
  convertCurrencyValues,
  currencyAddition,
  getCurrencyValues,
} from "./conversion";

describe("conversions", () => {
  describe("getCurrencyValues", async () => {
    it("it should return the currency values", async () => {
      const values = getCurrencyData();
      const currencyValues = await getCurrencyValues();
      expect(JSON.stringify(currencyValues)).to.be.equal(
        JSON.stringify(values)
      );
    });
  });

  describe("convertCurrencyValues", async () => {
    it("it should throw an error with incomplete data: no fromCurrency", async () => {
      let error;
      try {
        await convertCurrencyValues({
          query: {},
        } as any);
      } catch (err) {
        error = err;
      }

      expect(error).instanceOf(InvalidQueryParams);
      expect((error as InvalidQueryParams).message).to.be.equal(
        "From currency is not valid"
      );
    });

    it("it should throw an error with incomplete data: no toCurrency", async () => {
      let error;
      try {
        await convertCurrencyValues({
          query: { fromCurrency: "GBP" },
        } as any);
      } catch (err) {
        error = err;
      }

      expect(error).instanceOf(InvalidQueryParams);
      expect((error as InvalidQueryParams).message).to.be.equal(
        "To currency is not valid"
      );
    });

    it("it should throw an error with incomplete data: no value", async () => {
      let error;
      try {
        await convertCurrencyValues({
          query: { fromCurrency: "GBP", toCurrency: "USD" },
        } as any);
      } catch (err) {
        error = err;
      }

      expect(error).instanceOf(InvalidQueryParams);
      expect((error as InvalidQueryParams).message).to.be.equal(
        "You must provide a currency"
      );
    });

    it("it should return the correct response format", async () => {
      let error;
      let response;
      try {
        response = await convertCurrencyValues({
          query: { fromCurrency: "GBP", toCurrency: "USD", value: 1 },
        } as any);
      } catch (err) {
        error = err;
      }

      expect(error).to.be.undefined;
      expect(response?.currency).to.be.exist;
      expect(response?.value).to.exist;
    });
  });

  describe("currencyAddition", async () => {
    it("it should throw an error with incomplete data: no data", async () => {
      let error;
      try {
        await currencyAddition({
          body: {},
        } as any);
      } catch (err) {
        error = err;
      }

      expect(error).instanceOf(InvalidQueryParams);
      expect((error as InvalidQueryParams).message).to.be.equal(
        "There are no values to add"
      );
    });
    it("it should throw an error with incomplete data: no values", async () => {
      let error;
      try {
        await currencyAddition({
          body: {
            values: [],
          },
        } as any);
      } catch (err) {
        error = err;
      }

      expect(error).instanceOf(InvalidQueryParams);
      expect((error as InvalidQueryParams).message).to.be.equal(
        "There are no values to add"
      );
    });

    it("it should throw an error with incomplete data: no value in currencyValue array", async () => {
      let error;
      try {
        await currencyAddition({
          body: {
            values: [{ currency: "GBP", value: 1 }, { currency: "EUR" }],
            toCurrency: "CAD",
          },
        } as any);
      } catch (err) {
        error = err;
      }

      expect(error).instanceOf(InvalidQueryParams);
      expect((error as InvalidQueryParams).message).to.be.equal(
        "Missing value in values array: index 1"
      );
    });

    it("it should throw an error with incomplete data: no toCurrency", async () => {
      let error;
      try {
        await currencyAddition({
          body: {
            values: [
              { currency: "GBP", value: 1 },
              { currency: "EUR", value: 2 },
            ],
          },
        } as any);
      } catch (err) {
        error = err;
      }

      expect(error).instanceOf(InvalidQueryParams);
      expect((error as InvalidQueryParams).message).to.be.equal(
        "To currency is not valid"
      );
    });

    it("it should return the correct response format", async () => {
      let error;
      let response;
      try {
        response = await currencyAddition({
          body: {
            values: [
              { currency: "GBP", value: 1 },
              { currency: "EUR", value: 2 },
            ],
            toCurrency: "CAD",
          },
        } as any);
      } catch (err) {
        error = err;
      }

      expect(error).to.be.undefined;
      expect(response?.currency).to.be.exist;
      expect(response?.value).to.exist;
    });

    it("it should return the correct response values", async () => {
      let error;
      let response;
      try {
        response = await currencyAddition({
          body: {
            values: [
              { currency: "GBP", value: 99 },
              { currency: "EUR", value: 13.12 },
            ],
            toCurrency: "CAD",
          },
        } as any);
      } catch (err) {
        error = err;
      }

      expect(error).to.be.undefined;
      expect(response?.currency).to.be.equal("CAD");
      expect(response?.value).to.be.equal(185.64);
    });
  });
});
