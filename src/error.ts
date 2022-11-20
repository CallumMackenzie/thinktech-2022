
enum ResultType {
	Ok,
	Error
};

export class Result<Type = any> {
	static Ok = <Type>(result: Type | undefined = undefined): Result<Type> =>
		new Result(ResultType.Ok, result, "");
	static Err = (message: string, code: Number): Result<any> =>
		new Result(ResultType.Error, { statusCode: code }, message);

	type: ResultType;
	result: Type | undefined;
	message: string;

	private constructor(type: ResultType, result: Type | undefined, message: string) {
		this.type = type;
		this.result = result;
		this.message = message;
	}

	isOk(): boolean { return this.type == ResultType.Ok; }
	isError(): boolean { return this.type == ResultType.Error; }
}
