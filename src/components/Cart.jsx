import axios from "axios";
import { Check, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Cart({ cart, removeFromCart, clearCart }) {
	const navigate = useNavigate();
	const token = localStorage.getItem("burnt_token");
	const type = localStorage.getItem("burnt_type");
	const wallet = JSON.parse(localStorage.getItem("burnt_wallet") ?? "null");

	const [loading, setLoading] = useState(false);
	const [msg, setMsg] = useState(null);

	const total = cart.reduce((sum, item) => sum + parseFloat(item.price ?? 0), 0).toFixed(2);

	const balance = wallet ? parseFloat(wallet.balance) : null;
	const canAfford = balance !== null && balance >= parseFloat(total);

	async function handleCheckout() {
		if (!token || type !== "customer") {
			navigate("/login");
			return;
		}
		setLoading(true);
		setMsg(null);
		try {
			const res = await axios.post(
				"/api/transaction/",
				{ titles: cart.map((item) => item.name) },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			const data = res.data;
			const w = JSON.parse(localStorage.getItem("burnt_wallet") ?? "null");
			if (w) {
				w.balance = data.wallet_balance;
				localStorage.setItem("burnt_wallet", JSON.stringify(w));
			}
			setMsg({
				type: "ok",
				text: `${data.titles_purchased} juego${data.titles_purchased !== 1 ? "s" : ""} por $${parseFloat(data.total_spent).toFixed(2)}. Saldo restante: $${parseFloat(data.wallet_balance).toFixed(2)}`
			});
			clearCart();
		} catch (error) {
			setMsg({ type: "err", text: error.response?.data?.detail ?? "Error al procesar la compra" });
		}
		setLoading(false);
	}

	if (cart.length === 0 && msg?.type !== "ok") {
		return (
			<div className="mx-auto max-w-7xl px-4 py-20 text-center">
				<ShoppingCart size={56} strokeWidth={1.5} className="mx-auto mb-4 text-burnt-faint" />
				<h1 className="mb-2 text-2xl font-bold text-burnt-text">Tu carrito está vacío</h1>
				<p className="mb-8 text-sm text-burnt-muted">
					Explora el catálogo y añade los juegos que te interesen.
				</p>
				<Link
					to="/"
					className="inline-block rounded-md bg-burnt-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-burnt-accent-hover"
				>
					Ir a la tienda
				</Link>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-7xl px-4 py-8">
			<h1 className="mb-6 text-2xl font-bold tracking-tight text-burnt-text">Carrito</h1>

			{msg?.type === "ok" ? (
				<div className="rounded-lg border border-burnt-green/30 bg-burnt-card p-8 text-center">
					<Check size={48} strokeWidth={1.5} className="mx-auto mb-3 text-burnt-green" />
					<h2 className="mb-2 text-xl font-bold text-burnt-green">¡Compra completada!</h2>
					<p className="mb-6 text-sm text-burnt-muted">{msg.text}</p>
					<div className="flex gap-3">
						<Link
							to="/library"
							className="flex-1 rounded-md bg-burnt-accent py-3 text-center font-semibold text-white transition-colors hover:bg-burnt-accent-hover"
						>
							Ver mi biblioteca
						</Link>
						<Link
							to="/"
							className="flex-1 rounded-md border border-burnt-border py-3 text-center text-sm font-medium text-burnt-muted transition-colors hover:text-burnt-text"
						>
							Seguir comprando
						</Link>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-4 gap-6">
					<div className="col-span-3 space-y-4">
						{cart.map((item) => (
							<div
								key={item.name}
								className="flex items-center gap-6 rounded-md border border-burnt-border bg-burnt-card p-5"
							>
								<div className="aspect-2/3 w-20 flex-none overflow-hidden rounded-md bg-burnt-panel">
									<img
										src={`/api/title/${encodeURIComponent(item.name)}/media/capsule`}
										alt={item.name}
										loading="lazy"
										className="h-full w-full object-cover"
										onError={(e) => {
											e.target.style.display = "none";
										}}
									/>
								</div>
								<div className="min-w-0 flex-1">
									<Link
										to={`/shop/${encodeURIComponent(item.name)}`}
										className="block truncate text-base font-semibold text-burnt-text transition-colors hover:text-burnt-accent"
									>
										{item.name}
									</Link>
									<p className="mt-1 text-sm font-bold text-burnt-text">
										${parseFloat(item.price ?? 0).toFixed(2)}
									</p>
								</div>
								<button
									type="button"
									onClick={() => removeFromCart(item.name)}
									title="Quitar del carrito"
									className="flex-none rounded-lg border border-burnt-border p-2.5 text-burnt-muted transition-colors hover:border-burnt-red/40 hover:text-burnt-red"
								>
									<X size={18} strokeWidth={1.75} />
								</button>
							</div>
						))}
					</div>

					<div className="col-span-1">
						<div className="rounded-lg border border-burnt-border bg-burnt-card p-5">
							<p className="mb-1 text-xs font-semibold uppercase tracking-widest text-burnt-muted">
								Resumen
							</p>
							<div className="my-4 flex items-center justify-between border-t border-burnt-border pt-4">
								<span className="text-sm text-burnt-muted">Total</span>
								<span className="text-2xl font-bold text-burnt-text">${total}</span>
							</div>

							{balance !== null && (
								<div className="mb-4 flex items-center justify-between text-xs">
									<span className="text-burnt-muted">Tu saldo</span>
									<span className={canAfford ? "text-burnt-green" : "text-burnt-red"}>
										${balance.toFixed(2)}
									</span>
								</div>
							)}

							{msg?.type === "err" && (
								<p className="mb-3 rounded-lg border border-burnt-red/30 bg-burnt-red/10 px-3 py-2.5 text-sm text-burnt-red">
									{msg.text}
								</p>
							)}

							{!token ? (
								<Link
									to="/login"
									className="block w-full rounded-md bg-burnt-accent py-3 text-center font-semibold text-white transition-colors hover:bg-burnt-accent-hover"
								>
									Iniciar sesión para comprar
								</Link>
							) : type !== "customer" ? (
								<p className="text-center text-sm text-burnt-muted">
									Solo los jugadores pueden comprar juegos.
								</p>
							) : (
								<>
									<button
										type="button"
										onClick={handleCheckout}
										disabled={loading}
										className="w-full rounded-md bg-burnt-accent py-3 font-semibold text-white transition-colors hover:bg-burnt-accent-hover disabled:opacity-50"
									>
										{loading ? "Procesando..." : "Confirmar compra"}
									</button>
									{!canAfford && balance !== null && (
										<div className="mt-3 text-center">
											<p className="mb-2 text-xs text-burnt-red">Saldo insuficiente</p>
											<Link
												to="/deposit"
												className="text-xs font-medium text-burnt-accent hover:text-burnt-accent-hover"
											>
												Recargar saldo →
											</Link>
										</div>
									)}
								</>
							)}

							<button
								type="button"
								onClick={clearCart}
								className="mt-3 w-full rounded-lg py-2 text-xs text-burnt-faint transition-colors hover:text-burnt-muted"
							>
								Vaciar carrito
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
