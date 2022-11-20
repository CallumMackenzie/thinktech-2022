
export const Result = {
	Ok: <Type>(result: Type | undefined = undefined) =>
		new InternalResult(ResultType.Ok, result, ""),
	Err: (message: string, code: Number) =>
		new InternalResult(ResultType.Error, { statusCode: code }, message)
};

enum ResultType {
	Ok,
	Error
};

class InternalResult<Type> {
	type: ResultType;
	result: Type | undefined;
	message: string;

	constructor(type: ResultType, result: Type | undefined, message: string) {
		this.type = type;
		this.result = result;
		this.message = message;
	}

	isOk() { return this.type == ResultType.Ok; }
	isError() { return this.type == ResultType.Error; }
}
