
import { authorize } from "./src/security";
import { DocuSignWrapper } from "./src/docusign";
import { VaccinationFormData } from "./src/form";

export async function handler(event: any, context: any, callback: any) {

	console.log(JSON.stringify(event));

	// Check request credentials and return request body if no error
	let securityResult = authorize(event);
	if (securityResult.isError()) return securityResult.result;
	let body = securityResult.result;

	let envelopeId = body.data.envelopeId;
	const docusign = DocuSignWrapper.instantiate();

	let formResult = await VaccinationFormData.fromFormData(docusign, envelopeId);
	if (formResult.isError()) return formResult;
	const formData = formResult.result;

	console.log(JSON.stringify(formData));


	// Retrieve the data -> DocuSign APIs
	// Collect into a structure -> JS
	// Pass it to the UIPath RPA running in an EC2 instance -> AWS APIs

	const response = {
		statusCode: 200,
		body: JSON.stringify('Hello from Lambda!'),
	};
	return response;
}

