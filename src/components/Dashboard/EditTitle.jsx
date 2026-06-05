import { useState } from "react";

export default function EditTitle({ title, genres, token, onUpdated }) {
	const [discount, setDiscount] = useState(String(title.actual_discount));
	const [selectedGenres, setSelectedGenres] = useState(title.genres.map((g) => g.name));
	const [loading, setLoading] = useState(false);
	const [msg, setMsg] = useState(null);
	const [open, setOpen] = useState(false);

	function toggleGenre(name) {
		setSelectedGenres((prev) =>
			prev.includes(name) ? prev.filter((g) => g !== name) : [...prev, name],
		);
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);
		setMsg(null);
		const res = await fetch(`/api/title/${encodeURIComponent(title.name)}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
			body: JSON.stringify({
				actual_discount: parseInt(discount, 10),
				genres: selectedGenres,
			}),
		});
		const data = await res.json();
		if (res.ok) {
			setMsg({ type: "ok", text: "Actualizado correctamente" });
			onUpdated(data);
		} else {
			setMsg({ type: "err", text: data.detail ?? "Error al actualizar" });
		}
		setLoading(false);
	}

	return (
		<div>
			<button
				type="button"
				onClick={() => setOpen(!open)}
				className="rounded-lg border border-burnt-border px-3 py-1.5 text-xs font-medium text-burnt-muted transition-colors hover:border-burnt-accent/50 hover:text-burnt-text"
			>
				Editar
			</button>

			{open && (
				<form
					onSubmit={handleSubmit}
					className="mt-3 space-y-4 rounded-md border border-burnt-border bg-burnt-surface p-4"
				>
					<div>
						<label className="mb-1.5 block text-sm text-burnt-muted">Descuento (0–100%)</label>
						<input
							type="number"
							min="0"
							max="100"
							value={discount}
							onChange={(e) => setDiscount(e.target.value)}
							className="w-full rounded-lg border border-burnt-border bg-burnt-panel px-4 py-2 text-sm text-burnt-text focus:border-burnt-accent focus:outline-none"
						/>
					</div>

					<div>
						<p className="mb-2 text-sm text-burnt-muted">Géneros</p>
						<div className="flex flex-wrap gap-2">
							{genres.map((g) => (
								<button
									key={g.name}
									type="button"
									onClick={() => toggleGenre(g.name)}
									className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
										selectedGenres.includes(g.name)
											? "border-burnt-accent bg-burnt-accent text-white"
											: "border-burnt-border text-burnt-muted hover:text-burnt-text"
									}`}
								>
									{g.name}
								</button>
							))}
						</div>
					</div>

					{msg && (
						<p
							className={`rounded-lg px-3 py-2 text-sm ${
								msg.type === "ok"
									? "border border-burnt-green/30 bg-burnt-green/10 text-burnt-green"
									: "border border-burnt-red/30 bg-burnt-red/10 text-burnt-red"
							}`}
						>
							{msg.text}
						</p>
					)}

					<div className="flex gap-2">
						<button
							type="submit"
							disabled={loading}
							className="rounded-lg bg-burnt-accent px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-burnt-accent-hover disabled:opacity-50"
						>
							{loading ? "Guardando..." : "Guardar"}
						</button>
						<button
							type="button"
							onClick={() => setOpen(false)}
							className="rounded-lg border border-burnt-border px-4 py-2 text-xs text-burnt-muted transition-colors hover:text-burnt-text"
						>
							Cancelar
						</button>
					</div>
				</form>
			)}
		</div>
	);
}
