import React, { FC, useEffect } from "react"
import { Button, Form, Input, Typography, Select, message } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"

import { Layout } from "antd"

import "./styles/Login.less"
import { login } from "../state/ducks/session"
import { useAppTranslation, useFetchStatus, useSession } from "../hooks"
import { useDispatch } from "react-redux"
import { RouteComponentProps } from "@reach/router"
import { useTranslation } from "react-i18next"

const { Content } = Layout
const { Title } = Typography

interface ILoginPageProps {
	onLoginSucceed: () => void
}

const Login: FC<RouteComponentProps & ILoginPageProps> = ({
	onLoginSucceed,
}) => {
	const t = useAppTranslation("login").t
	const dispatch = useDispatch()
	const appIsFetching = useFetchStatus()
	const session = useSession()
	const i18n = useTranslation()[1]

	const onLogin = (loginValues: { username: string; password: string }) =>
		dispatch(login(loginValues))

	useEffect(() => {
		// this is straightforward way. Should be more sophisticated for real world app
		if (session.userMetadata) {
			onLoginSucceed()
		}
	}, [session, onLoginSucceed])

	const onLanguageChange = (language: string) => {
		if (language !== i18n.language) {
			i18n.changeLanguage(language).then((tr) =>
				message.success(
					tr(
						"app.paypay-performance-review-manager.common.language-changed"
					)
				)
			)
		}
	}

	return (
		<Layout className="Login">
			<Select
				className="Login-language"
				placeholder="Language"
				onChange={onLanguageChange}
				optionLabelProp="label"
			>
				<Select.Option value="jp" label="Japanese">
					<div>
						<span role="img" aria-label="Japanese">
							🇯🇵
							{"  "}
						</span>
						Japanese (日本)
					</div>
				</Select.Option>
				<Select.Option value="en" label="English">
					<div>
						<span role="img" aria-label="English">
							🇺🇸
							{"  "}
						</span>
						English (美国)
					</div>
				</Select.Option>
			</Select>
			<Content>
				<Title level={3} className="Login-title Login__center">
					{t("title")}
				</Title>
				<Form name="login" onFinish={onLogin}>
					<Form.Item
						name="username"
						rules={[
							{
								required: true,
								message: t("usernameEmpty"),
							},
						]}
					>
						<Input
							placeholder={t("username")}
							prefix={
								<UserOutlined className="site-form-item-icon" />
							}
						/>
					</Form.Item>

					<Form.Item
						name="password"
						rules={[
							{
								required: true,
								message: t("passwordEmpty"),
							},
						]}
					>
						<Input.Password
							prefix={
								<LockOutlined className="site-form-item-icon" />
							}
							placeholder={t("password")}
						/>
					</Form.Item>
					<Form.Item>
						<Button
							type="primary"
							className="Login__fullWidth"
							htmlType="submit"
							loading={appIsFetching}
						>
							{t("loginButton")}
						</Button>
					</Form.Item>
				</Form>
			</Content>
		</Layout>
	)
}

export default Login
