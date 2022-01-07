"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidQueryParams = void 0;
class InvalidQueryParams extends Error {
    constructor() {
        super(...arguments);
        this.status = 400;
    }
}
exports.InvalidQueryParams = InvalidQueryParams;
