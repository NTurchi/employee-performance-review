import React, { FC } from "react"
import { Typography } from "antd"
import { Row, Col, Divider, Drawer, Descriptions } from "antd"
import { useAppTranslation } from "../hooks/useTranslation"
import { IUser } from "../state/ducks/users"
import { dateUtil } from "../utils"
import { IUserReview } from "../api/userReview"
import { ReviewCriteriaList } from "../components"

export interface IReviewDetails extends IUserReview {
	author: IUser | undefined
}

/**
 * Show the review made by one employee for a performance review
 */
const UserReviewDetails: FC<{
	review: IReviewDetails
	onClose: () => void
}> = ({ review, onClose }) => {
	// HOOKS
	const { t } = useAppTranslation("user-review-details")
	const authorName = review.author
		? `${review.author.firstName} ${review.author.lastName}`
		: "Unknown Employee"
	const date = review.submitDate
		? dateUtil.formatWithHours(review.submitDate)
		: "Unknown date"

	return (
		<Drawer width={640} closable={true} visible={true} onClose={onClose}>
			<Typography.Title level={4}>
				{t("review-from", { user: authorName })}
			</Typography.Title>
			<Row>
				<Col span={24}>
					<Descriptions column={1} bordered>
						<Descriptions.Item label={t("submit-date")}>
							{date}
						</Descriptions.Item>
						<Descriptions.Item label={t("comment")}>
							{review.comment}
						</Descriptions.Item>
					</Descriptions>
				</Col>
			</Row>
			<Divider />
			<Typography.Title level={5} style={{ fontWeight: 300 }}>
				{t("result")}
			</Typography.Title>
			<Row>
				<Col span={24}>
					<ReviewCriteriaList review={review} />
				</Col>
			</Row>
		</Drawer>
	)
}
export default UserReviewDetails
