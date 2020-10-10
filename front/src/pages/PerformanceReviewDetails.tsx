import "./styles/PerformanceReviewDetails.less"
import React, { useState, FC } from "react"
import { Button, Row, Col, Divider, Drawer, Table, Tooltip } from "antd"
import { useAppTranslation } from "../hooks/useTranslation"
import { useFetchStatus, useUniqueEffect } from "../hooks"
import { useDispatch, useSelector } from "react-redux"
import AppState from "../state"
import { IPerformanceReview } from "../state/ducks/performanceReviews"
import { IUser } from "../state/ducks/users"
import { getUserReviewsFromPerformanceReview } from "../state/ducks/userReviews"
import { Typography } from "antd"
import { dateUtil } from "../utils"
import { ColumnsType } from "antd/lib/table"
import { IUserReview, UserReviewStatus } from "../api/userReview"
import UserReviewDetails from "./UserReviewDetails"
import { IReviewDetails } from "./UserReviewDetails"

const DescriptionItem = ({
	title,
	value,
}: {
	title: string
	value: string
}) => (
	<div className="PerformanceReviewDetails-propsItemContent">
		<p className="PerformanceReviewDetails-propsItemTitle">{title}:</p>
		{value}
	</div>
)

/**
 * Admin view for managing review
 */
const PerformanceReviewDetails: FC<{
	performanceReviewId: number
	onClose: () => void
}> = ({ performanceReviewId, onClose }) => {
	// HOOKS
	const isLoading = useFetchStatus()
	const dispatch = useDispatch()
	const { t } = useAppTranslation("review-details")
	const [reviewDetails, setReviewDetails] = useState<
		IReviewDetails | undefined
	>(undefined)

	// SELECTOR
	const performanceReview = useSelector<AppState, IPerformanceReview[]>(
		(s) => s.performanceReviews.performanceReviews
	).find((i) => i.id === performanceReviewId)

	const usersReviews = useSelector<AppState, IUserReview[]>(
		(s) => s.userReviews
	)

	const users = useSelector<AppState, IUser[]>((s) => s.users)

	const targetUser = users.find(
		(u) => u.id === performanceReview?.targetUserId
	)

	const getUserInfos = () =>
		targetUser
			? {
					fullName: `${targetUser.firstName} ${targetUser.lastName}`,
					department: targetUser.department,
			  }
			: { fullName: `Unknown`, department: "Unknown" }

	// EFFECT
	useUniqueEffect(() => {
		dispatch(getUserReviewsFromPerformanceReview(performanceReviewId))
	})

	// TABLES
	const reviewersColumns: ColumnsType<IUser> = [
		{
			key: "name",
			title: t("reviewer-name"),
			render: (v, user) => `${user.firstName} ${user.lastName}`,
		},
		{
			key: "dpt",
			title: t("department"),
			dataIndex: "department",
		},
	]

	const reviewSubmittedColumns: ColumnsType<
		IUserReview & { title: string; author: IUser | undefined }
	> = [
		{
			title: t("review-from"),
			key: "review",
			render: (v, item, key) => (
				<Tooltip
					placement="leftTop"
					key={key}
					title={t("click-for-review-details")}
				>
					<Button onClick={() => setReviewDetails(item)} type="link">
						{item.title}
					</Button>
				</Tooltip>
			),
		},
	]

	const mapReviewSubmitted = (review: IUserReview, key: number) => {
		const user = users.find((u) => u.id === review.reviewerId)
		const fullName = user
			? `${user.firstName} ${user.lastName}`
			: "Unknown employee"
		const title = `${
			review.submitDate
				? dateUtil.formatDate(review.submitDate)
				: "Unknown date"
		} - ${fullName}`
		return { ...review, title, author: user, key }
	}

	return (
		<Drawer
			className="PerformanceReviewDetails"
			width={640}
			closable={true}
			placement="right"
			visible={true}
			onClose={() => {
				onClose()
			}}
		>
			{/* REVIEW DETAILS DRAWER */}
			{reviewDetails && (
				<UserReviewDetails
					onClose={() => setReviewDetails(undefined)}
					review={reviewDetails}
				/>
			)}
			{/* CONENT */}
			<Typography.Title
				level={4}
				className="PerformanceReviewDetails-title"
			>
				{t("review-of", { user: getUserInfos().fullName })}
			</Typography.Title>
			<Row>
				<Col span={12}>
					<DescriptionItem
						title={t("department")}
						value={getUserInfos().department}
					/>
				</Col>
				<Col span={12}>
					<DescriptionItem
						title={t("due-date")}
						value={
							performanceReview
								? dateUtil.formatWithHours(
										performanceReview.dueDate
								  )
								: "Unknown"
						}
					/>
				</Col>
			</Row>
			<Divider />
			<Typography.Title
				level={5}
				className="PerformanceReviewDetails-title"
			>
				{t("reviewers")}
			</Typography.Title>
			<Row>
				<Col span={24}>
					<Table
						loading={isLoading}
						columns={reviewersColumns}
						dataSource={users
							.filter((u) =>
								usersReviews?.find((r) => r.reviewerId === u.id)
							)
							.map((prop, key) => ({ ...prop, key }))}
						scroll={{ y: 300 }}
						pagination={false}
					/>
				</Col>
			</Row>
			<Divider />
			<Typography.Title
				level={5}
				className="PerformanceReviewDetails-title"
			>
				{t("reviews-submitted")}
			</Typography.Title>
			<Row>
				<Col span={24}>
					<Table
						loading={isLoading}
						columns={reviewSubmittedColumns}
						dataSource={usersReviews
							?.filter(
								(r) => r.status === UserReviewStatus.SUBMITTED
							)
							.map(mapReviewSubmitted)}
						scroll={{ y: 300 }}
						pagination={false}
					/>
				</Col>
			</Row>
		</Drawer>
	)
}
export default PerformanceReviewDetails
