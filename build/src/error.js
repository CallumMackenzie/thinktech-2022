"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = void 0;
exports.Result = {
    Ok: (result = undefined) => new InternalResult(ResultType.Ok, result, ""),
    Err: (message, code) => new InternalResult(ResultType.Error, { statusCode: code }, message)
};
var ResultType;
(function (ResultType) {
    ResultType[ResultType["Ok"] = 0] = "Ok";
    ResultType[ResultType["Error"] = 1] = "Error";
})(ResultType || (ResultType = {}));
;
class InternalResult {
    constructor(type, result, message) {
        this.type = type;
        this.result = result;
        this.message = message;
    }
    isOk() { return this.type == ResultType.Ok; }
    isError() { return this.type == ResultType.Error; }
}
