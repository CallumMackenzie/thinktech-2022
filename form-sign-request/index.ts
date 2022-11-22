
import { Result } from "common/error";
import { DocuSignWrapper } from "common/docusign";
import {
	EnvelopeDefinition,
} from "docusign-esign";

const ACCESS_TOKEN = "thinktech2022";
const FORM_TEMPLATE_ID = "eeaf485c-8fd0-47ad-8045-52669426677d";
const HOST_EMAIL = "alexxander1611@gmail.com";
const HOST_NAME = "Callum Mackenzie";

export async function handler(event: any) {

	console.log(event);
	Result.setPropFilter((props) => {
		return {
			"statusCode": props.statusCode,
			"headers": {
				"Access-Control-Allow-Headers": "Content-Type",
				"Access-Control-Allow-Origin": "https://www.camackenzie.com",
				"Access-Control-Allow-Methods": "POST,GET"
			}
		};
	});
	if (event.httpMethod == "OPTIONS") // CORS
		return Result.Err("CORS", 200).result;

	if (JSON.parse(event.body)?.token != ACCESS_TOKEN)
		return Result.Err("Incorrect access token", 401).result;

	console.log("Correct token");
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
		headers: {
			"Access-Control-Allow-Headers": "Content-Type",
			"Access-Control-Allow-Origin": "https://www.camackenzie.com",
			"Access-Control-Allow-Methods": "POST,GET"
		},
	};
}

