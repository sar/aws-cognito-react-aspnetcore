import { AzureFunction, Context, HttpRequest } from "@azure/functions"

import * as df from "durable-functions"
import { IResponse } from '../Models/IResponse';
import { OkResponse } from '../Models/OkResponse';

const entityFunction: AzureFunction = async function (context: Context, req: HttpRequest): Promise<IResponse> {
	const userId = (req.query.name || (req.body && req.body.name)) || "myCounter";

	const client = df.getClient(context);
	const entityId = new df.EntityId("UserStatusAggregator", userId);

	const stateResponse = await client.readEntityState<number>(entityId);
	return new OkResponse(stateResponse.entityState.toString());
};

export default entityFunction;
