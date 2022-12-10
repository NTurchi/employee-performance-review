import "./styles/UsersManager.less"
import React, { useState, FC } from "react"
import { RouteComponentProps } from "@reach/router"
import {
	Button,
	PageHeader,
	Input,
	List,
	Avatar,
	message,
	Popconfirm,
} from "antd"
import { useAppTranslation } from "../hooks/useTranslation"
import { PlusOutlined, SearchOutlined } from "@ant-design/icons"
import {
	useFetchStatus,
	useUniqueEffect,
	useReduxDispatch,
	useSession,
} from "../hooks"
import { useSelector } from "react-redux"
import AppState from "../state"
import { deleteUser, IUser } from "../state/ducks/users"
import { getUsers } from "../state/ducks/users"
import InfiniteScroll from "react-infinite-scroller"
import { UserOutlined } from "@ant-design/icons"
import UserCreateOrUpdate from "./UsersCreateOrUpdate"
import { ListItemEndButton } from "../components"

/**
 * Admin view for managing users (ADMIN & EMPLOYEE)
 */
const UsersManager: FC<RouteComponentProps> = () => {
	// HOOKS
	const isLoading = useFetchStatus()
	const dispatch = useReduxDispatch()
	const { t } = useAppTranslation("users-manager")
	const session = useSession()
	const [fullTextFilter, setFullTextFilter] = useState<string | undefined>(
		undefined
	)
	const [
		userCreateOrUpdateDrawerStatus,
		setUserCreateOrUpdateDrawerStatus,
	] = useState<{
		isOpen: Boolean
		userId: number | undefined
	}>({ isOpen: false, userId: undefined })

	// title map
	const mapTitle = (user: IUser) => ({
		...user,
		title: `${user.firstName} ${user.lastName}`,
	})

	// SELECTOR
	const users = useSelector<AppState, IUser[]>((s) => s.users)

	// EFFECT
	useUniqueEffect(() => {
		dispatch(getUsers())
	})

	const onDeleteUser = ({ id, firstName, lastName }: IUser) => {
		dispatch(deleteUser(id)).then(() => {
			message.success(t("user-deleted", { user: `${firstName} ${lastName}` }))
		})
	}

	// SEARCH INPUT (TOP of the list) CALLBACK
	const fullTextSearch = (user: IUser) => {
		const convertObjectToFullText: (obj: any) => string = (obj: {
			[key: string]: any
		}) =>
			Object.keys(obj).reduce(
				(fullText, key: string) =>
					fullText +
					(typeof obj[key] === "object"
						? convertObjectToFullText
						: obj[key]
						? obj[key].toString()
						: ""),
				""
			)
		const fullText = convertObjectToFullText(user)
		return fullTextFilter
			? fullText.toLowerCase().includes(fullTextFilter.toLowerCase())
			: true
	}

	return (
		<div className="ReviewManager">
			{/* DRAWERS */}
			{userCreateOrUpdateDrawerStatus.isOpen && (
				<UserCreateOrUpdate
					onClose={() =>
						setUserCreateOrUpdateDrawerStatus({
							isOpen: false,
							userId: undefined,
						})
					}
					userId={userCreateOrUpdateDrawerStatus.userId}
				/>
			)}
			{/* MAIN PAGE */}
			<PageHeader
				title={t("title")}
				extra={[
					<Button
						key="add"
						type="primary"
						onClick={() =>
							setUserCreateOrUpdateDrawerStatus({
								isOpen: true,
								userId: undefined,
							})
						}
						icon={<PlusOutlined />}
					>
						{t("create-button")}
					</Button>,
				]}
			></PageHeader>
			<div className="ReviewManager-content">
				<div className="ReviewManager-input__container">
					<Input
						className="ReviewManager-input"
						placeholder={t("search-placeholder")}
						prefix={<SearchOutlined />}
						onChange={(e) => setFullTextFilter(e.target.value)}
					/>
				</div>
				<div className="ReviewManager-reviewList__container">
					{/* Working example alread exists for performance review */}
					<InfiniteScroll
						className="ReviewManager-reviewList"
						initialLoad={false}
						pageStart={0}
						loadMore={() => {}}
						hasMore={false}
						useWindow={false}
					>
						<List
							loading={isLoading}
							itemLayout="horizontal"
							dataSource={users.map(mapTitle).filter(fullTextSearch)}
							renderItem={(
								item: IUser & {
									title: string
								}
							) => (
								<List.Item
									actions={
										item.id !== session.userMetadata?.id
											? [
													<Popconfirm
														title={t("delete-user-title")}
														placement="topRight"
														onConfirm={() => {
															onDeleteUser(item)
														}}
														okText={t("confirm-delete")}
														cancelText={t("cancel-delete")}
													>
														<ListItemEndButton buttonType="DELETE" />
													</Popconfirm>,
													<ListItemEndButton
														buttonType="EDIT"
														onClick={() =>
															setUserCreateOrUpdateDrawerStatus({
																isOpen: true,
																userId: item.id,
															})
														}
													/>,
											  ]
											: []
									}
								>
									<List.Item.Meta
										avatar={<Avatar icon={<UserOutlined />} />}
										title={item.title}
										description={t("dpt", {
											department: item.department,
										})}
									/>
								</List.Item>
							)}
						/>
					</InfiniteScroll>
				</div>
			</div>
		</div>
	)
}
export default UsersManager
