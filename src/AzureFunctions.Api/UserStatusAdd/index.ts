/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an orchestrator function.
 * 
 * Before running this sample, please:
 * - create a Durable orchestration function
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *   function app in Kudu
 */

import { AzureFunction, Context, HttpRequest } from "@azure/functions"

import * as df from "durable-functions"
import { IResponse } from '../Models/IResponse';
import { OkResponse } from '../Models/OkResponse';

const entityFunction: AzureFunction = async function (context: Context, req: HttpRequest): Promise<IResponse> {
	const userId = (req.query.name || (req.body && req.body.name)) || "myCounter";
	const amount = (req.query.amount || (req.body && req.body.amount)) || 1;

	const client = df.getClient(context);
	const entityId = new df.EntityId("UserStatusAggregator", userId);
	const x = await client.signalEntity(entityId, "add", amount);

	// const stateResponse = await client.readEntityState<number>(entityId);
	// return new OkResponse(stateResponse.entityState.toString());
	return new OkResponse({});
};

export default entityFunction;
