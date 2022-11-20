
const ACCOUNT_ID = "2bd00cc8-ca4a-40a1-b7d8-e7389f70e87e";
const ACCESS_TOKEN = "ba6b27e7-6ffc-4359-b8ac-9cb88a64c26f";
const BASE_PATH = "https://ca.docusign.net";

import { ApiClient, EnvelopesApi } from "docusign-esign";

class DocuSignWrapper {
	accountId: String;
	accessToken: String;
	basePath: String;
	dsApiClient: ApiClient;

	constructor(accountId: String, accessToken: String, basePath: String) {
		this.accountId = accountId;
		this.accessToken = accessToken;
		this.basePath = basePath;

		this.dsApiClient = new ApiClient();
		this.dsApiClient.setBasePath(basePath);
		this.dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
	}

	async getEnvelope(envelopeId: String) {
		let envelopesApi = new EnvelopesApi(this.dsApiClient);
		return await envelopesApi.getEnvelope(this.accountId, envelopeId, null);
	}
}

export const instantiate = () =>
	new DocuSignWrapper(ACCOUNT_ID, ACCESS_TOKEN, BASE_PATH);
