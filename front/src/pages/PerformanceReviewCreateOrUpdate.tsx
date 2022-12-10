import React, { useState, FC } from "react"
import {
	Button,
	Drawer,
	Typography,
	Row,
	Col,
	Transfer,
	Select,
	DatePicker,
	Popconfirm,
} from "antd"
import { useAppTranslation } from "../hooks/useTranslation"
import { useFetchStatus, useUniqueEffect } from "../hooks"
import { useSelector } from "react-redux"
import AppState from "../state"
import { IPerformanceReview } from "../state/ducks/performanceReviews"
import { IUser } from "../state/ducks/users"
import {
	getUserReviewsFromPerformanceReview,
	IUserReview,
} from "../state/ducks/userReviews"
import { usersAPI } from "../api"
import { Moment } from "moment"
import {
	createPerformanceReview,
	updatePerformanceReview,
} from "../state/ducks/performanceReviews"
import useReduxDispatch from "../hooks/useReduxDispatch"
import { message } from "antd"

const moment = require("moment")

const { Option } = Select

/**
 * Admin view for creating / update performance review for one employee. I decided to merge bother update and create because the entity is small. Otherwise, I would have just create two different files
 */
const PerformanceReviewCreateOrUpdate: FC<{
	onClose: () => void
	performanceReviewId?: number
}> = ({ performanceReviewId, onClose }) => {
	// SELECTOR
	// for update case -- Do not follow sepration of concern rule (SOLID), but for this case it is fine
	const performanceToUpdate = useSelector<AppState, IPerformanceReview[]>(
		(s) => s.performanceReviews.performanceReviews
	).find((p) => (performanceReviewId ? p.id === performanceReviewId : false))
	const users = useSelector<AppState, IUser[]>((s) => s.users)

	// HOOKS
	const isLoading = useFetchStatus()
	const dispatch = useReduxDispatch()
	const [targetUser, setTargetUser] = useState<IUser | undefined>(undefined)
	const [blurred, setBlurred] = useState<boolean>(false)
	const { t } = useAppTranslation(
		`review-${!!performanceReviewId ? "update" : "creation"}`
	)

	// title map
	const userItems = users
		.filter((user: IUser) => user.roles.includes(usersAPI.Roles.EMPLOYEE))
		.map((user: IUser) => ({
			key: user.id.toString(),
			title: `${user.firstName} ${user.lastName} | ${user.department}`,
			disabled:
				user.id === targetUser?.id ||
				user.id === performanceToUpdate?.targetUserId,
		}))

	const usersReviews = useSelector<AppState, IUserReview[]>(
		(s) => s.userReviews
	)

	useUniqueEffect(() => {
		if (performanceReviewId) {
			dispatch(getUserReviewsFromPerformanceReview(performanceReviewId))
		}
	})

	// TRANSFER STATE
	const [reviewers, setReviewers] = useState<string[]>(
		performanceReviewId
			? userItems
					.filter((item) =>
						usersReviews.find((ur) => ur.reviewerId.toString() === item.key)
					)
					.map((u) => u.key)
			: []
	)

	const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
	const [dueDate, setDueDate] = useState<Moment>(
		performanceToUpdate ? moment(performanceToUpdate.dueDate) : moment()
	)

	// Transfer Callbacks
	const handleReviewerChoiceChanged = (newReviewers: string[]) => {
		if (!blurred) {
			setBlurred(true)
		}
		setReviewers(newReviewers)
	}
	const handleSelectEmployeeChanged = (
		newSelectedEmployeeAsReviewer: string[]
	) => setSelectedEmployees(newSelectedEmployeeAsReviewer)

	const onTargetEmployeeSelected = (userId: string) => {
		setReviewers(reviewers.filter((r) => r !== userId))
		setTargetUser(users.find((u) => u.id.toString() === userId))
	}

	const onModifierButtonClicked = () => {
		// UPDATE OR CREATION ? -- TODO should be avoided this in a real world app. It's a tiny app so that's fine
		const makeTheRequest = () => {
			if (performanceToUpdate) {
				return dispatch(
					updatePerformanceReview(performanceToUpdate.id, {
						dueDate: dueDate.toISOString(),
						reviewers: reviewers.map((id) => parseInt(id)),
					})
				)
			} else {
				return dispatch(
					createPerformanceReview({
						dueDate: dueDate.toISOString(),
						targetUserId: targetUser?.id as number,
						reviewers: reviewers.map((id) => parseInt(id)),
					})
				)
			}
		}

		makeTheRequest().then(() => {
			message.success(t("success-message"))
			onClose()
		})
	}
	const modifierButtonDisabled =
		(!targetUser && !performanceReviewId) || !dueDate || reviewers.length === 0
	return (
		<Drawer
			width={640}
			closable={true}
			title={t("title")}
			visible={true}
			onClose={onClose}
			footer={
				<div
					style={{
						textAlign: "right",
					}}
				>
					<Popconfirm
						title={t("confirm-title")}
						onConfirm={onModifierButtonClicked}
						okText={t("confirm")}
						cancelText={t("cancel")}
						placement="topRight"
					>
						<Button
							disabled={modifierButtonDisabled}
							type="primary"
							loading={isLoading}
						>
							{t("modifier-button")}
						</Button>
					</Popconfirm>
				</div>
			}
		>
			{!performanceReviewId && (
				<Row style={{ marginBottom: "30px" }}>
					<Col span={24}>
						<Typography.Title level={5} style={{ fontWeight: 300 }}>
							{t("target-employee")}
						</Typography.Title>
						<Select
							showSearch
							style={{ width: "300px" }}
							placeholder={t("select-employee-placeholder")}
							optionFilterProp="children"
							loading={isLoading}
							onChange={onTargetEmployeeSelected}
							filterOption={(input, option) =>
								option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
							}
						>
							{userItems.map(({ key, title }) => (
								<Option key={key} value={key}>
									{title}
								</Option>
							))}
						</Select>
					</Col>
				</Row>
			)}
			<Row>
				<Col span={24}>
					<Typography.Title level={5} style={{ fontWeight: 300 }}>
						{t("end-date")}
					</Typography.Title>
					<DatePicker
						showTime
						value={dueDate}
						onOk={(value) => setDueDate(value)}
					/>
				</Col>
			</Row>
			<Row>
				<Col span={24}>
					<Typography.Title
						level={5}
						style={{ fontWeight: 300, marginTop: "30px" }}
					>
						{t("reviewers")}
					</Typography.Title>
					<Typography.Text type="secondary" style={{ marginTop: "5px" }}>
						{t("reviewer-helper")}
					</Typography.Text>
					<Transfer
						dataSource={userItems}
						style={{ marginTop: "10px" }}
						titles={[t("employees"), t("reviewers")]}
						targetKeys={
							performanceToUpdate && !blurred
								? usersReviews.map((u) => u.reviewerId.toString())
								: reviewers
						}
						selectedKeys={selectedEmployees}
						onChange={handleReviewerChoiceChanged}
						onSelectChange={handleSelectEmployeeChanged}
						render={(item) => item.title as string}
						disabled={(!targetUser && !performanceReviewId) || isLoading}
						showSearch={true}
						listStyle={{ width: "300px", height: "400px" }}
						oneWay
					/>
				</Col>
			</Row>
		</Drawer>
	)
}
export default PerformanceReviewCreateOrUpdate
