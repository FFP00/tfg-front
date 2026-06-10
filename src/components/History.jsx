import axios from "axios";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TransactionItem from "./History/TransactionItem.jsx";

export default function History() {
	const navigate = useNavigate();
	const token = localStorage.getItem("burnt_token");
	const type = localStorage.getItem("burnt_type");

	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);

	// biome-ignore lint/correctness/useExhaustiveDependencies: mount-only auth redirect
	useEffect(() => {
		if (!token || type !== "customer") {
			navigate("/login");
			return;
		}
		async function load() {
			try {
				const res = await axios.get("/api/transaction/me", {
					headers: { Authorization: `Bearer ${token}` }
				});
				setTransactions(res.data);
			} catch (error) {
				console.error(error);
			}
			setLoading(false);
		}
		load();
	}, []);

	const totalSpent = transactions
		.flatMap((t) => t.titles)
		.reduce((sum, t) => sum + parseFloat(t.price_paid), 0)
		.toFixed(2);

	return (
		<div className="mx-auto max-w-7xl px-4 py-8">
			<div className="mb-6">
				<h1 className="text-lg font-bold text-burnt-text">Historial de compras</h1>
			</div>

			{!loading && transactions.length > 0 && (
				<div className="mb-6 grid grid-cols-3 gap-4">
					<div className="rounded-md border border-burnt-border bg-burnt-card p-4 text-center">
						<p className="text-2xl font-bold text-burnt-text">{transactions.length}</p>
						<p className="text-xs text-burnt-muted">Transacciones</p>
					</div>
					<div className="rounded-md border border-burnt-border bg-burnt-card p-4 text-center">
						<p className="text-2xl font-bold text-burnt-text">
							{transactions.reduce((sum, t) => sum + t.titles.length, 0)}
						</p>
						<p className="text-xs text-burnt-muted">Juegos comprados</p>
					</div>
					<div className="rounded-md border border-burnt-border bg-burnt-card p-4 text-center">
						<p className="text-2xl font-bold text-burnt-text">${totalSpent}</p>
						<p className="text-xs text-burnt-muted">Total gastado</p>
					</div>
				</div>
			)}

			{loading ? (
				<div className="flex justify-center py-20">
					<div className="h-8 w-8 animate-spin rounded-full border-2 border-burnt-border border-t-burnt-accent" />
				</div>
			) : transactions.length === 0 ? (
				<div className="py-20 text-center">
					<ShoppingCart size={56} strokeWidth={1.5} className="mx-auto mb-4 text-burnt-faint" />
					<p className="text-lg font-semibold text-burnt-text">Sin compras todavía</p>
					<p className="mt-1 text-sm text-burnt-muted">
						Explora el{" "}
						<Link to="/" className="text-burnt-accent hover:text-burnt-accent-hover">
							catálogo
						</Link>
					</p>
				</div>
			) : (
				<div className="space-y-3">
					{transactions.map((t) => (
						<TransactionItem key={t.created_at} transaction={t} />
					))}
				</div>
			)}
		</div>
	);
}
