import { Link } from "react-router-dom";

export default function TransactionItem({ transaction }) {
	const total = transaction.titles.reduce((sum, t) => sum + parseFloat(t.price_paid), 0).toFixed(2);

	return (
		<div className="rounded-md border border-burnt-border bg-burnt-card p-4">
			<div className="mb-3 flex items-center justify-between gap-4">
				<span className="text-xs text-burnt-muted">
					{new Date(transaction.created_at).toLocaleString("es-ES", {
						year: "numeric",
						month: "short",
						day: "numeric",
						hour: "2-digit",
						minute: "2-digit"
					})}
				</span>
				<span className="font-semibold text-burnt-text">${total}</span>
			</div>

			<div className="space-y-2">
				{transaction.titles.map((t) => (
					<div key={t.name} className="flex items-center justify-between gap-4">
						<Link
							to={`/shop/${encodeURIComponent(t.name)}`}
							className="truncate text-sm text-burnt-muted transition-colors hover:text-burnt-accent"
						>
							{t.name}
						</Link>
						<div className="flex shrink-0 items-center gap-2">
							{t.discount_applied > 0 && (
								<span className="rounded bg-burnt-accent px-1.5 py-0.5 text-xs font-bold text-white">
									−{t.discount_applied}%
								</span>
							)}
							<span className="text-sm font-medium text-burnt-text">${t.price_paid}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
