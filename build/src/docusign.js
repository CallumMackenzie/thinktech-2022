"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.instantiate = void 0;
const ACCOUNT_ID = "2bd00cc8-ca4a-40a1-b7d8-e7389f70e87e";
const ACCESS_TOKEN = "ba6b27e7-6ffc-4359-b8ac-9cb88a64c26f";
const BASE_PATH = "https://ca.docusign.net";
const docusign_esign_1 = require("docusign-esign");
class DocuSignWrapper {
    constructor(accountId, accessToken, basePath) {
        this.accountId = accountId;
        this.accessToken = accessToken;
        this.basePath = basePath;
        this.dsApiClient = new docusign_esign_1.ApiClient();
        this.dsApiClient.setBasePath(basePath);
        this.dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
    }
    getEnvelope(envelopeId) {
        return __awaiter(this, void 0, void 0, function* () {
            let envelopesApi = new docusign_esign_1.EnvelopesApi(this.dsApiClient);
            return yield envelopesApi.getEnvelope(this.accountId, envelopeId, null);
        });
    }
}
const instantiate = () => new DocuSignWrapper(ACCOUNT_ID, ACCESS_TOKEN, BASE_PATH);
exports.instantiate = instantiate;
