import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { ControllerFactory } from '../Controllers/ControllerFactory';
import { BadRequestResponse } from '../Models/BadRequestResponse';
import { IPatient } from '../Models/IPatient';
import { IResponse } from '../Models/IResponse';
import { NotFoundResponse } from '../Models/NotFoundResponse';
import { OkResponse } from '../Models/OkResponse';

const controllerFactory = new ControllerFactory();

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
	context.log('HTTP trigger function processed a request.');

	const controller = await controllerFactory.createPatientController(context.traceContext, req);
	context.res = await controller.findPatient(req);

	// const name = (req.query.name || (req.body && req.body.name));
	// const responseMessage = name
	//     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
	//     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

	// context.res = {
	//     // status: 200, /* Defaults to 200 */
	//     body: responseMessage
	// };
};

export default httpTrigger;
