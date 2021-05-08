import React, { useEffect, useState } from 'react';
import { withAuthenticator, AmplifySignOut, AmplifyAuthenticator, AmplifySignUp } from '@aws-amplify/ui-react';
import './App.css';
import axios from 'axios';
import { Auth } from 'aws-amplify';
import {handler} from './jwt';
import awsmobile from './aws-exports';

type WeatherForecast = {
	date: Date,
	temperatureC: number,
	temperatureF: number,
	summary: string
};

function Weather() {
	const [obj, setObj] = useState<WeatherForecast[] | undefined>(undefined);

	// useEffect(() => {
	// 	async function fetchData() {
	// 		// You can await here
	// 		const response = await MyAPI.getData(someId);
	// 		// ...
	// 	}
	// 	fetchData();
	// }, [someId]); // Or [] if effect doesn't need props or state

	useEffect(() => {
		const source = axios.CancelToken.source();

		async function fetchData() {
			const session = await Auth.currentSession();
			const idToken = session.getIdToken();
			console.log('IdToken', { idToken });
			const jwtToken = idToken.getJwtToken();

			const headers = { 'Authorization': `Bearer ${jwtToken}` };
			console.log('GET headers', { headers }, {jwtToken});

			// Validate the jwtToken is valid
			const jwtValidationResult = await handler({ token: jwtToken});
			console.log('Jwt validation result', { jwtValidationResult});
			console.log('Is JwtToken valid', { isValid: jwtValidationResult.isValid });

			// Fetch info about the user (and validate the token) - not working: invalid_token: Access token does not contain openid scope
			const cognitoUserPoolDomain = awsmobile.oauth.domain;
			const userInfoUrl = `https://${cognitoUserPoolDomain}/oauth2/userInfo`;
			const userInfo = await axios.get(userInfoUrl, {
				cancelToken: source.token,
				headers
			});
			console.log('UserInfo from token', { userInfo});

			try {
				const response = await axios.get<WeatherForecast[]>('https://localhost:5001/WeatherForecast', {
					cancelToken: source.token,
					headers
				});
				setObj(response.data);
			} catch (ex) {
				console.log('GET Error', { ex });
			}
		}

		fetchData();

		return () => {
			source.cancel('Component got unmounted');
		};
	}, []);

	return (
		<div>
			{obj?.map((o, index) => (
					<p key={index}>
						Date: {new Date(o.date).toLocaleDateString()},
								C: {o.temperatureC},
								F: {o.temperatureF},
								Summaryx: {o.summary}
					</p>
			))}
		</div>
	);
}

export default Weather;
