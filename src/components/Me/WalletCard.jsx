import { Link } from "react-router-dom";

export default function WalletCard({ wallet }) {
	const balance = wallet ? parseFloat(wallet.balance) : 0;

	return (
		<div className="rounded-lg border border-burnt-border bg-burnt-card p-5">
			<p className="mb-1 text-xs font-semibold uppercase tracking-widest text-burnt-muted">
				Saldo en wallet
			</p>
			<p className="mb-5 text-4xl font-bold text-burnt-text">${balance.toFixed(2)}</p>
			<div className="flex gap-2">
				<Link
					to="/me/deposit"
					className="flex-1 rounded-md bg-burnt-accent py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-burnt-accent-hover"
				>
					Recargar
				</Link>
				<Link
					to="/me/history"
					className="flex-1 rounded-md border border-burnt-border py-2.5 text-center text-sm font-medium text-burnt-muted transition-colors hover:text-burnt-text"
				>
					Historial
				</Link>
			</div>
		</div>
	);
}
