
export const Result = {
	Ok: <Type>(result: Type | undefined = undefined) =>
		new InternalResult(ResultType.Ok, result, ""),
	Err: (message: String, code: Number) =>
		new InternalResult(ResultType.Error, { statusCode: code }, message)
};

enum ResultType {
	Ok,
	Error
};

class InternalResult<Type> {
	type: ResultType;
	result: Type | undefined;
	message: String;

	constructor(type: ResultType, result: Type | undefined, message: String) {
		this.type = type;
		this.result = result;
		this.message = message;
	}

	isOk() { return this.type == ResultType.Ok; }
	isError() { return this.type == ResultType.Error; }
}
