import { ErrorType } from "../state/ducks/error"
import { AxiosResponse, AxiosError } from "axios"
import axios from "axios"

export const baseUrl = "http://localhost:2020/v1/api"

/**
 * REsult that include cursor pagination system
 *
 * @export
 * @interface IResultWithMetadata
 * @template IResult
 */
export interface IResultWithCursorMetadata<IResult> {
	metadata: {
		prev_cursor: string | undefined
		next_cursor: string | undefined
	}
	search_result: IResult[]
}

/**
 * Shortcut for handling Http request
 *
 * @param fetchRequest
 */
export const baseRequestAxios = <T>(fetchRequest: Promise<AxiosResponse>) =>
	fetchRequest.then(
		(res) => res.data,
		(err: AxiosError) => {
			throw parseError(err.response?.data, err.response?.status || 500)
		}
	) as Promise<T>

/**
 * Tansforms [ ["limit", 10], ["offset", 2o] ] to `?limit=10&offset=20`
 * @param queryParams example: [ ["limit", 10], ["offset", 2o] ]
 */
export const getQueryParamsStringFromArray = (
	queryParams: Array<Array<string | undefined>>
) => {
	const filterQueryParams: string[] = queryParams.reduce(
		(queries: string[], [queryKey, queryValue]) =>
			!!queryValue ? [...queries, `${queryKey}=${queryValue}`] : queries,
		[]
	)
	return filterQueryParams.length > 0 ? `?${filterQueryParams.join("&")}` : ""
}

/**
 * It doesn't take of every cases. It is just for the coding challenge. Could be improve
 * @param status
 */
const getTypeFromStatus = (status: number) => {
	switch (status) {
		case 500:
			return ErrorType.SERVER_ERROR
		case 401:
		case 403: // normally it should be ErrorType.FORBIDDEN
			return ErrorType.UNAUTHORIZED
		case 404:
			return ErrorType.MOT_FOUND
		default:
			return ErrorType.CLIENT_ERROR
	}
}

/**
 * Handle API Response
 * @param response
 */
export async function handleResponse<T>(response: Response): Promise<T> {
	if (response.ok) return response.json()
	const error = await response.json()
	throw parseError(error, response.status)
}

export function handleError(error: any) {
	throw parseError(error, 503) // we can put 500 because it mostly server_down
}

function parseError(error: any, status: number) {
	const getError = (message: string) => ({
		message,
		type: message.includes("Failed to fetch")
			? ErrorType.SERVER_DOWN
			: getTypeFromStatus(status),
	})
	return typeof error === "object"
		? getError(error.message || "")
		: getError(error || "")
}

// COMMON REQUEST
export function deleteRequest(path: string): (id: number) => Promise<any> {
	return (id) =>
		baseRequestAxios(
			axios.delete(`${baseUrl}/${path}/${id}`, { withCredentials: true })
		)
}

export function patchRequest<TParam, TResult>(
	path: string
): (id: number, domainObject: Partial<TParam>) => Promise<TResult> {
	return (id, domainObject) =>
		baseRequestAxios(
			axios.patch(`${baseUrl}/${path}/${id}`, domainObject, {
				withCredentials: true,
			})
		)
}

export function postRequest<TParam, TResult>(
	path: string
): (newEntity: TParam) => Promise<TResult> {
	return (newEntity) =>
		baseRequestAxios(
			axios.post(`${baseUrl}/${path}`, newEntity, {
				withCredentials: true,
			})
		)
}
