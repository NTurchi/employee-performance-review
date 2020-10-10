import React, { FC, useState } from "react"
import { Button, Drawer, Row, Col, Select, Form, Input, Popconfirm } from "antd"
import { useAppTranslation } from "../hooks/useTranslation"
import { useFetchStatus } from "../hooks"
import { useSelector } from "react-redux"
import AppState from "../state"
import { IUser, updateUser, createUser } from "../state/ducks/users"

import useReduxDispatch from "../hooks/useReduxDispatch"
import { message } from "antd"
import { Roles } from "../api/users"

const BasicFormItem: FC<{ element: string; name: string }> = ({
	element,
	name,
}: {
	element: string
	name: string
}) => {
	const { t } = useAppTranslation("user-creation-update")
	return (
		<Form.Item
			name={name}
			label={t(element)}
			rules={[
				{
					required: true,
					message: t(`${element}-error`),
					whitespace: true,
				},
			]}
		>
			<Input />
		</Form.Item>
	)
}

/**
 * Admin view for creating / update users
 */
const UserCreateOrUpdate: FC<{
	onClose: () => void
	userId?: number
}> = ({ userId, onClose }) => {
	const userToUpdate = useSelector<AppState, IUser[]>(
		(s) => s.users
	).find((u) => (userId ? u.id === userId : false))

	// HOOKS
	const screenType = userId ? "update" : "creation"
	const isLoading = useFetchStatus()
	const [form] = Form.useForm()
	const dispatch = useReduxDispatch()
	const defaultUserFormValues = {
		mail: userToUpdate?.mail || "",
		firstName: userToUpdate?.firstName || "",
		lastName: userToUpdate?.lastName || "",
		department: userToUpdate?.department || "",
		id: 0,
		roles: userToUpdate?.roles || [Roles.EMPLOYEE],
	}
	const [formValues, setFormValues] = useState(
		userId
			? defaultUserFormValues
			: { ...defaultUserFormValues, password: "" }
	)

	const { t } = useAppTranslation("user-creation-update")

	const onModifierButtonClicked = ({
		firstName,
		mail,
		password,
		lastName,
		department,
		roles,
	}: IUser & { password: string }) => {
		// UPDATE OR CREATION ?
		const makeTheRequest = () => {
			if (userToUpdate) {
				return dispatch(
					updateUser(userToUpdate.id, {
						firstName,
						mail,
						lastName,
						department,
						roles,
					})
				)
			} else {
				return dispatch(
					createUser({
						firstName,
						mail,
						password,
						lastName,
						department,
						roles,
					})
				)
			}
		}

		makeTheRequest().then(() => {
			message.success(t(`${screenType}-success-message`))
			onClose()
		})
	}

	return (
		<Drawer
			width={640}
			closable={true}
			title={t(`${screenType}-title`)}
			visible={true}
			onClose={onClose}
			footer={
				<div
					style={{
						textAlign: "right",
					}}
				>
					<Popconfirm
						title={t(`${screenType}-confirm-title`)}
						onConfirm={() => form.submit()}
						okText={t("confirm")}
						cancelText={t("cancel")}
						placement="topRight"
					>
						<Button
							disabled={
								isLoading || formValues?.roles?.length === 0
							}
							type="primary"
							loading={isLoading}
						>
							{t(`${screenType}-button`)}
						</Button>
					</Popconfirm>
				</div>
			}
		>
			<Row>
				<Col span={24}>
					<Form
						layout="vertical"
						onValuesChange={(val) => {
							console.log(val)
							return setFormValues({ ...val, formValues })
						}}
						form={form}
						name="register-or-update"
						onFinish={onModifierButtonClicked}
						initialValues={defaultUserFormValues}
					>
						<BasicFormItem element="first-name" name="firstName" />
						<BasicFormItem element="last-name" name="lastName" />
						<Form.Item
							name="mail"
							label={t("mail")}
							rules={[
								{
									type: "email",
									message: t("mail-error"),
								},
								{
									required: true,
									message: t("mail-error"),
								},
							]}
						>
							<Input />
						</Form.Item>
						{!userToUpdate && (
							<>
								<Form.Item
									name="password"
									label="Password"
									rules={[
										{
											required: true,
											message: t("password-error"),
										},
										{
											pattern: new RegExp(
												"^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})"
											),
											message: t("password-rule-error"),
										},
									]}
									hasFeedback
								>
									<Input.Password />
								</Form.Item>

								<Form.Item
									name="confirm"
									label={t("password-confirm")}
									dependencies={["password"]}
									hasFeedback
									rules={[
										{
											required: true,
											message: t(
												"password-confirmation-error"
											),
										},
										({ getFieldValue }) => ({
											validator(_, value) {
												if (
													!value ||
													getFieldValue(
														"password"
													) === value
												) {
													return Promise.resolve()
												}
												return Promise.reject(
													t(
														"password-confirmation-error"
													)
												)
											},
										}),
									]}
								>
									<Input.Password />
								</Form.Item>
							</> // password
						)}
						<BasicFormItem element="department" name="department" />
						<Form.Item
							name="roles"
							label={t("roles")}
							rules={[
								{
									required: true,
									message: t("roles-error"),
								},
							]}
						>
							<Select mode="multiple" allowClear>
								<Select.Option value={Roles.EMPLOYEE}>
									{t("role-employee")}
								</Select.Option>
								<Select.Option value={Roles.ADMIN}>
									{t("role-admin")}
								</Select.Option>
							</Select>
						</Form.Item>
					</Form>
				</Col>
			</Row>
		</Drawer>
	)
}
export default UserCreateOrUpdate
