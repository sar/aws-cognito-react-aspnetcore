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

import { AzureFunction, Context } from "@azure/functions"
import * as df from "durable-functions"
import { IResponse } from '../Models/IResponse';
import { OkResponse } from '../Models/OkResponse';

const entityFunction: AzureFunction = async function (context: Context): Promise<IResponse> {
	context.log(`Timer trigger @ ${context.bindingData.timerTrigger}`);

	// you can get the timer based on the object name specified in bindings (function.json)
	const timer = context.bindings.myTimer;

	const client = df.getClient(context);

	var today = new Date();
	today.setHours(0, 0, 0, 0);

	const createdTimeFrom = new Date(0);

	const createdTimeTo = new Date(new Date().setDate(today.getDate() - 30));
	createdTimeTo.setDate(createdTimeTo.getDate() - 0);

	const runtimeStatuses = [df.OrchestrationRuntimeStatus.Completed];
	const purgeResult = await client.purgeInstanceHistoryBy(createdTimeFrom, createdTimeTo, runtimeStatuses);
	context.log(`Deleted ${purgeResult.instancesDeleted} instances`);
	return new OkResponse(purgeResult);
};

export default entityFunction;
