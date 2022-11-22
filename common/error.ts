
enum ResultType {
	Ok,
	Error
};

export interface DefaultResultProps {
	statusCode: Number,
	message: string
}

export class Result<Type = any> {
	private static propFilter: (arg0: DefaultResultProps) => any =
		(a) => { statusCode: a.statusCode };
	static setPropFilter(filter: (arg0: DefaultResultProps) => any) {
		this.propFilter = filter
	}

	static Ok = <Type>(result: Type | undefined = undefined): Result<Type> =>
		new Result(ResultType.Ok, result, "");
	static Err = (message: string, code: Number): Result<any> =>
		new Result(ResultType.Error, this.propFilter({
			statusCode: code,
			message: message
		}), message);

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
