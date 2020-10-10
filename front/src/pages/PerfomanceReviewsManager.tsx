import "./styles/PerformanceReviewsManager.less"
import React, { useState, useCallback, FC } from "react"
import { RouteComponentProps } from "@reach/router"
import { Button, PageHeader, Input, List, Avatar } from "antd"
import { useAppTranslation } from "../hooks/useTranslation"
import {
	FileTextOutlined,
	PlusOutlined,
	SearchOutlined,
} from "@ant-design/icons"
import { useFetchStatus, useLiveSearch, useUniqueEffect } from "../hooks"
import { useDispatch, useSelector } from "react-redux"
import AppState from "../state"
import {
	IPerformanceReviewsState,
	IPerformanceReview,
	getPerformanceReviews,
	actions,
} from "../state/ducks/performanceReviews"
import { IUser } from "../state/ducks/users"
import { getUsers } from "../state/ducks/users"
import InfiniteScroll from "react-infinite-scroller"
import { dateUtil } from "../utils"
import PerformanceReviewDetails from "./PerformanceReviewDetails"
import PerformanceReviewCreateOrUpdate from "./PerformanceReviewCreateOrUpdate"
import { ListItemEndButton } from "../components"

/**
 * Admin view for managing performance reviews
 */
const PerfomanceReviewsManager: FC<RouteComponentProps> = () => {
	// HOOKS
	const isLoading = useFetchStatus()
	const dispatch = useDispatch()
	const { t } = useAppTranslation("review-manager")
	const [currentCursor, setCurrentCursor] = useState<string | undefined>(
		undefined
	)
	const [fullNameSearch, setFullNameSearch] = useState<string | undefined>(
		undefined
	)
	const [perfSelectedForDetails, setPerfSelectedForDetails] = useState<
		undefined | IPerformanceReview
	>(undefined)
	const [modifierOpenStatus, setModifierOpenStatus] = useState<{
		isOpen: Boolean
		performanceReviewId: number | undefined
	}>({ isOpen: false, performanceReviewId: undefined })

	// title map
	const mapTitle = (p: IPerformanceReview) => {
		const targetUser = users.find((u) => u.id === p.targetUserId)
		const title = targetUser
			? t("review-of", {
					user: `${targetUser.firstName} ${targetUser.lastName}`,
			  })
			: t("default-title")
		return {
			...p,
			title,
			department: targetUser ? targetUser.department : "unknown",
		}
	}

	// SELECTOR
	const { metadata, performanceReviews } = useSelector<
		AppState,
		IPerformanceReviewsState
	>((s) => s.performanceReviews)

	const users = useSelector<AppState>((s) => s.users) as IUser[]

	// EFFECT
	useUniqueEffect(() => {
		dispatch(getUsers()) // should be done somwhere else
		dispatch(getPerformanceReviews(undefined, undefined))
	})

	// callback & others
	const loadNextPerformanceReview = () => {
		if (metadata.next && !isLoading) {
			setCurrentCursor(metadata.next)
			dispatch(getPerformanceReviews(fullNameSearch, metadata.next))
		}
	}

	// For live searching review (full text research)
	useLiveSearch(
		fullNameSearch ? fullNameSearch : "",
		useCallback(
			(fullName: string) => {
				dispatch(actions.resetPerformanceReviews())
				setCurrentCursor(undefined)
				dispatch(getPerformanceReviews(fullName, currentCursor))
			},
			[dispatch, currentCursor]
		)
	)

	return (
		<div className="ReviewManager">
			{/* DRAWERS */}
			{perfSelectedForDetails && (
				<PerformanceReviewDetails
					performanceReviewId={perfSelectedForDetails.id}
					onClose={() => setPerfSelectedForDetails(undefined)}
				/>
			)}
			{modifierOpenStatus.isOpen && (
				<PerformanceReviewCreateOrUpdate
					onClose={() =>
						setModifierOpenStatus({
							performanceReviewId: undefined,
							isOpen: false,
						})
					}
					performanceReviewId={modifierOpenStatus.performanceReviewId}
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
							setModifierOpenStatus({
								...modifierOpenStatus,
								isOpen: true,
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
						disabled={isLoading}
						onChange={(e) => setFullNameSearch(e.target.value)}
					/>
				</div>
				<div className="ReviewManager-reviewList__container">
					<InfiniteScroll
						className="ReviewManager-reviewList"
						initialLoad={false}
						pageStart={0}
						loadMore={loadNextPerformanceReview}
						hasMore={!isLoading && !!metadata.next}
						useWindow={false}
					>
						<List
							loading={!!perfSelectedForDetails || isLoading}
							itemLayout="horizontal"
							dataSource={performanceReviews.map(mapTitle)}
							renderItem={(
								item: IPerformanceReview & {
									title: string
									department: string
								}
							) => (
								<List.Item
									actions={[
										<ListItemEndButton
											onClick={() =>
												setModifierOpenStatus({
													performanceReviewId:
														item.id,
													isOpen: true,
												})
											}
											buttonType="EDIT"
										/>,
										<ListItemEndButton
											onClick={() =>
												setPerfSelectedForDetails(item)
											}
											buttonType="DETAILS"
										/>,
									]}
								>
									<List.Item.Meta
										avatar={
											<Avatar
												icon={<FileTextOutlined />}
											/>
										}
										title={item.title}
										description={t("due-date-for", {
											department: item.department,
											date: dateUtil.formatDate(
												item.dueDate
											),
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
export default PerfomanceReviewsManager
