import React, { FC } from "react"
import { Redirect, RouteComponentProps, navigate } from "@reach/router"
import { useSession } from "../hooks"
import { Roles } from "../api/users"
import { ErrorTemplates } from "../components"
import { useAppTranslation } from "../hooks/useTranslation"

interface IRoleRouteProps<T> {
	Page: React.FC<RouteComponentProps & Partial<T>>
	path: string
	roles: Roles[]
	homePath: string
}

const Render: FC<RouteComponentProps> = ({ children }) => (
	<div style={{ height: "100%" }}>{children}</div>
)

function RoleRoute<T>({
	Page,
	path,
	roles,
	homePath,
}: IRoleRouteProps<T>): JSX.Element {
	const { userMetadata } = useSession()
	const isLogged = !!userMetadata
	const isAuthorized =
		userMetadata && userMetadata.roles.find((r) => roles.includes(r))
	const t = useAppTranslation("error-templates.unauthorized").t

	return (
		<Render path={path}>
			{isLogged ? (
				isAuthorized ? (
					<Page />
				) : (
					<ErrorTemplates.Unauthorized
						onButtonClick={() => navigate(homePath)}
						t={t}
					/>
				)
			) : (
				<Redirect to="/" noThrow />
			)}
		</Render>
	)
}

export default RoleRoute
