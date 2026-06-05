import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DepositForm from "./Deposit/DepositForm";

export default function Deposit() {
	const navigate = useNavigate();
	const token = localStorage.getItem("burnt_token");
	const type = localStorage.getItem("burnt_type");
	const [wallet, setWallet] = useState(JSON.parse(localStorage.getItem("burnt_wallet") ?? "null"));
	const [success, setSuccess] = useState(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: mount-only auth redirect
	useEffect(() => {
		if (!token || type !== "customer") {
			navigate("/login");
		}
	}, []);

	function handleSuccess(newWallet) {
		setWallet(newWallet);
		setSuccess(parseFloat(newWallet.balance).toFixed(2));
	}

	return (
		<div className="mx-auto max-w-7xl px-4 py-8">
			<div className="mb-6">
				<h1 className="text-lg font-bold text-burnt-text">Recargar saldo</h1>
			</div>

			<div className="mb-6 rounded-lg border border-burnt-border bg-burnt-card p-5">
				<p className="mb-1 text-xs font-semibold uppercase tracking-widest text-burnt-muted">
					Saldo actual
				</p>
				<p className="text-3xl font-bold text-burnt-text">
					${wallet ? parseFloat(wallet.balance).toFixed(2) : "0.00"}
				</p>
			</div>

			{success ? (
				<div className="rounded-lg border border-burnt-green/30 bg-burnt-green/10 p-6 text-center">
					<p className="mb-2 text-3xl">✓</p>
					<p className="mb-1 text-lg font-bold text-burnt-green">¡Recarga completada!</p>
					<p className="mb-5 text-sm text-burnt-muted">
						Nuevo saldo: <span className="font-semibold text-burnt-text">${success}</span>
					</p>
					<div className="flex gap-3">
						<Link
							to="/"
							className="flex-1 rounded-md border border-burnt-border py-2.5 text-center text-sm font-medium text-burnt-muted transition-colors hover:text-burnt-text"
						>
							Ir al catálogo
						</Link>
						<button
							type="button"
							onClick={() => setSuccess(null)}
							className="flex-1 rounded-md bg-burnt-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-burnt-accent-hover"
						>
							Recargar más
						</button>
					</div>
				</div>
			) : (
				<div className="rounded-lg border border-burnt-border bg-burnt-card p-6">
					<DepositForm token={token} onSuccess={handleSuccess} />
				</div>
			)}
		</div>
	);
}
