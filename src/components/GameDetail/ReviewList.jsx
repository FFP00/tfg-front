import { Pencil, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";

export default function ReviewList({ reviews: rawReviews, setReviews, token, encodedName }) {
	const reviews = [...rawReviews].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

	const [form, setForm] = useState({ content: "", recommends: true });
	const [sending, setSending] = useState(false);
	const [msg, setMsg] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [voteErrors, setVoteErrors] = useState({});

	async function handleVote(customerName) {
		if (!token) return;
		setVoteErrors((prev) => ({ ...prev, [customerName]: null }));
		try {
			const res = await fetch(`/api/title/${encodedName}/reviews/${customerName}/vote`, {
				method: "POST",
				headers: { Authorization: `Bearer ${token}` },
			});
			if (res.ok) {
				const { votes } = await res.json();
				setReviews((prev) =>
					prev.map((r) => (r.customer_name === customerName ? { ...r, votes } : r)),
				);
			} else {
				const data = await res.json();
				setVoteErrors((prev) => ({
					...prev,
					[customerName]: data.detail ?? "No puedes votar esta reseña",
				}));
			}
		} catch {
			setVoteErrors((prev) => ({
				...prev,
				[customerName]: "Error de conexión",
			}));
		}
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setSending(true);
		setMsg(null);
		try {
			const res = await fetch(`/api/title/${encodedName}/reviews`, {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				body: JSON.stringify(form),
			});
			const data = await res.json();
			if (res.status === 201) {
				setMsg({ type: "ok", text: "Reseña enviada. Pendiente de aprobación." });
				setShowForm(false);
				setForm({ content: "", recommends: true });
			} else {
				setMsg({ type: "err", text: data.detail ?? "Error al enviar la reseña" });
			}
		} catch {
			setMsg({ type: "err", text: "Error de conexión. Inténtalo de nuevo." });
		}
		setSending(false);
	}

	return (
		<div>
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-xl font-bold text-burnt-text">
					Reseñas{" "}
					{reviews.length > 0 && (
						<span className="text-base font-normal text-burnt-muted">({reviews.length})</span>
					)}
				</h2>
				{token && !showForm && (
					<button
						type="button"
						onClick={() => setShowForm(true)}
						className="flex items-center gap-1.5 rounded-lg border border-burnt-border px-4 py-2 text-sm font-medium text-burnt-muted transition-colors hover:border-burnt-accent hover:text-burnt-text"
					>
						<Pencil size={16} strokeWidth={1.75} />
						Escribir reseña
					</button>
				)}
			</div>

			{showForm && (
				<form
					onSubmit={handleSubmit}
					className="mb-6 space-y-3 rounded-md border border-burnt-border bg-burnt-card p-4"
				>
					<div className="flex gap-4">
						<label className="flex cursor-pointer items-center gap-2">
							<input
								type="radio"
								name="recommends"
								checked={form.recommends}
								onChange={() => setForm({ ...form, recommends: true })}
								className="accent-burnt-accent"
							/>
							<span className="flex items-center gap-1 text-sm text-burnt-green">
								<ThumbsUp size={16} strokeWidth={1.75} />
								Recomiendo
							</span>
						</label>
						<label className="flex cursor-pointer items-center gap-2">
							<input
								type="radio"
								name="recommends"
								checked={!form.recommends}
								onChange={() => setForm({ ...form, recommends: false })}
								className="accent-burnt-red"
							/>
							<span className="flex items-center gap-1 text-sm text-burnt-red">
								<ThumbsDown size={16} strokeWidth={1.75} />
								No recomiendo
							</span>
						</label>
					</div>
					<textarea
						value={form.content}
						onChange={(e) => setForm({ ...form, content: e.target.value })}
						required
						rows={3}
						placeholder="Comparte tu experiencia con el juego..."
						className="w-full resize-none rounded-lg border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text placeholder-burnt-faint focus:border-burnt-accent focus:outline-none"
					/>
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
							disabled={sending}
							className="rounded-lg bg-burnt-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-burnt-accent-hover disabled:opacity-50"
						>
							{sending ? "Enviando..." : "Publicar reseña"}
						</button>
						<button
							type="button"
							onClick={() => {
								setShowForm(false);
								setMsg(null);
							}}
							className="rounded-lg border border-burnt-border px-4 py-2 text-sm text-burnt-muted transition-colors hover:text-burnt-text"
						>
							Cancelar
						</button>
					</div>
				</form>
			)}

			{msg && !showForm && (
				<p
					className={`mb-4 rounded-lg px-4 py-3 text-sm ${
						msg.type === "ok"
							? "border border-burnt-green/30 bg-burnt-green/10 text-burnt-green"
							: "border border-burnt-red/30 bg-burnt-red/10 text-burnt-red"
					}`}
				>
					{msg.text}
				</p>
			)}

			{reviews.length === 0 ? (
				<p className="py-8 text-center text-sm text-burnt-muted">Sin reseñas todavía</p>
			) : (
				<div className="space-y-3">
					{reviews.map((r) => (
						<div
							key={`${r.customer_name}-${r.created_at}`}
							className="rounded-md border border-burnt-border bg-burnt-card p-4"
						>
							<div className="mb-2 flex items-center justify-between gap-2">
								<span className="text-sm font-semibold text-burnt-text">{r.customer_name}</span>
								<span
									className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
										r.recommends
											? "bg-burnt-green/15 text-burnt-green"
											: "bg-burnt-red/15 text-burnt-red"
									}`}
								>
									{r.recommends ? (
										<ThumbsUp size={12} strokeWidth={1.75} />
									) : (
										<ThumbsDown size={12} strokeWidth={1.75} />
									)}
									{r.recommends ? "Recomienda" : "No recomienda"}
								</span>
							</div>
							<p className="mb-3 text-sm text-burnt-muted">{r.content}</p>
							<div className="flex flex-col gap-1">
								<div className="flex items-center justify-between">
									<span className="text-xs text-burnt-faint">
										{new Date(r.created_at).toLocaleDateString("es-ES")}
									</span>
									{token && (
										<button
											type="button"
											onClick={() => handleVote(r.customer_name)}
											className="flex items-center gap-1.5 rounded-lg border border-burnt-border px-2.5 py-1 text-xs text-burnt-muted transition-colors hover:border-burnt-accent/50 hover:text-burnt-text"
										>
											<ThumbsUp size={14} strokeWidth={1.75} />
											{r.votes} útil{r.votes !== 1 ? "es" : ""}
										</button>
									)}
									{!token && (
										<span className="flex items-center gap-1 text-xs text-burnt-faint">
											<ThumbsUp size={14} strokeWidth={1.75} />
											{r.votes}
										</span>
									)}
								</div>
								{voteErrors[r.customer_name] && (
									<p className="text-right text-xs text-burnt-red">{voteErrors[r.customer_name]}</p>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
