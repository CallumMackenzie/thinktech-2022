
const API_ACCOUNT_ID = "c15bc852-9091-47ab-9488-098c2f1c1cd4";
const ACCESS_TOKEN = "eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQoAAAABAAUABwCAAHBLscraSAgAgGg0rbnK2kgCANaMfsZSxX9Em4TaO1BBvZgVAAEAAAAYAAIAAAAFAAAAHQAAAA0AJAAAAGM1MDMyMDg5LTk5NjgtNGQ2ZS05NTZiLWQxYTZiOWZmOTdlMyIAJAAAAGM1MDMyMDg5LTk5NjgtNGQ2ZS05NTZiLWQxYTZiOWZmOTdlMxIAAQAAAAYAAABqd3RfYnIjACQAAABjNTAzMjA4OS05OTY4LTRkNmUtOTU2Yi1kMWE2YjlmZjk3ZTM.trqwQffDU4AdffNeKwp9n_C5bOt17etGSUN7lvYMpyFuoZ-Hz2-cd9XzqVgPNk98KXARzh1kn7WjPMSc-MXgltMjTNpBWA9zNvIGKrFcfxa4HuBdiT92l5x9tIgntY3dPUcCqyQFL1RP2Io0-AlcK1v8WFqqa3g9BQ4ripVyrVArCzCM_0nC_4Yze6w-X_5p-QOn3JtmeCrQOKk93XVTRR7eLkWoT3qOuwQ1tjqlWlNFJhFjd2i19649dR7PkW5Uuh78bukD6qQDcG3H5ASSBEuH_wNOu-3PwBd1J_4RxAEMdK04GVgv6DyN9eS42IBBHgk6kSJ56-yf3nM7oqfMHA";
const BASE_PATH = "https://demo.docusign.net/restapi";

import { ApiClient, Envelope, EnvelopeFormData, EnvelopesApi } from "docusign-esign";

export class DocuSignWrapper {
	static instantiate = (): DocuSignWrapper =>
		new DocuSignWrapper(API_ACCOUNT_ID, ACCESS_TOKEN, BASE_PATH);

	private accountId: string;
	private accessToken: string;
	private basePath: string;
	private dsApiClient: ApiClient;
	private envelopesApi: EnvelopesApi;

	private constructor(accountId: string, accessToken: string, basePath: string) {
		this.accountId = accountId;
		this.accessToken = accessToken;
		this.basePath = basePath;

		this.dsApiClient = new ApiClient();
		this.dsApiClient.setBasePath(basePath);
		this.dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
		this.envelopesApi = new EnvelopesApi(this.dsApiClient);
	}

	async getEnvelope(envelopeId: string): Promise<Envelope> {
		return await this.envelopesApi.getEnvelope(this.accountId, envelopeId);
	}

	async getFormData(envelopeId: string): Promise<EnvelopeFormData> {
		return await this.envelopesApi.getFormData(this.accountId, envelopeId);
	}
}
