import express, { Request, Response } from "express";
import {
  convertCurrencyValues,
  currencyAddition,
  getConversionRate,
  getCurrencyValues,
} from "./endpoints/conversion";

import { InvalidQueryParams } from "./errors";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function asyncHandler(
  endpointFunction: (req: Request, res: Response) => Promise<void>
) {
  return (req: Request, res: Response) => {
    Promise.resolve()
      .then(async () => {
        await endpointFunction(req, res);
      })
      .catch((e: Error) => {
        if (e instanceof InvalidQueryParams) {
          res.status(e.status).json({
            error: e.message,
          });
        } else {
          res.sendStatus(500);
        }
      });
  };
}

app.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const currencyValues = await getCurrencyValues();
    res.json({ data: currencyValues });
  })
);

app.get(
  "/rate",
  asyncHandler(async (req: Request, res: Response) => {
    const rate = await getConversionRate(req);
    res.json({ data: rate });
  })
);

app.get(
  "/convert",
  asyncHandler(async (req: Request, res: Response) => {
    const currencyValues = await convertCurrencyValues(req);
    res.json({ data: currencyValues });
  })
);

app.post(
  "/convert/addition",
  asyncHandler(async (req: Request, res: Response) => {
    const currencyValues = await currencyAddition(req);
    res.json({ data: currencyValues });
  })
);

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
