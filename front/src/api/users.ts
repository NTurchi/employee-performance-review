import { patchRequest, postRequest, baseRequestAxios } from "./common"
import { baseUrl, deleteRequest } from "./common"
import axios from "axios"

// this is a simple session object
export enum Roles {
	ADMIN = "ADMIN",
	EMPLOYEE = "EMPLOYEE",
}

export interface IUser {
	id: number
	mail: string
	firstName: string
	lastName: string
	department: string
	roles: Roles[]
}

/**
 * Get the complete users list (Admin view) (In a real life case, should be paginated)
 *
 * @export
 * @returns
 */
export const getUsers = (): Promise<IUser[]> =>
	baseRequestAxios(
		axios.get(`${baseUrl}/auth/users`, {
			withCredentials: true,
		})
	)

export const deleteUser = deleteRequest("auth/users")

export const patchUser = patchRequest<Partial<IUser>, IUser>("auth/users")

export const postUser = postRequest<
	Omit<IUser & { password: string }, "id">,
	IUser
>("auth/register")
