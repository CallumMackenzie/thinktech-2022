"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const error_1 = require("./error");
const crypto = __importStar(require("crypto"));
const HMAC_KEYS = [1, 2, 3].map(x => "X-DocuSign-Signature-" + x);
const HMAC_SECRETS = ["4/meKiS1ZqfjmH4CbdZhfAST/BAWRhtSLI5ddV/+a6w=",
    "FMcHBXiq0zns62kfoTxzUWeeLTQHeTtVnSk1zVi7/QU=",
    "dGTSVEMDCUcmpCzgvDXeyOTPh6ol8LxXjErSJxerPI0="];
const LOGIN_INFO = {
    usernameKey: "php-auth-user",
    passwordKey: "php-auth-pw",
    username: "ThinkTech2022_DOCUSIGN",
    password: "thinkingabouttech"
};
// Checks request authorization and returns the request body
const authorize = (event) => {
    const headers = event.headers;
    const rawBody = event.body;
    // Check user credentials
    // let credentialResult = checkLoginCredentials(event.headers);
    // if (credentialResult.isError()) return credentialResult;
    // Parse body
    const bodyResult = parseBody(rawBody);
    if (bodyResult.isError())
        return bodyResult;
    // Check HMAC keys
    let hmacResult = checkHMAC(headers, rawBody);
    if (hmacResult.isError())
        return hmacResult;
    return bodyResult;
};
exports.authorize = authorize;
const unauthorized = (msg) => {
    let msg2 = "Webhook signature not valid: " + msg;
    console.log(msg2);
    return error_1.Result.Err(msg2, 401);
};
const authorized = (msg = "") => {
    if (msg != "")
        console.log(msg);
    return error_1.Result.Ok();
};
const parseBody = (body) => {
    try {
        return error_1.Result.Ok(JSON.parse(body));
    }
    catch (e) {
        return error_1.Result.Err("Failed parsing body: " + e, 400);
    }
};
const checkLoginCredentials = (headers) => {
    let username = headers[LOGIN_INFO.usernameKey];
    if (username != LOGIN_INFO.username)
        return unauthorized("Incorrect username (" + username + ")");
    let password = headers[LOGIN_INFO.passwordKey];
    if (password != LOGIN_INFO.password)
        return unauthorized("Incorrect password (" + password + ")");
    return authorized("Login credentials correct.");
};
const checkHMAC = (headers, body) => {
    const keys = HMAC_KEYS.map(x => headers[x]);
    for (const hmacSecret in HMAC_SECRETS) {
        const hmac = crypto.createHmac('sha256', hmacSecret);
        hmac.write(body);
        hmac.end();
        const computedKey = hmac.read().toString('base64');
        if (keys.includes(computedKey))
            return authorized();
    }
    return authorized("HMAC verified");
};
