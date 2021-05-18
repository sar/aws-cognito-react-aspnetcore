import { JwtPayload } from 'jwt-decode';

export interface IUserData extends JwtPayload {
	email?: string;
}
