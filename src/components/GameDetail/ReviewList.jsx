import { ArrowUp, Pencil, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import AvatarImage from "../ui/AvatarImage";

export default function ReviewList({ reviews: rawReviews, setReviews, token, encodedName, owned }) {
	const reviews = [...rawReviews].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
	const currentUser = JSON.parse(localStorage.getItem("burnt_user") ?? "null")?.name ?? null;

	const [form, setForm] = useState({ content: "", recommends: true });
	const [sending, setSending] = useState(false);
	const [msg, setMsg] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [voteErrors, setVoteErrors] = useState({});
	const [voted, setVoted] = useState(new Set());

	async function handleVote(customerName) {
		if (!token || voted.has(customerName)) return;
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
				setVoted((prev) => new Set(prev).add(customerName));
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
				{token && owned && !showForm && (
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
							className="overflow-hidden rounded-lg border border-burnt-border bg-burnt-card"
						>
							<div className={`h-0.5 w-full ${r.recommends ? "bg-burnt-green" : "bg-burnt-red"}`} />
							<div className="p-4">
								<div className="mb-3 flex items-center justify-between gap-2">
									<div className="flex items-center gap-2.5">
										<div className="h-8 w-8 shrink-0 overflow-hidden rounded-md">
											<AvatarImage
												src={`/api/customer/${encodeURIComponent(r.customer_name)}/image/profile`}
												alt={r.customer_name}
												name={r.customer_name}
											/>
										</div>
										<div>
											<p className="text-sm font-semibold leading-tight text-burnt-text">
												{r.customer_name}
											</p>
											<p className="text-xs text-burnt-faint">
												{new Date(r.created_at).toLocaleDateString("es-ES")}
											</p>
										</div>
									</div>
									<span
										className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
											r.recommends
												? "bg-burnt-green/15 text-burnt-green"
												: "bg-burnt-red/15 text-burnt-red"
										}`}
									>
										{r.recommends ? (
											<ThumbsUp size={11} strokeWidth={1.75} />
										) : (
											<ThumbsDown size={11} strokeWidth={1.75} />
										)}
										{r.recommends ? "Recomienda" : "No recomienda"}
									</span>
								</div>
								<p className="mb-4 text-sm leading-relaxed text-burnt-muted">{r.content}</p>
								<div className="flex items-center gap-3 border-t border-burnt-border/50 pt-3">
									{token && r.customer_name !== currentUser ? (
										<button
											type="button"
											onClick={() => handleVote(r.customer_name)}
											disabled={voted.has(r.customer_name)}
											className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors ${
												voted.has(r.customer_name)
													? "cursor-default border-burnt-green/40 text-burnt-green"
													: "border-burnt-border text-burnt-muted hover:border-burnt-green/40 hover:text-burnt-green"
											}`}
											title={voted.has(r.customer_name) ? "Ya marcaste como útil" : "Marcar como útil"}
										>
											<ArrowUp size={11} strokeWidth={2} />
											{r.votes} útil{r.votes !== 1 ? "es" : ""}
										</button>
									) : (
										<span className="flex items-center gap-1.5 rounded-full border border-burnt-border/50 px-3 py-1 text-xs text-burnt-faint">
											<ArrowUp size={11} strokeWidth={2} />
											{r.votes} útil{r.votes !== 1 ? "es" : ""}
										</span>
									)}
									{voteErrors[r.customer_name] && (
										<p className="ml-auto text-xs text-burnt-red">{voteErrors[r.customer_name]}</p>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
