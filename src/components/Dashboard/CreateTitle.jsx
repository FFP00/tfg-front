import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function CreateTitle({ token, onCreated }) {
	const [form, setForm] = useState({
		name: "",
		release_date: "",
		release_price: "",
		actual_discount: "0",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [open, setOpen] = useState(false);

	function handleChange(e) {
		setForm({ ...form, [e.target.id]: e.target.value });
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		const res = await fetch("/api/title/", {
			method: "POST",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
			body: JSON.stringify({
				name: form.name,
				release_date: form.release_date,
				release_price: form.release_price,
				actual_discount: parseInt(form.actual_discount, 10),
			}),
		});
		const data = await res.json();
		if (res.status === 201) {
			setForm({ name: "", release_date: "", release_price: "", actual_discount: "0" });
			setOpen(false);
			onCreated(data);
		} else {
			setError(data.detail ?? "Error al crear el título");
		}
		setLoading(false);
	}

	return (
		<div className="rounded-lg border border-burnt-border bg-burnt-card">
			<button
				type="button"
				onClick={() => setOpen(!open)}
				className="flex w-full items-center justify-between px-5 py-4"
			>
				<span className="font-semibold text-burnt-text">+ Crear nuevo título</span>
				{open ? (
					<ChevronUp size={16} strokeWidth={1.75} className="text-burnt-muted" />
				) : (
					<ChevronDown size={16} strokeWidth={1.75} className="text-burnt-muted" />
				)}
			</button>

			{open && (
				<form
					onSubmit={handleSubmit}
					className="border-t border-burnt-border px-5 pb-5 pt-4 space-y-4"
				>
					<div>
						<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="name">
							Nombre del juego
						</label>
						<input
							id="name"
							type="text"
							value={form.name}
							onChange={handleChange}
							required
							placeholder="Título del juego"
							className="w-full rounded-lg border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text placeholder-burnt-faint focus:border-burnt-accent focus:outline-none"
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="release_date">
								Fecha de lanzamiento
							</label>
							<input
								id="release_date"
								type="date"
								value={form.release_date}
								onChange={handleChange}
								required
								className="w-full rounded-lg border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text focus:border-burnt-accent focus:outline-none"
							/>
						</div>
						<div>
							<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="release_price">
								Precio base (USD)
							</label>
							<input
								id="release_price"
								type="number"
								min="0"
								step="0.01"
								value={form.release_price}
								onChange={handleChange}
								required
								placeholder="0.00"
								className="w-full rounded-lg border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text placeholder-burnt-faint focus:border-burnt-accent focus:outline-none"
							/>
						</div>
					</div>
					<div>
						<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="actual_discount">
							Descuento inicial (0–100%)
						</label>
						<input
							id="actual_discount"
							type="number"
							min="0"
							max="100"
							value={form.actual_discount}
							onChange={handleChange}
							className="w-full rounded-lg border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text focus:border-burnt-accent focus:outline-none"
						/>
					</div>
					{error && (
						<p className="rounded-lg border border-burnt-red/30 bg-burnt-red/10 px-4 py-2.5 text-sm text-burnt-red">
							{error}
						</p>
					)}
					<div className="flex gap-2">
						<button
							type="submit"
							disabled={loading}
							className="rounded-lg bg-burnt-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-burnt-accent-hover disabled:opacity-50"
						>
							{loading ? "Creando..." : "Crear título"}
						</button>
						<button
							type="button"
							onClick={() => setOpen(false)}
							className="rounded-lg border border-burnt-border px-5 py-2.5 text-sm text-burnt-muted transition-colors hover:text-burnt-text"
						>
							Cancelar
						</button>
					</div>
					<p className="text-xs text-burnt-faint">
						El título quedará pendiente de aprobación del administrador.
					</p>
				</form>
			)}
		</div>
	);
}
