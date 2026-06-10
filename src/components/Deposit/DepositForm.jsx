import axios from "axios";
import { CreditCard } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function DepositForm({ token, onSuccess }) {
	const [amount, setAmount] = useState("10.00");
	const [loading, setLoading] = useState(false);
	const [waiting, setWaiting] = useState(false);
	const [error, setError] = useState(null);
	const pollRef = useRef(null);

	useEffect(() => {
		function onMessage(e) {
			if (e.data?.type === "stripe_success" && e.data.wallet) {
				clearInterval(pollRef.current);
				setWaiting(false);
				onSuccess(e.data.wallet);
			}
		}
		window.addEventListener("message", onMessage);
		return () => window.removeEventListener("message", onMessage);
	}, [onSuccess]);

	async function handleStripe(e) {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const res = await axios.post(
				"/api/stripe/checkout",
				{ amount },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			const data = res.data;

			const popup = window.open(
				data.checkout_url,
				"stripe_checkout",
				"width=520,height=680,scrollbars=yes,resizable=yes,left=400,top=100"
			);

			setLoading(false);
			setWaiting(true);

			pollRef.current = setInterval(() => {
				if (!popup || popup.closed) {
					clearInterval(pollRef.current);
					setWaiting(false);
					return;
				}
				try {
					const path = popup.location?.pathname ?? "";
					if (path.includes("/deposit/success")) {
						const sessionId = new URLSearchParams(popup.location.search).get("session_id");
						clearInterval(pollRef.current);
						popup.close();
						if (sessionId) {
							axios
								.get(`/api/stripe/success?session_id=${sessionId}`, {
									headers: { Authorization: `Bearer ${token}` }
								})
								.then((r) => {
									const wallet = r.data;
									localStorage.setItem("burnt_wallet", JSON.stringify(wallet));
									setWaiting(false);
									onSuccess(wallet);
								})
								.catch(() => setWaiting(false));
						} else {
							setWaiting(false);
						}
					}
				} catch {
					// popup en dominio externo (Stripe), seguir esperando
				}
			}, 600);
		} catch (err) {
			setError(err.response?.data?.detail ?? "Error al iniciar el pago con Stripe");
			setLoading(false);
		}
	}

	const presets = ["5.00", "10.00", "20.00", "50.00"];

	return (
		<div className="space-y-6">
			<div>
				<p className="mb-3 text-sm text-burnt-muted">Cantidad a recargar (USD)</p>
				<div className="mb-3 flex gap-2">
					{presets.map((p) => (
						<button
							key={p}
							type="button"
							onClick={() => setAmount(p)}
							className={`flex-1 rounded-lg border py-2 text-sm font-semibold transition-colors ${
								amount === p
									? "border-burnt-accent bg-burnt-accent text-white"
									: "border-burnt-border bg-burnt-panel text-burnt-muted hover:text-burnt-text"
							}`}
						>
							${p}
						</button>
					))}
				</div>
				<input
					type="number"
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
					min="0.01"
					step="0.01"
					className="w-full rounded-lg border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text focus:border-burnt-accent focus:outline-none"
					placeholder="Cantidad personalizada"
				/>
			</div>

			{error && (
				<p className="rounded-lg border border-burnt-red/30 bg-burnt-red/10 px-4 py-2.5 text-sm text-burnt-red">
					{error}
				</p>
			)}

			{waiting ? (
				<div className="rounded-md border border-burnt-border bg-burnt-panel px-4 py-4 text-center">
					<div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-burnt-border border-t-burnt-accent" />
					<p className="text-sm font-medium text-burnt-text">Esperando confirmación de pago…</p>
					<p className="mt-1 text-xs text-burnt-muted">
						Completa el pago en la ventana de Stripe y vuelve aquí
					</p>
					<button
						type="button"
						onClick={() => setWaiting(false)}
						className="mt-3 text-xs text-burnt-faint underline hover:text-burnt-muted"
					>
						Cancelar
					</button>
				</div>
			) : (
				<button
					type="button"
					onClick={handleStripe}
					disabled={loading}
					className="flex w-full items-center justify-center gap-2 rounded-md bg-burnt-accent py-3 font-semibold text-white transition-colors hover:bg-burnt-accent-hover disabled:opacity-50"
				>
					{loading ? (
						"Iniciando pago…"
					) : (
						<>
							<CreditCard size={16} strokeWidth={1.75} /> Pagar con Stripe
						</>
					)}
				</button>
			)}

			<div className="space-y-1 rounded-md border border-burnt-border bg-burnt-panel px-4 py-3 text-xs text-burnt-faint">
				<p className="font-medium text-burnt-muted">Tarjeta de prueba Stripe:</p>
				<p>
					Número: <span className="font-mono text-burnt-text">4242 4242 4242 4242</span>
				</p>
			</div>
		</div>
	);
}
