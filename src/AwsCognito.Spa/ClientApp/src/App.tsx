import React, { useEffect, useState } from 'react';
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
	);
}

export default App;
