
import { Result } from "common/error";
import { DocuSignWrapper } from "common/docusign";
import { EnvelopeDefinition } from "docusign-esign";
import { DynamoDB, config as awsConfig } from "aws-sdk";

const ACCESS_TOKEN = "thinktech2022";
const FORM_TEMPLATE_ID = "eeaf485c-8fd0-47ad-8045-52669426677d";
const HOST_EMAIL = "alexxander1611@gmail.com";
const HOST_NAME = "Callum Mackenzie";
const CORS_HEADERS = {
	"Access-Control-Allow-Headers": "Content-Type",
	"Access-Control-Allow-Origin": "https://www.camackenzie.com",
	"Access-Control-Allow-Methods": "POST"
};

export async function handler(event: any) {
	console.log(event);
	Result.setPropFilter((props) => {
		return {
			"statusCode": props.statusCode,
			"headers": CORS_HEADERS
		};
	});

	if (event.httpMethod == "OPTIONS") // CORS
		return Result.Err("CORS", 200).result;


	let parsedBody = JSON.parse(event.body);

	if (parsedBody?.token != ACCESS_TOKEN)
		return Result.Err("Incorrect access token", 401).result;
	console.log("Correct token");

	switch (parsedBody?.type) {
		case "link":
			return post(event);
		case "data":
			return get(event);
		default:
			return Result.Err("Not a valid request", 400);
	}
}

const get = async (event: any) => {
	awsConfig.update({ region: "us-east-2" });
	const ddb = new DynamoDB({ apiVersion: "2012-08-10" });

	const result = await ddb.scan({
		TableName: "thinktech-data",
	}).promise();
	console.log(JSON.stringify(result));

	return {
		statusCode: 200,
		body: JSON.stringify({ items: result.Items }),
		headers: CORS_HEADERS
	};
};

const post = async (event: any) => {
	const docusign = DocuSignWrapper.instantiate(["signature", "impersonate"]);
	console.log("Docusign instantiated");

	const envelopeDef: EnvelopeDefinition = {
		templateId: FORM_TEMPLATE_ID,
		status: "sent",
		templateRoles: [{ roleName: "Vaccinated" }, { roleName: "Nurse" }]
	};

	const urlResult = await docusign.signEnvelopeEmbedded(envelopeDef,
		"callum.alex.mackenzie@gmail.com", HOST_NAME,
		"https://www.camackenzie.com/thinktech2022-docusign-fwd-frontend/");
	if (urlResult.isError()) return urlResult.result;

	console.log(urlResult.result);

	return {
		statusCode: 200,
		body: JSON.stringify({ url: urlResult.result }),
		headers: CORS_HEADERS
	};
};
