
const API_ACCOUNT_ID = "c15bc852-9091-47ab-9488-098c2f1c1cd4";
const USER_ID = "c67e8cd6-c552-447f-9b84-da3b5041bd98";
const CLIENT_ID = "c5032089-9968-4d6e-956b-d1a6b9ff97e3";
const BASE_PATH = "https://demo.docusign.net/restapi";
const OAUTH_BASE_PATH = "account-d.docusign.com";

const RSA_PRIVATE = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAq4FObBcVKkPDln9yhaKxnImxye9FHA6Kfq9ttZhk4L/6OoPC
ovTlUm1CWx5FdJ9Vggv6oJjBgWBBWMOLGQ3pKnMsvheX6d9rZD5Mgs9ePcNnytq1
tCpJpoRr0r61s7XTv73XV2uZnfaegHDS7Pw4ylzJ9CGYa4gfu9OB/xKjx8V5PGX9
El/RfK5VR7tHvCLMCyZXId4TlTDVH+umfVVAtX4mOzoDe1xPx4NIgoXzd/QDzu1Q
QE8U6caMgPABzMhNxTiDFH2jIpr+1MtIB/7iVax+mGrpuiosqpRec11FveOiuqKE
5qoKy4rC1yyombpeKAa+iql0/JLP4AQcgnCZ0wIDAQABAoIBAA0QoilAzudz1xQB
bHd6r94VbTpNZG3hO7Kv6YMic1jdtxG7FNo2HrwbP6lSUocyViC8ieCvElqpOwEo
kFGdyivmLzvh7zwtPXCbAFgctPiuiJse8yWg7RBm2RHqXkws508dhqiNtVufvG5b
ae4MvsTHscjLwGE8svIriCUmxdxDcm0fKR6W2x+brpeiK6VSV7H4bqoHt4fwrS9A
PIwXLM8nbueKnVO3ME4i6db9Sh+QIBBfgAOW2L+oscqXiCKVL1wiZgsTwJHYe6SZ
Ci9bXg/AvrGfYEapwzLZj2dOdl03KO1Xm/fnvjM6tkTY7RXDVF3mQ2P16l3ENOcU
n8eVmYkCgYEA1afE3Odd45cfxu4x0brfu1YI45dV7kzkE8/n0ISN4hPhmT4Qn+O3
eR91N7b2VQYz7LH76o6ew0zMKNgU6m+hk3kBSpSpvJMipN+mSCx65x5Ek79LwvJu
l9laCaaiO7kVeqziB9b1Uj8KDzc64Q0P3Wh6MEw+9ky8J5ria7AZLRsCgYEAzX71
38BaUdzmqkeNCTiq0r+5C1Ke1SDolEuO1Q7D41GvHCfFldOpqE+kb7a11w/F51lE
V+vyS3w9naosJf9gAcl40gYOOHhkjyCrVJkO1+f2V3wtvrYxrdw9NySTKZ8y6IWB
3Q0N6WQ6ruDtjXf67JJknydZ8PlJ+G1BIXDRqakCgYEA03zGOYQsQ+SL5/ZQCjLY
1C9NjTt4K/KgsZvS82zCpU7YuT/eZOab7qFc/lF1dKQ3MczceEnEjb2vOZ7q1US6
w6e7x39wpOFgIaPgjQC6h5xGdZmd/NLM9jKIFZWEcWm8ATqwYuI847TS2EzrU2oC
kj+g874FdPhwJyQBjGc8BJECgYATVkoexwP4xheymE8OOhXhBQeNqDWoCpO4OK/1
HpGSV4Jp3Ng79BH3856eoIvV8/cEgSLsPxiqv8Mwje3fmXtYT7Qd11IJQFL+IO3e
ZRS/fmVw8A+B7bUZDit4f+mVNhTdSorg2TSg7LyU7jeMY2jqUBBF5bcR9PNf/C/v
zKT+GQKBgQCDjGjvYiU8QbnUy4Ewuy5eo7uC+TbwxsC+joBo7ddMogUVXtWHYOid
I6pIl/jP/yP4j156q6C3aR1OaS1OZ5HT3190fkWIGrYh8SdFFlMJ14b4bx2XSdSs
ydjQS7Vm4V3V3eGtta0ECrHXDwlluMZ67OlxxpyW4/WftbNrHBEU3g==
-----END RSA PRIVATE KEY-----`;

import {
	ApiClient,
	Envelope,
	EnvelopeFormData,
	EnvelopesApi,
	EnvelopeDefinition,
	UserInfo,
	RecipientViewRequest
} from "docusign-esign";
import { Result } from "./error";

const TOKEN_LIFETIME = 60 * 15; // 15 minutes
const TOKEN_REFRESH_TIME = 60 * 5; // 5 minutes

class TokenManager {
	private static token: string | undefined;
	private static tokenExpiry: number | undefined;

	static async getToken(dsApiClient: ApiClient, perms: string[]): Promise<Result<string>> {
		if (this.tokenExpiry === undefined ||
			this.token === undefined ||
			Date.now() > this.tokenExpiry - TOKEN_REFRESH_TIME) {
			const responseObj = await dsApiClient.requestJWTUserToken(
				CLIENT_ID,
				USER_ID,
				perms,
				Buffer.from(RSA_PRIVATE, "utf-8"),
				TOKEN_LIFETIME
			);
			let responseText = responseObj["text"];
			if (responseText === undefined)
				return Result.Err("Raw response text was undefined: "
					+ JSON.stringify(responseObj), 500);
			let response = JSON.parse(responseText);
			let accessToken = response["access_token"];
			let expiresIn = response["expires_in"];

			if (accessToken === undefined || expiresIn === undefined)
				return Result.Err("Access token could not be resolved: "
					+ JSON.stringify(response), 500);
			if (expiresIn! instanceof Number)
				return Result.Err("Expiry time not a number: "
					+ JSON.stringify(response), 500);

			this.tokenExpiry = Date.now() + expiresIn;
			this.token = accessToken as string;
			return Result.Ok(this.token);
		} else return Result.Ok(this.token);
	}
};

export class DocuSignWrapper {

	static instantiate = (permissions: string[]): DocuSignWrapper =>
		new DocuSignWrapper(API_ACCOUNT_ID, BASE_PATH, permissions);

	private accountId: string;
	private dsApiClient: ApiClient;
	private envelopesApi: EnvelopesApi;
	private permissions: string[];

	private constructor(accountId: string, basePath: string, permissions: string[]) {
		this.accountId = accountId;
		this.permissions = permissions;

		this.dsApiClient = new ApiClient();
		this.dsApiClient.setBasePath(basePath);
		this.dsApiClient.setOAuthBasePath(OAUTH_BASE_PATH);
		this.envelopesApi = new EnvelopesApi(this.dsApiClient);
	}

	private async refreshAccessToken(): Promise<Result<string>> {
		const tokenResult = await TokenManager.getToken(this.dsApiClient, this.permissions);
		if (tokenResult.isError()) return tokenResult;
		const token = tokenResult.result;
		this.dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + token);
		return Result.Ok(token);
	}

	async signEnvelopeEmbedded(
		envelopeDef: EnvelopeDefinition,
		hostEmail: string,
		hostUsername: string,
		returnUrl: string): Promise<Result<string>> {
		const result = await this.refreshAccessToken();
		if (result.isError()) return result;
		if (envelopeDef.sender === undefined)
			envelopeDef.sender = await
				this.dsApiClient.getUserInfo(result.result as string) as UserInfo;

		const envSummary = await this.envelopesApi.createEnvelope(this.accountId, {
			envelopeDefinition: envelopeDef
		});
		if (envSummary === undefined
			|| envSummary.status === undefined
			|| envSummary.envelopeId === undefined
			|| envSummary.status == "declined")
			return Result.Err("Could not create envelope: " + JSON.stringify(envSummary),
				500);

		const envelopeId = envSummary.envelopeId;
		console.log("ENVELOPE ID: " + envelopeId);

		let recipientViewRequest: RecipientViewRequest = {
			authenticationMethod: "none",
			email: hostEmail,
			userName: hostUsername,
			returnUrl
		};

		const viewURL = await this.envelopesApi.createRecipientView(this.accountId, envelopeId,
			{ recipientViewRequest });
		if (viewURL === undefined
			|| viewURL.url === undefined) return Result.Err("Could not create view url", 500);

		return Result.Ok(viewURL.url);
	}

	async getEnvelope(envelopeId: string): Promise<Result<Envelope>> {
		const result = await this.refreshAccessToken();
		if (result.isError()) return result as Result;

		let envelope = await this.envelopesApi.getEnvelope(this.accountId, envelopeId);
		return Result.Ok(envelope);
	}

	async getFormData(envelopeId: string): Promise<Result<EnvelopeFormData>> {
		const result = await this.refreshAccessToken();
		if (result.isError()) return result as Result;

		let formData = await this.envelopesApi.getFormData(this.accountId, envelopeId);
		return Result.Ok(formData);
	}
}
