import React, { useEffect, useState } from 'react';
import { withAuthenticator, AmplifySignOut, AmplifyAuthenticator, AmplifySignUp } from '@aws-amplify/ui-react';
import './App.css';
import axios from 'axios';

type WeatherForecast = {
	date: Date,
	temperatureC: number,
	temperatureF: number,
	summary: string
};

function App() {
	const [obj, setObj] = useState<WeatherForecast[] | undefined>(undefined);

	useEffect(() => {
		const wf = axios.get<WeatherForecast[]>('https://localhost:5001/WeatherForecast');
		wf.then(x => setObj(x.data));
	}, []);


	return (
		<>
			<AmplifyAuthenticator>
				<AmplifySignUp
					slot="sign-up"
					usernameAlias="email"
					formFields={[
						{
							type: "email",
							label: "Email",
							placeholder: "Type here your email",
							required: true,
						},
						{
							type: "password",
							label: "Password",
							placeholder: "Type here your password",
							required: true,
						},
						// {
						// 	type: "phone_number",
						// 	label: "Custom Phone Label",
						// 	placeholder: "custom Phone placeholder",
						// 	required: true,
						// },
						{
							type: "name",
							label: "Your fullname",
							placeholder: "Type here your fullname",
							required: true,
						},
					]}
				/>

				<AmplifySignOut />

				<div className="App">
					{obj?.map(o => (
						<>
							<p>
								Date: {new Date(o.date).toLocaleDateString()},
								C: {o.temperatureC},
								F: {o.temperatureF},
								Summary: {o.summary}
							</p>
						</>
					))}
				</div>
			</AmplifyAuthenticator>
		</>
	);
}

export default App;
