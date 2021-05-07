import React, { useEffect, useState } from 'react';
import { CognitoUserInterface } from '@aws-amplify/ui-components';
import { withAuthenticator, AmplifySignOut, AmplifyAuthenticator, AmplifySignUp } from '@aws-amplify/ui-react';
import { FormFieldTypes, AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import './App.css';
import Weather from './Weather';

const signUpFields: FormFieldTypes | string[] | undefined =
	[
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
	];

/*
 * Custom attributes type defined according to the attributes used in this app
 * ref: https://github.com/aws-amplify/amplify-js/issues/4927
 */
export interface UserAttributes {
	sub: string;
	email: string;
	email_verified: string;
	name: string;
	// updated_at: string;
	// 'custom:bytesQuota': string;
	// 'custom:bytesUsed': string;
}

interface CognitoUserInterfaceExt extends CognitoUserInterface {
	attributes: UserAttributes;
}

function App() {
	const [authState, setAuthState] = useState<AuthState>();
	const [user, setUser] = useState<CognitoUserInterfaceExt>();

	React.useEffect(() => {
		return onAuthUIStateChange((nextAuthState, authData) => {
			setAuthState(nextAuthState);
			setUser(authData as CognitoUserInterfaceExt)
		});
	}, []);

	return authState === AuthState.SignedIn && user && user ? (
		<div className="App">
			<div>Hello, {user.attributes.name} (
				{user.username},
				{user.attributes.email},
				{user.attributes.email_verified ? 'X' : '-'},
				{user.attributes.sub}
			</div>
			<AmplifySignOut />

			<Weather />
		</div>
	) : (
		<AmplifyAuthenticator>
			<AmplifySignUp
				slot="sign-up"
				// usernameAlias="email"
				formFields={signUpFields}
			/>

		</AmplifyAuthenticator>
	);
}

export default App;
