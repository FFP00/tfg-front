// Tasas aproximadas respecto al USD (solo para display, no operaciones financieras)
const RATES = {
	USD: 1,
	EUR: 0.92,
	GBP: 0.79,
	JPY: 149.5,
	CAD: 1.36,
	AUD: 1.53,
	CHF: 0.89,
	CNY: 7.24,
	BRL: 4.97,
	MXN: 17.2,
	KRW: 1325,
	INR: 83.1,
	RUB: 91.5,
	SEK: 10.4,
	NOK: 10.6,
	DKK: 6.88,
	PLN: 3.98,
	CZK: 22.7,
	HUF: 358,
	RON: 4.57,
	BGN: 1.8,
	HRK: 6.93,
	TRY: 30.4,
	ARS: 853,
	CLP: 943,
	COP: 3950,
	PEN: 3.72,
	UYU: 39.2,
	VEF: 36.2,
	ZAR: 18.6,
	EGP: 30.9,
	MAD: 10.05,
	NGN: 1480,
	KES: 135,
	ILS: 3.67,
	SAR: 3.75,
	AED: 3.67,
	QAR: 3.64,
	KWD: 0.307,
	BHD: 0.376,
	OMR: 0.385,
	JOD: 0.709,
	HKD: 7.82,
	SGD: 1.34,
	TWD: 31.9,
	THB: 35.1,
	MYR: 4.67,
	IDR: 15680,
	PHP: 56.4,
	VND: 24500,
	PKR: 278,
	BDT: 110,
	NZD: 1.62,
};

export function formatPrice(usdAmount, currencyCode) {
	const code = currencyCode ?? "USD";
	const rate = RATES[code] ?? 1;
	const converted = parseFloat(usdAmount) * rate;

	try {
		return new Intl.NumberFormat(undefined, {
			style: "currency",
			currency: code,
			minimumFractionDigits: 2,
			maximumFractionDigits: code === "JPY" || code === "KRW" ? 0 : 2,
		}).format(converted);
	} catch {
		return `$${parseFloat(usdAmount).toFixed(2)}`;
	}
}

export function getCustomerCurrency() {
	const user = JSON.parse(localStorage.getItem("burnt_user") ?? "null");
	return user?.country?.currency?.code ?? "USD";
}
