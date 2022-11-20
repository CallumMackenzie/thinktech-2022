
import { authorize } from "./src/security";
import * as docusign from "./src/docusign";

export async function handler(event: any, context: any, callback: any) {

	console.log(JSON.stringify(event));

	// Check request credentials and return request body if no error
	let securityResult = authorize(event);
	if (securityResult.isError()) return securityResult.result;
	let body = securityResult.result;

	console.log(body);
	let envelopeId = body.data.envelopeId;

	const ds = docusign.instantiate();
	let envelope = await ds.getEnvelope(envelopeId);

	console.log(envelope);

	// Retrieve the data -> DocuSign APIs
	// Collect into a structure -> JS
	// Pass it to the UIPath RPA running in an EC2 instance -> AWS APIs

	const response = {
		statusCode: 200,
		body: JSON.stringify('Hello from Lambda!'),
	};
	return response;
}

