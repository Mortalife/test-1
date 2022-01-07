import { expect } from "chai";
import ConversionService from "./conversionService";
import { getCurrencyData } from "./data";

describe("conversionService", () => {
  it("it should intialise with currency values", async () => {
    let hasError = false;
    let service;
    try {
      service = new ConversionService(getCurrencyData());
    } catch (err) {
      hasError = true;
    }

    expect(hasError).to.be.false;
    expect(service).to.be.instanceOf(ConversionService);
  });

  it("it should convert return the same values from same couple currencies: USD-USD", async () => {
    const service = new ConversionService(getCurrencyData());

    const conversion = service.convert("USD", 2, "USD");

    expect(conversion).to.equal(2);
  });
  it("it should convert return the same values from same couple currencies: USD-USD", async () => {
    const service = new ConversionService(getCurrencyData());

    const conversion = service.convert("EUR", 2, "EUR");

    expect(conversion).to.equal(2);
  });

  it("it should convert from EUR to USD", async () => {
    const service = new ConversionService(
      getCurrencyData({
        EUR: 0.1,
      })
    );

    const conversion = service.convert("EUR", 2, "USD");

    expect(conversion).to.equal(20);
  });

  it("it should convert from USD to EUR", async () => {
    const service = new ConversionService(
      getCurrencyData({
        EUR: 0.1,
      })
    );

    const conversion = service.convert("USD", 2, "EUR");

    expect(conversion).to.equal(0.2);
  });

  it("it should convert from EUR to GBP", async () => {
    const service = new ConversionService(
      getCurrencyData({
        EUR: 0.1,
        GBP: 0.2,
      })
    );

    const conversion = service.convert("EUR", 2, "GBP");

    expect(conversion).to.equal(4);
  });
});
