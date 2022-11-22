
import { Result } from "common/error";
import { DocuSignWrapper } from "common/docusign";
import {
	EnvelopeDefinition,
	InPersonSigner
} from "docusign-esign";

const ACCESS_TOKEN = "thinktech2022";
const FORM_TEMPLATE_ID = "eeaf485c-8fd0-47ad-8045-52669426677d";
const HOST_EMAIL = "alexxander1611@gmail.com";
const HOST_NAME = "Callum Mackenzie";

export async function handler(event: any) {

	if (event["token"] != ACCESS_TOKEN)
		return Result.Err("Incorrect access token", 401);

	console.log("Correct token");
	const docusign = DocuSignWrapper.instantiate(["signature", "impersonate"]);
	console.log("Docusign instantiated");

	// const vaccinatedSigner: InPersonSigner = {
	// 	hostEmail: HOST_EMAIL,
	// 	hostName: HOST_NAME,
	// 	signerName: "vaccinated",
	// 	recipientId: "1",
	// 	routingOrder: "1"
	// };
	// const nurseSigner: InPersonSigner = {
	// 	hostEmail: HOST_EMAIL,
	// 	hostName: HOST_NAME,
	// 	signerName: "nurse",
	// 	recipientId: "2",
	// 	routingOrder: "2"
	// };
	const envelopeDef: EnvelopeDefinition = {
		templateId: FORM_TEMPLATE_ID,
		status: "sent",
		// recipients: {
		// 	inPersonSigners: [vaccinatedSigner, nurseSigner]
		// }
	};

	const urlResult = await docusign.signEnvelopeEmbedded(envelopeDef);
	if (urlResult.isError()) return urlResult;

	return {
		statusCode: 200,
		body: JSON.stringify({ url: urlResult.result }),
	};
}

