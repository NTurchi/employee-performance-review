import "./styles/MyReviews.less"
import React, { useState, FC } from "react"
import { RouteComponentProps } from "@reach/router"
import { Button, PageHeader, List, Avatar, message } from "antd"
import { useAppTranslation } from "../hooks/useTranslation"
import { FileTextOutlined, ReloadOutlined } from "@ant-design/icons"
import { useFetchStatus } from "../hooks"
import { dateUtil } from "../utils"
import { ListItemEndButton } from "../components"
import { useEmployeeReviewsToSubmit, useReduxDispatch } from "../hooks"
import { INotSubmittedPerformanceReview } from "../hooks/useEmployeeReviewsToSubmit"
import SubmitPerformanceReview from "./SubmitPerformanceReview"
import { IUserReview } from "../api/userReview"
import { submitUserReview } from "../state/ducks/userReviews"

/**
 * Employee view to submit performance review
 */
const MyReviews: FC<RouteComponentProps & { userId: number }> = ({
	userId,
}) => {
	// HOOKS
	const isLoading = useFetchStatus()
	const dispatch = useReduxDispatch()
	const [reviewsToSubmit, reloadReviewsToSubmit] = useEmployeeReviewsToSubmit(
		userId
	)
	const { t } = useAppTranslation("my-reviews")
	const [
		submitEmployeeReviewDrawerOpen,
		setSubmitEmployeeReviewDrawerOpen,
	] = useState<INotSubmittedPerformanceReview | undefined>(undefined)

	const onUserReviewSubmitted = (newReview: IUserReview) => {
		dispatch(submitUserReview(newReview.performanceReviewId, newReview)).then(
			() => {
				message.success(t("success-submitted"))
				setSubmitEmployeeReviewDrawerOpen(undefined)
			}
		)
	}

	return (
		<div className="MyReviews">
			{/* DRAWERS */}
			{submitEmployeeReviewDrawerOpen &&
				submitEmployeeReviewDrawerOpen.targetEmployee && (
					<SubmitPerformanceReview
						review={submitEmployeeReviewDrawerOpen}
						targetEmployee={submitEmployeeReviewDrawerOpen.targetEmployee}
						onClose={() => setSubmitEmployeeReviewDrawerOpen(undefined)}
						onSubmit={onUserReviewSubmitted}
					/>
				)}
			{/* MAIN PAGE */}
			<PageHeader
				title={t("title")}
				extra={[
					<Button
						key="reload"
						type="primary"
						onClick={reloadReviewsToSubmit}
						icon={<ReloadOutlined />}
					>
						{t("reload-button")}
					</Button>,
				]}
			></PageHeader>
			<div className="MyReviews-content">
				<div className="MyReviews-reviewList__container">
					<List
						loading={isLoading}
						itemLayout="horizontal"
						dataSource={reviewsToSubmit}
						renderItem={(item: INotSubmittedPerformanceReview) => (
							<List.Item
								actions={[
									<ListItemEndButton
										onClick={() => setSubmitEmployeeReviewDrawerOpen(item)}
										buttonType="EDIT"
									/>,
								]}
							>
								<List.Item.Meta
									avatar={<Avatar icon={<FileTextOutlined />} />}
									title={
										item.targetEmployee
											? t("review-of", {
													user: `${item.targetEmployee.firstName} ${item.targetEmployee.lastName}`,
											  })
											: t("default-title")
									}
									description={t("due-date-for", {
										department: item.targetEmployee?.department,
										date: item.performanceReview
											? dateUtil.formatDate(item.performanceReview.dueDate)
											: "Unknown",
									})}
								/>
							</List.Item>
						)}
					/>
				</div>
			</div>
		</div>
	)
}
export default MyReviews
