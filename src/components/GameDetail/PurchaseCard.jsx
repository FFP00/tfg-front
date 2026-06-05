import { ArrowRight, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice, getCustomerCurrency } from "../../utils/currency";

export default function PurchaseCard({ game, encodedName, token, cart, addToCart, removeFromCart }) {
	const [owned, setOwned] = useState(false);
	const user = JSON.parse(localStorage.getItem("burnt_user") ?? "null");

	useEffect(() => {
		if (!token || !user?.name) return;
		fetch(`/api/customer/${encodeURIComponent(user.name)}/library`)
			.then((r) => (r.ok ? r.json() : []))
			.then((lib) => {
				setOwned(lib.some((t) => t.name === decodeURIComponent(encodedName)));
			})
			.catch(() => {});
	}, [token, user?.name, encodedName]);

	const type = localStorage.getItem("burnt_type");
	const currency = getCustomerCurrency();
	const base = parseFloat(game.release_price);
	const discount = game.actual_discount;
	const finalUsd = discount ? base * (1 - discount / 100) : base;
	const inCart = cart?.some((item) => item.name === game.name);

	function handleCart() {
		if (inCart) removeFromCart?.(game.name);
		else addToCart?.(game);
	}

	if (owned) {
		return (
			<Link
				to={`/game/${encodedName}/owned`}
				className="flex items-center gap-2 rounded-md bg-burnt-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-burnt-accent-hover"
			>
				Ir a mi biblioteca <ArrowRight size={15} strokeWidth={1.75} />
			</Link>
		);
	}

	return (
		<div className="flex items-center gap-3">
			<div className="flex items-center gap-2">
				{discount > 0 && (
					<span className="rounded bg-burnt-accent px-1.5 py-0.5 text-xs font-bold text-white">
						−{discount}%
					</span>
				)}
				<span className="text-xl font-bold text-burnt-text">{formatPrice(finalUsd, currency)}</span>
				{discount > 0 && (
					<span className="text-sm text-burnt-faint line-through">{formatPrice(base, currency)}</span>
				)}
			</div>

			{addToCart ? (
				<button
					type="button"
					onClick={handleCart}
					className={`flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-semibold transition-colors ${
						inCart
							? "border-burnt-accent/40 bg-burnt-accent/10 text-burnt-accent hover:border-burnt-red/40 hover:bg-burnt-red/10 hover:text-burnt-red"
							: "border-burnt-border bg-burnt-card text-burnt-muted hover:border-burnt-accent/50 hover:text-burnt-text"
					}`}
				>
					{inCart ? (
						<>
							<X size={15} strokeWidth={1.75} /> En el carrito
						</>
					) : (
						<>
							<Check size={15} strokeWidth={1.75} /> Añadir al carrito
						</>
					)}
				</button>
			) : type !== "developer" && (
				<Link
					to="/login"
					className="rounded-md border border-burnt-border px-4 py-2.5 text-sm text-burnt-muted transition-colors hover:text-burnt-text"
				>
					Inicia sesión para comprar
				</Link>
			)}
		</div>
	);
}
