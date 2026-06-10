import GameCard from "../GameCard.jsx";

export default function TitlesList({ titles }) {
	if (titles.length === 0) {
		return <p className="py-8 text-center text-sm text-burnt-muted">Sin títulos publicados</p>;
	}

	return (
		<div className="grid grid-cols-3 gap-4">
			{titles.map((game) => (
				<GameCard key={game.name} game={game} />
			))}
		</div>
	);
}
