import React, { FC, useEffect, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useFetchStatus } from "../hooks"
import AppState from "../state"
import { actions as errorActions } from "../state/ducks/error"
import { message } from "antd"

export interface IErrorBannerProps {
	onErrorTriggered: (errorType: string) => void
}

/**
 *
 *
 * @param param0
 */
const ErrorBanner: FC<IErrorBannerProps> = ({ onErrorTriggered, children }) => {
	const errors = useSelector((state: AppState) => state.errors)
	const isPerfomingRequest = useFetchStatus()
	const dispatch = useDispatch()
	const onErrorTriger = useCallback(onErrorTriggered, [])
	useEffect(() => {
		if (errors.length > 0 && !isPerfomingRequest) {
			const error = errors[0]
			onErrorTriger(error.type)
			if (error.message && error.message.trim() !== "") {
				message.error(<span>{error.message}</span>)
			}
			dispatch(errorActions.removeError(0))
		}
	}, [dispatch, errors, isPerfomingRequest, onErrorTriger, onErrorTriggered])

	return <>{children}</>
}

export default ErrorBanner
