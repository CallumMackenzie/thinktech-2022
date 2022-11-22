import { DynamoDB, config } from "aws-sdk";

const makeObjectDynamoDBCompatible = (obj: any): DynamoDB.AttributeMap => {
	const convertedItem: DynamoDB.AttributeMap = {};
	Object.entries(obj)
		.forEach(([k, v]) => {
			let av: DynamoDB.AttributeValue | undefined;

			if (v instanceof String || typeof v === 'string')
				av = { S: v.toString() };
			else if (v instanceof Number || typeof v === 'number')
				av = { N: v.toString() };
			else if (v instanceof Boolean || typeof v === 'boolean')
				av = { BOOL: v.valueOf() };
			else if (v instanceof Map)
				av = { M: makeObjectDynamoDBCompatible(v) };

			if (av !== undefined)
				convertedItem[k] = av;
		});
	return convertedItem;
};

export const initDynamoDB = (region: string): DynamoDB => {
	config.update({ region });
	return new DynamoDB({ apiVersion: '2012-08-10' });
};

export const putItemInTable = async (ddb: DynamoDB, table: string, item: any) => {
	const params: DynamoDB.PutItemInput = {
		TableName: table,
		Item: makeObjectDynamoDBCompatible(item)
	};

	await ddb.putItem(params, (err: any, data: any) => {
		if (err) console.log("PutItem error: " + err);
		else console.log("Data updated: " + data);
	}).promise();
	console.log("Item request finished");
};