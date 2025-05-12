import { env } from '$env/dynamic/public';
import jwt from 'jsonwebtoken';

export function verifyToken(token: string) {
	const decoded = jwt.verify(token, env.PUBLIC_SECRET_TOKEN);
	return decoded;
}
