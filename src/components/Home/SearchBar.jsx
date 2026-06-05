import { ChevronDown } from "lucide-react";

export default function SearchBar({ search, onSearch, genres, selectedGenre, onGenreChange }) {
	return (
		<div className="mb-8 flex flex-wrap gap-3">
			<input
				type="text"
				value={search}
				onChange={(e) => onSearch(e.target.value)}
				placeholder="Buscar juego..."
				className="min-w-48 flex-1 rounded-md border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text placeholder-burnt-faint focus:border-burnt-accent focus:outline-none"
			/>
			<div className="relative">
				<select
					value={selectedGenre}
					onChange={(e) => onGenreChange(e.target.value)}
					className="appearance-none rounded-md border border-burnt-border bg-burnt-panel pl-4 pr-9 py-2.5 text-sm text-burnt-text focus:border-burnt-accent focus:outline-none"
				>
					<option value="">Todos los géneros</option>
					{genres.map((g) => (
						<option key={g.name} value={g.name}>
							{g.name}
						</option>
					))}
				</select>
				<ChevronDown
					size={14}
					strokeWidth={1.75}
					className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-burnt-faint"
				/>
			</div>
		</div>
	);
}
