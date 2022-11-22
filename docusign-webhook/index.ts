
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
	if (formResult.result === undefined)
		return Result.Err("Form result was undef", 500).result;
	const formData = formResult.result;
	console.log(JSON.stringify(formData));

	console.log("Retrieving DynamoDB perms");
	config.update({ region: "us-east-2" });
	const ddb = new DynamoDB({ apiVersion: '2012-08-10' });

	const convertedItem: DynamoDB.PutItemInputAttributeMap = {};
	Object.entries(formResult.result)
		.forEach(([k, v]) => {
			const attribValue: DynamoDB.AttributeValue = {
				S: (v instanceof String || typeof v === 'string') ? v.toString() : undefined,
				N: (v instanceof Number || typeof v === 'number') ? v.toString() : undefined,
				BOOL: (v instanceof Boolean || typeof v === 'boolean') ? v.valueOf() : undefined
			};
			convertedItem[k] = attribValue;
		});

	const params: DynamoDB.PutItemInput = {
		TableName: "thinktech-data",
		Item: convertedItem
	};

	console.log("Putting item: " + JSON.stringify(convertedItem));
	await ddb.putItem(params, (err: any, data: any) => {
		if (err) console.log("PutItem error: " + err);
		else console.log("Data updated: " + data);
	});
	console.log("Item request finished");

	const response = {
		statusCode: 200,
		body: JSON.stringify('Success'),
	};
	return response;
}

