"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const conversion_1 = require("./endpoints/conversion");
const errors_1 = require("./errors");
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
function asyncHandler(endpointFunction) {
    return (req, res) => {
        Promise.resolve()
            .then(async () => {
            await endpointFunction(req, res);
        })
            .catch((e) => {
            if (e instanceof errors_1.InvalidQueryParams) {
                res.status(e.status).json({
                    error: e.message,
                });
            }
            else {
                res.sendStatus(500);
            }
        });
    };
}
app.get("/", asyncHandler(async (req, res) => {
    const currencyValues = await (0, conversion_1.getCurrencyValues)();
    res.json({ data: currencyValues });
}));
app.get("/rate", asyncHandler(async (req, res) => {
    const rate = await (0, conversion_1.getConversionRate)(req);
    res.json({ data: rate });
}));
app.get("/convert", asyncHandler(async (req, res) => {
    const currencyValues = await (0, conversion_1.convertCurrencyValues)(req);
    res.json({ data: currencyValues });
}));
app.post("/convert/addition", asyncHandler(async (req, res) => {
    const currencyValues = await (0, conversion_1.currencyAddition)(req);
    res.json({ data: currencyValues });
}));
app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});
