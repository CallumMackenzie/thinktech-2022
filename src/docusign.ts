
const ACCOUNT_ID = "c15bc852-9091-47ab-9488-098c2f1c1cd4";
const ACCESS_TOKEN = "c5032089-9968-4d6e-956b-d1a6b9ff97e3";
const BASE_PATH = "https://demo.docusign.net";

import { ApiClient, EnvelopesApi } from "docusign-esign";

class DocuSignWrapper {
	accountId: string;
	accessToken: string;
	basePath: string;
	dsApiClient: ApiClient;

	constructor(accountId: string, accessToken: string, basePath: string) {
		this.accountId = accountId;
		this.accessToken = accessToken;
		this.basePath = basePath;

		this.dsApiClient = new ApiClient();
		this.dsApiClient.setBasePath(basePath);
		this.dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
	}

	async getEnvelope(envelopeId: string) {
		let envelopesApi = new EnvelopesApi(this.dsApiClient);
		return await envelopesApi.getEnvelope(this.accountId, envelopeId, null);
	}
}

export const instantiate = () =>
	new DocuSignWrapper(ACCOUNT_ID, ACCESS_TOKEN, BASE_PATH);
