import { RouteComponentProps } from "@reach/router"
import React, { FC, ReactNode } from "react"

/**
 * To apply reach/router props on the children component without changing is props definition
 * @param param0
 */
const RouteProps: FC<RouteComponentProps<{ render: ReactNode }>> = ({
	render,
}) => <>{render}</>

export default RouteProps
