import { baseRequestAxios, baseUrl } from "./common"

import axios from "axios"

interface LoginResult {
	access_token: string
}

/**
 * Login the user on the application
 *
 * @export
 * @param {string} username
 * @param {string} password
 * @returns
 */
export function login(mail: string, password: string): Promise<LoginResult> {
	return baseRequestAxios(
		axios.post(
			`${baseUrl}/auth/login`,
			{
				mail,
				password,
			},
			{
				withCredentials: true,
			}
		)
	)
}
