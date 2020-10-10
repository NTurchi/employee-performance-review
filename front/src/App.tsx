import React, { FC } from "react"
import "./App.less"
import { Login, Home } from "./pages"
import { ErrorBanner, RouteProps } from "./containers"
import { ErrorType } from "./state/ducks/error"
import { ErrorTemplates } from "./components"
import { useAppTranslation } from "./hooks"
import { navigate, Router } from "@reach/router"
import { useDispatch } from "react-redux"
import { actions } from "./state/ducks/session"

const App: FC = () => {
	const onLoginSucceed = () => {
		navigate("/home")
	}

	// errorTemplate
	const t = useAppTranslation("error-templates").t
	const dispatch = useDispatch()
	const onButtonClick = () => navigate("/home")

	const onErrorRest = () => {
		dispatch(actions.logout())
		navigate("/")
	}

	const errorPages: { [errorType: string]: React.ReactNode } = {
		[ErrorType.MOT_FOUND]: (
			<ErrorTemplates.NotFound {...{ t, onButtonClick }} />
		),
		[ErrorType.UNAUTHORIZED]: (
			<ErrorTemplates.Unauthorized
				{...{ t, onButtonClick: onErrorRest }}
			/>
		),
		[ErrorType.SERVER_ERROR]: (
			<ErrorTemplates.ServerDown {...{ t, onButtonClick: onErrorRest }} />
		),
		[ErrorType.SERVER_DOWN]: (
			<ErrorTemplates.ServerError
				{...{ t, onButtonClick: onErrorRest }}
			/>
		),
	}

	return (
		<ErrorBanner
			onErrorTriggered={(type) =>
				Object.keys(errorPages).includes(type) && navigate(`/${type}`)
			}
		>
			<Router className="App App__fullHeight">
				<Login path="/*" onLoginSucceed={onLoginSucceed} />
				<Home path="/home/*" />
				{Object.keys(errorPages).map((k, i) => (
					<RouteProps path={k} key={i} render={errorPages[k]} />
				))}
			</Router>
		</ErrorBanner>
	)
}

export default App
