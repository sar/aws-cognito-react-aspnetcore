import React, { useEffect, useState } from 'react';
import { withAuthenticator, AmplifySignOut, AmplifyAuthenticator, AmplifySignUp } from '@aws-amplify/ui-react';
import './App.css';
import axios from 'axios';
import { Auth } from 'aws-amplify';

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
			const x = await Auth.currentSession();
			const accessToken = x.getAccessToken();
			const jwtToken = accessToken.getJwtToken();

			try {
				const headers = { 'Authorization': `Bearer ${jwtToken}` };
				console.log('GET headers', { headers }, {jwtToken});

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
