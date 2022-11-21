
import { Result } from "common/error";
import * as crypto from "crypto";

const HMAC_KEYS = [1, 2, 3].map(x => "X-DocuSign-Signature-" + x);
const HMAC_SECRETS = ["Fk0c8bUCYNMmTPzm5VursbW2JIO7wzIbzcrCUxSld5M=",
	"/82AVIwrG/94HpPWfaMJCQuMKPZVBzJitEr5xXixV4U=",
	"eOCJZD1W0FEoJvuw5B1djfCwInBDa2CjM+uNnxns2sE="];

const LOGIN_INFO = {
	usernameKey: "php-auth-user",
	passwordKey: "php-auth-pw",
	username: "ThinkTech2022_DOCUSIGN",
	password: "thinkingabouttech"
};

// Checks request authorization and returns the request body
export const authorize = (event: any): Result => {
	const headers = event.headers;
	const rawBody = event.body;

	// Check user credentials
	// let credentialResult = checkLoginCredentials(event.headers);
	// if (credentialResult.isError()) return credentialResult;

	// Parse body
	const bodyResult = parseBody(rawBody);
	if (bodyResult.isError()) return bodyResult;

	// Check HMAC keys
	let hmacResult = checkHMAC(headers, rawBody);
	if (hmacResult.isError()) return hmacResult;

	return bodyResult;
};

const unauthorized = (msg: string): Result => {
	let msg2 = "Webhook signature not valid: " + msg;
	console.log(msg2);
	return Result.Err(msg2, 401);
};

const authorized = (msg: string = ""): Result => {
	if (msg != "")
		console.log(msg);
	return Result.Ok();
};

const parseBody = (body: any): Result => {
	try {
		return Result.Ok(JSON.parse(body));
	} catch (e) {
		return Result.Err("Failed parsing body: " + e, 400);
	}
};

const checkLoginCredentials = (headers: any): Result => {
	let username = headers[LOGIN_INFO.usernameKey];
	if (username != LOGIN_INFO.username)
		return unauthorized("Incorrect username (" + username + ")");

	let password = headers[LOGIN_INFO.passwordKey];
	if (password != LOGIN_INFO.password)
		return unauthorized("Incorrect password (" + password + ")");

	return authorized("Login credentials correct.");
};

const checkHMAC = (headers: any, body: any): Result => {
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

