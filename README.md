# Currency Conversion

Version Number: 5b8d0fd276b6d288905ed2f63a934e057e8feca2

## Environment

- Node v14.17.2 (npm v6.14.13)
- Yarn v1.22.13

This repository uses yarn as the package manager, if you do not have yarn globally installed install it with the command below.

`npm install -g yarn`

## Installation

- `yarn install`

## Testing

- `yarn run build`
- `yarn run test`

## Running the server

- `yarn run build`
- `yarn run server`

The server should now be running at port: 3000, should you require a different port please pass a `PORT` environment.

`PORT=8080 yarn run server`

## Usage

You can get a currency converted with a get request providing the correct query parameters.

All responses are in JSON.

### Example 1 - Return the exchange rate from Euro to Dollars

Request:

```
curl --location --request GET 'http://localhost:3000/rate?fromCurrency=EUR'
```

Response:

```
{
    "data": {
        "rate": 1.1387576154415533
    }
}
```

### Example 2 - Convert US dollars to British Pounds

Request:

```
curl --location --request GET 'http://localhost:3000/convert?fromCurrency=USD&toCurrency=GBP&value=50'
```

Response:

```
{
    "data": {
        "value": 39.28,
        "currency": "GBP"
    }
}
```

### Example 3 - Convert Euro to British Pounds

Request:

```
curl --location --request GET 'http://localhost:3000/convert?fromCurrency=EUR&toCurrency=GBP&value=50'
```

Response:

```
{
    "data": {
        "value": 44.74,
        "currency": "GBP"
    }
}
```

If you fail to provide the required fields, or they are invalid, then you will recieve an error with status code `400`.

All responses are in JSON

You can perform an addition using a post request:

Request:

```
curl --location --request POST 'localhost:3000/convert/addition' \
--header 'Content-Type: application/json' \
--data-raw '{
    "toCurrency": "CAD",
    "values": [
        {
            "currency": "EUR",
            "value": 13.12
        },
        {
            "currency": "GBP",
            "value": 99
        }
    ]
}'
```

Response:

```
{
    "data": {
        "currency": "CAD",
        "value": 185.64
    }
}
```
