import ConversionService, {
  ConversionCurrencies,
  ConversionCurrencyValues,
} from "../services/conversionService";
import getCurrencyData, { getCurrencies } from "../services/data";
import { Request } from "express";
import { InvalidQueryParams } from "../errors";

const CURRENCY_DATA = getCurrencyData();
const CURRENCIES = getCurrencies();

const service = new ConversionService(CURRENCY_DATA);

export interface ICurrencyValue {
  value: number;
  currency: ConversionCurrencies;
}

export interface ICurrencyConversionResponse extends ICurrencyValue {}

export interface ICurrencyConversionRequestQuery {
  fromCurrency: ConversionCurrencies;
  toCurrency: ConversionCurrencies;
  value: string;
}
export async function getCurrencyValues() {
  return CURRENCY_DATA;
}

export async function convertCurrencyValues(
  req: Request
): Promise<ICurrencyConversionResponse> {
  const query = req.query as unknown as ICurrencyConversionRequestQuery;

  if (!query.fromCurrency || !CURRENCIES.includes(query.fromCurrency)) {
    throw new InvalidQueryParams("From currency is not valid");
  }

  if (!query.toCurrency || !CURRENCIES.includes(query.toCurrency)) {
    throw new InvalidQueryParams("To currency is not valid");
  }

  if (!query.value) {
    throw new InvalidQueryParams("You must provide a currency");
  }

  const inputValue = parseFloat(`${query.value}`);
  const value = await service.convert(
    query.fromCurrency,
    inputValue,
    query.toCurrency
  );

  return {
    value,
    currency: query.toCurrency,
  };
}

export interface ICurrencyConversionRateRequestQuery {
  fromCurrency: ConversionCurrencyValues;
  toCurrency: ConversionCurrencyValues;
}

export interface ICurrencyConversionRateResponse {
  rate: number;
}

export async function getConversionRate(
  req: Request
): Promise<ICurrencyConversionRateResponse> {
  const query = req.query as unknown as ICurrencyConversionRateRequestQuery;

  if (!query.fromCurrency || !CURRENCIES.includes(query.fromCurrency)) {
    throw new InvalidQueryParams("From currency is not valid");
  }

  const rate =
    1 / CURRENCY_DATA[query.fromCurrency as ConversionCurrencyValues];

  return {
    rate,
  };
}

export interface ICurrencyAdditionRequestQuery {
  toCurrency: ConversionCurrencies;
  values: ICurrencyValue[];
}

export async function currencyAddition(req: Request) {
  const body = req.body as unknown as ICurrencyAdditionRequestQuery;

  if (!body.values || body.values.length === 0) {
    throw new InvalidQueryParams("There are no values to add");
  }

  if (!body.toCurrency || !CURRENCIES.includes(body.toCurrency)) {
    throw new InvalidQueryParams("To currency is not valid");
  }

  for (const [i, currencyValue] of body.values.entries()) {
    if (
      !currencyValue.currency ||
      !CURRENCIES.includes(currencyValue.currency)
    ) {
      throw new InvalidQueryParams(`From currency is not valid: index ${i}`);
    }
    if (!currencyValue.value) {
      throw new InvalidQueryParams(`Missing value in values array: index ${i}`);
    }
  }

  const usdValues = await Promise.all(
    body.values.map(async ({ currency, value }) =>
      service.convert(currency, value, "USD")
    )
  );

  const usdValue = usdValues.reduce((acc: number, value) => acc + value, 0);

  const value = await service.convert("USD", usdValue, body.toCurrency);

  return {
    currency: body.toCurrency,
    value,
  };
}
