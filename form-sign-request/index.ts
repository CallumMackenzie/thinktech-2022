
export async function handler(event: any, context: any, callback: any) {
	const response = {
		statusCode: 200,
		body: JSON.stringify('Hello from Lambda!'),
	};
	return response;
}

