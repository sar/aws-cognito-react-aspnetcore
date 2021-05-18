/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an HTTP starter function.
 * 
 * Before running this sample, please:
 * - create a Durable activity function (default name is "Hello")
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your 
 *    function app in Kudu
 * 
 * Be aware of "Orchestrator function code constraints".
 * See: https://docs.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-code-constraints
 */

import * as df from "durable-functions"

const orchestrator = df.orchestrator(function* (context) {
    const outputs = [];

    // Replace "Hello" with the name of your Durable Activity Function.
    outputs.push(yield context.df.callActivity("UserTracker", "Tokyo"));
	outputs.push(yield context.df.callActivity("UserTracker", "Seattle"));
	outputs.push(yield context.df.callActivity("UserTracker", "London"));

    // returns ["Hello Tokyo!", "Hello Seattle!", "Hello London!"]
    return outputs;
});

export default orchestrator;
