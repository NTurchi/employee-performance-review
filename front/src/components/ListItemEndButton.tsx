import { EditOutlined, DeleteOutlined, MoreOutlined } from "@ant-design/icons"
import { Button, Tooltip } from "antd"
import React, { FC } from "react"
import { useAppTranslation } from "../hooks/useTranslation"

type ListItemEndButtonType = "EDIT" | "DELETE" | "DETAILS"

/**
 * Simple icon button for editing / delete / show detail of one ressource in a list
 *
 * @param param0
 */
const ListItemEndButton: FC<{
	onClick?: () => void
	buttonType: ListItemEndButtonType
}> = ({ onClick, buttonType }) => {
	const { t } = useAppTranslation("common")
	const [title, icon] = {
		EDIT: [t("edit"), <EditOutlined />],
		DELETE: [t("delete"), <DeleteOutlined />],
		DETAILS: [t("details"), <MoreOutlined />],
	}[buttonType]

	return (
		<Tooltip title={title} placement={"topRight"}>
			<Button
				key="2"
				shape="circle"
				type="primary"
				onClick={onClick}
				icon={icon}
			/>
		</Tooltip>
	)
}

export default ListItemEndButton
