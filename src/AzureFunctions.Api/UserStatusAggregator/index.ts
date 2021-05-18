/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an HTTP starter function.
 * 
 * Before running this sample, please:
 * - create a Durable activity function (default name is "Hello")
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your 
 *    function app in Kudu
 */

import * as df from "durable-functions"

const aggregator = df.entity(function(context) {
	const currentValue = context.df.getState(() => 0) as number;
	switch (context.df.operationName) {
		case "add":
			const amount = context.df.getInput() as number;
			const nextValue = currentValue + amount;
			context.df.setState(nextValue);
			context.df.return(nextValue);
			break;
		case "reset":
			context.df.setState(0);
			break;
		case "get":
			context.df.return(currentValue);
			break;
	}
});

export default aggregator;
