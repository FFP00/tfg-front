import GameCard from "../GameCard.jsx";

export default function GameGrid({ games, loading, cart, addToCart, removeFromCart }) {
	if (loading) return null;

	if (games.length === 0) {
		return (
			<div className="flex flex-col items-center gap-3 py-24 text-center">
				<p className="text-4xl">🎮</p>
				<p className="text-lg font-semibold text-burnt-text">No hay juegos disponibles</p>
				<p className="text-sm text-burnt-muted">Prueba con otros filtros</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-5 gap-4">
			{games.map((game) => (
				<GameCard
					key={game.name}
					game={game}
					cart={cart}
					addToCart={addToCart}
					removeFromCart={removeFromCart}
				/>
			))}
		</div>
	);
}
