
import { authorize } from "./security";
import { DocuSignWrapper } from "common/docusign";
import { VaccinationFormData } from "./form";
import { Result } from "common/error";
import { initDynamoDB, putItemInTable } from "./dynamodb";

export async function handler(event: any, context: any, callback: any) {

	console.log(JSON.stringify(event));

	// Check request credentials and return request body if no error
	let securityResult = authorize(event);
	if (securityResult.isError()) return securityResult.result;
	let body = securityResult.result;

	let envelopeId = body.data.envelopeId;
	const docusign = DocuSignWrapper.instantiate(["signature", "impersonate"]);

	let formResult = await VaccinationFormData.fromFormData(docusign, envelopeId);
	if (formResult.isError()) return formResult.result;
	if (formResult.result === undefined)
		return Result.Err("Form result was undef", 500).result;

	const formData = formResult.result;
	console.log(JSON.stringify(formData));

	const ddb = initDynamoDB("us-east-2");
	putItemInTable(ddb, "thinktech-data", formData);

	const response = {
		statusCode: 200,
		body: JSON.stringify('Success'),
	};
	return response;
}

