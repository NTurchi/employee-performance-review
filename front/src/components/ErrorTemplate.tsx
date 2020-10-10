import React, { FC } from "react"
import { Result, Button } from "antd"
import { ErrorType } from "../state/ducks/error"

export interface IErrorTemplatesProps {
	onButtonClick: () => void
	t: (key: string, ...args: any) => string // translatable hooks-  it's an highorder function so I cannot call hooks inside it
}

/**
 *
 * @param type Error Type ->
 * @param status
 */
const ErrorTemplate: (
	type: string,
	status:
		| "404"
		| "500"
		| "403"
		| "success"
		| "error"
		| "info"
		| "warning"
		| undefined
) => FC<IErrorTemplatesProps> = (type, status) => ({ t, onButtonClick }) => {
	return (
		<Result
			status={status}
			title={t(`${type}.title`)}
			subTitle={t(`${type}.sub-title`)}
			extra={
				<Button type="primary" onClick={onButtonClick}>
					{t(`${type}.button-label`)}
				</Button>
			}
		/>
	)
}

const ErrorTemplates = {
	NotFound: ErrorTemplate(ErrorType.MOT_FOUND, "404"),
	Unauthorized: ErrorTemplate(ErrorType.UNAUTHORIZED, "403"),
	ServerError: ErrorTemplate(ErrorType.SERVER_ERROR, "500"),
	ServerDown: ErrorTemplate(ErrorType.SERVER_DOWN, "error"),
}

export default ErrorTemplates
