export const formatDate = (date: string): string =>
	Intl.DateTimeFormat(navigator.language, {
		weekday: "long",
		month: "long",
		day: "numeric",
	}).format(Date.parse(date))

export const formatWithHours = (date: string): string =>
	Intl.DateTimeFormat(navigator.language, {
		weekday: "long",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	}).format(Date.parse(date))
