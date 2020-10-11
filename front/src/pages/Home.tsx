import React, { FC, useEffect, useState } from "react"
import { Layout, Menu, Typography } from "antd"
import { RouteComponentProps, navigate, Router } from "@reach/router"
import { actions } from "../state/ducks/session"
import { usersAPI } from "../api"
import "./styles/Home.less"
import { useAppTranslation } from "../hooks"
import { useDispatch } from "react-redux"
import {
	FileSyncOutlined,
	LogoutOutlined,
	ProjectOutlined,
	UsergroupAddOutlined,
} from "@ant-design/icons"
import useSession from "../hooks/useSession"
import PerfomanceReviewsManager from "./PerfomanceReviewsManager"
import UsersManager from "./UsersManager"
import MyReviews from "./MyReviews"
import { RoleRoute } from "../containers"
import { Roles } from "../api/users"

const { Content, Sider } = Layout

enum RoutePath {
	ADMIN_REVIEWS = "admin-rev",
	ADMIN_US = "admin-us",
	MY_REVIEWS = "my-reviews",
}

interface IMenuItems {
	name: string
	icon: React.ReactNode
	path: RoutePath
	roles: usersAPI.Roles[]
}

/**
 * Rendew menu items
 */
const RenderMenuItem: FC<IMenuItems> = ({ name, icon, path }) => (
	<Menu.Item
		onClick={() => {
			navigate(path)
		}}
		key={path}
		icon={icon}
	>
		{name}
	</Menu.Item>
)

const onRoleIsAtLeastIncludedInMenuItem = (roles: usersAPI.Roles[]) => (
	item: IMenuItems
) => {
	return item.roles.reduce(
		(include, currentRole) =>
			include ? include : roles.includes(currentRole),
		false
	)
}

/**
 * Home page
 * @param param0
 */
const Home: FC<RouteComponentProps> = ({ location }) => {
	const { t } = useAppTranslation("home-menu")
	const { userMetadata } = useSession()
	const userRoles = userMetadata ? userMetadata.roles : []
	const dispatch = useDispatch()
	// PAGES STATE
	const [menuItemSelected, setMenuItemSelected] = useState<
		string | undefined
	>(undefined)

	const menuItems = [
		{
			name: t("menu-item-reviews"),
			icon: <ProjectOutlined />,
			path: RoutePath.MY_REVIEWS,
			roles: [usersAPI.Roles.EMPLOYEE],
		},
		{
			name: t("menu-item-admin-reviews"),
			icon: <FileSyncOutlined />,
			path: RoutePath.ADMIN_REVIEWS,
			roles: [usersAPI.Roles.ADMIN],
		},
		{
			name: t("menu-item-admin-users"),
			icon: <UsergroupAddOutlined />,
			path: RoutePath.ADMIN_US,
			roles: [usersAPI.Roles.ADMIN],
		},
	]

	useEffect(() => {
		if (location) {
			const item = menuItems.find((t) =>
				location.pathname.includes(t.path)
			)
			if (item) {
				setMenuItemSelected(item ? item.path : undefined)
			} else if (userRoles.includes(usersAPI.Roles.ADMIN)) {
				navigate(`/home/${RoutePath.ADMIN_REVIEWS}`)
			} else {
				navigate(`/home/${RoutePath.MY_REVIEWS}`)
			}
		}
	}, [location, menuItems, userRoles])

	// callbacks
	const onLogoutButtonClicked = () => {
		navigate("/")
		dispatch(actions.logout())
	}

	// VIEW
	return (
		<Layout className="Home">
			<Sider
				theme="light"
				breakpoint="lg"
				collapsedWidth={0}
				className="Home-sider"
			>
				<img
					className="Home-logo"
					src={`${process.env.PUBLIC_URL}/assets/logo.png`}
					alt="logo"
				/>
				<div className="Home-Menu__flex">
					<Menu
						theme="light"
						selectedKeys={
							menuItemSelected ? [menuItemSelected] : []
						}
						mode="inline"
					>
						{menuItems
							.filter(
								onRoleIsAtLeastIncludedInMenuItem(
									userRoles as usersAPI.Roles[]
								)
							)
							.map(RenderMenuItem)}
					</Menu>
					<Menu theme="light" mode="inline">
						<Menu.Item
							disabled={true}
							style={{ cursor: "default" }}
						>
							<Typography.Text type="secondary">
								{userMetadata &&
									`${userMetadata?.firstName} ${userMetadata?.lastName}`}
							</Typography.Text>
						</Menu.Item>
						<Menu.Item
							onClick={onLogoutButtonClicked}
							icon={<LogoutOutlined />}
						>
							{t("menu-item-logout")}
						</Menu.Item>
					</Menu>
				</div>
			</Sider>
			<Layout>
				<Content className="Home-content Home-content__bg-white">
					<Router>
						{userMetadata && (
							<RoleRoute
								path={RoutePath.MY_REVIEWS}
								Page={() => (
									<MyReviews userId={userMetadata.id} />
								)}
								roles={[Roles.EMPLOYEE, Roles.ADMIN]}
								homePath={RoutePath.MY_REVIEWS}
							/>
						)}
						<RoleRoute
							path={RoutePath.ADMIN_US}
							Page={UsersManager}
							roles={[Roles.ADMIN]}
							homePath={RoutePath.ADMIN_US}
						/>
						<RoleRoute
							path={RoutePath.ADMIN_REVIEWS}
							Page={PerfomanceReviewsManager}
							roles={[Roles.ADMIN]}
							homePath={RoutePath.ADMIN_REVIEWS}
						/>
						<UsersManager path={RoutePath.ADMIN_US} />
						<PerfomanceReviewsManager
							path={RoutePath.ADMIN_REVIEWS}
						/>
					</Router>
				</Content>
			</Layout>
		</Layout>
	)
}

export default Home
