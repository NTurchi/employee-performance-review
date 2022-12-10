import React, { FC, useState } from "react"
import { Typography, Form, Popconfirm, Button } from "antd"
import { Row, Col, Divider, Drawer } from "antd"
import { useAppTranslation } from "../hooks/useTranslation"
import { IUser } from "../state/ducks/users"
import { IUserReview, IUserReviewCriteria } from "../api/userReview"
import TextArea from "antd/lib/input/TextArea"
import { useFetchStatus } from "../hooks"
import { ReviewCriteriaList } from "../components"

/**
 * To submit a performance review
 */
const SubmitPerformanceReview: FC<{
	review: IUserReview
	targetEmployee: IUser
	onClose: () => void
	onSubmit: (review: IUserReview) => void
}> = ({ review, targetEmployee, onClose, onSubmit }) => {
	// HOOKS
	const isLoading = useFetchStatus()
	const { t } = useAppTranslation("submit-performance-review")
	const [criteriaReview, setCriteriaReview] = useState<IUserReviewCriteria>()
	const [comment, setComment] = useState("")

	const submit = () => {
		const newReview = {
			...review,
			...criteriaReview,
			targetEmployee: undefined,
			performanceReview: undefined,
		}
		newReview.comment = comment
		onSubmit(newReview)
	}

	return (
		<Drawer
			width={640}
			closable={true}
			visible={true}
			title={t("review-of", {
				user: `${targetEmployee.firstName} ${targetEmployee.lastName}`,
			})}
			onClose={onClose}
			footer={
				<div
					style={{
						textAlign: "right",
					}}
				>
					<Popconfirm
						title={t(`submit-confirm-title`)}
						onConfirm={submit}
						okText={t("confirm")}
						cancelText={t("cancel")}
						placement="topRight"
					>
						<Button disabled={isLoading} type="primary" loading={isLoading}>
							{t(`submit-button`)}
						</Button>
					</Popconfirm>
				</div>
			}
		>
			<Typography.Title level={5} style={{ fontWeight: 300 }}>
				{t("evaluation")}
			</Typography.Title>
			<Row>
				<Col span={24}>
					<Typography.Text type="secondary">{t("evaluate")}</Typography.Text>
					<ReviewCriteriaList
						editable={true}
						onChange={setCriteriaReview}
						review={review}
						style={{ marginTop: "15px" }}
					/>
				</Col>
			</Row>
			<Divider />
			<Typography.Title level={5} style={{ fontWeight: 300 }}>
				{t("comment", {
					user: `${targetEmployee.firstName} ${targetEmployee.lastName}`,
				})}
			</Typography.Title>
			<Row>
				<Col span={24}>
					<Form.Item>
						<TextArea
							rows={4}
							placeholder={t("any-comment")}
							onChange={(e) => setComment(e.target.value)}
							value={comment}
						/>
					</Form.Item>
				</Col>
			</Row>
		</Drawer>
	)
}
export default SubmitPerformanceReview
