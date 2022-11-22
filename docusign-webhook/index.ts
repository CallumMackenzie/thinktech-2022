
import { authorize } from "./security";
import { DocuSignWrapper } from "common/docusign";
import { VaccinationFormData } from "./form";
import { DynamoDB, config } from "aws-sdk";
import { Result } from "common/error";

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
	const formData = formResult.result;

	config.update({ region: "us-east-2" });
	const ddb = new DynamoDB({ apiVersion: '2012-08-10' });

	const params = {
		TableName: "thinktech-data",
		Item: formResult.result
	};

	ddb.putItem(params, (err: any, data: any) => {
		if (err) return Result.Err(err, 500).result
		console.log("Data updated: " + data);
	});

	console.log(JSON.stringify(formData));

	// Retrieve the data -> DocuSign APIs
	// Collect into a structure -> JS
	// Pass it to the UIPath RPA running in an EC2 instance -> AWS APIs

	const response = {
		statusCode: 200,
		body: JSON.stringify('Success'),
	};
	return response;
}

