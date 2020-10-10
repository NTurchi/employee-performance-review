import { useTranslation as i18nUseTranslation } from "react-i18next"

/**
 * Symple i18n hooks to get every string shown on the UI
 * @example I want the PayPay Stagg App title -> useTranslation("app")("staff-app")("home").get("title")
 * @param type App / Modules
 */
const useTranslation = (type: string) => (module: string) => (
	component: string
) => {
	const tr = i18nUseTranslation()

	const locales = (key: string, ...args: any) =>
		tr.t(`${type}.${module}.${component}.${key}`, ...args)
	return { ...tr, t: locales }
}
/**
 * Shortcut: Specific to the APP Being used (should be avoid in a real business project)
 */
export const useAppTranslation = useTranslation("app")(
	"paypay-performance-review-manager"
)

export const useI18n = () => i18nUseTranslation()[1]
