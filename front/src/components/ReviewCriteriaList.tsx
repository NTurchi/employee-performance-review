import { List, Rate } from "antd"
import React, { FC, useState } from "react"
import { IUserReviewCriteria } from "../api/userReview"
import { useAppTranslation } from "../hooks"

/**
 * Rate Stars elements
 * @param label Rate label
 * @param value rate value (1 to 5)
 */
const RateResults = (
	onValueChange: (key: number) => (value: number) => void,
	editable: boolean
) => ({ label, value, key }: { label: string; value: number; key: number }) => (
	<List.Item key={key}>
		<List.Item.Meta title={label} />
		<Rate
			onChange={onValueChange(key)}
			value={value}
			disabled={!editable}
		/>
	</List.Item>
)

/**
 * Show a list of critera to evaluate an employee
 */
const ReviewCriteriaList: FC<{
	editable?: boolean
	style?: React.CSSProperties
	review: IUserReviewCriteria
	onChange?: (criteria: IUserReviewCriteria) => void
}> = ({ review, editable, style, onChange }) => {
	// HOOKS
	const { t } = useAppTranslation("components-review-criteria-list")

	const evaluationCriteriaPropsLabel: Array<[
		keyof IUserReviewCriteria,
		string
	]> = [
		["qualityOfWork", t("work-quality")],
		["productivity", t("productivity")],
		["meetDeadline", t("deadline")],
		["knowledge", t("knowledge")],
		["communication", t("communication")],
	]
	const [rateState, setRateState] = useState<number[]>(
		evaluationCriteriaPropsLabel.map(([key, _]) => review[key])
	)

	/**
	 *
	 * @param index index of the critera in {evaluationCriteriaPropsLabel} state variable
	 * @param value new value for this criteria
	 */
	const updateRateState = (index: number) => (value: number) => {
		const newRateState = [...rateState]
		newRateState[index] = value
		setRateState(newRateState)
		onChange &&
			onChange(
				evaluationCriteriaPropsLabel.reduce<IUserReviewCriteria>( // make a new IReviewCriteria object with the new critera values
					(newReviewC, [key, _], index) => {
						newReviewC[key] = rateState[index]
						return newReviewC
					},
					{ ...review }
				)
			)
	}

	return (
		<List
			style={style}
			itemLayout="horizontal"
			dataSource={evaluationCriteriaPropsLabel.map(([_, label], key) => ({
				label,
				value: rateState[key] as number,
				key,
			}))}
			renderItem={RateResults(updateRateState, !!editable)}
		></List>
	)
}
export default ReviewCriteriaList
