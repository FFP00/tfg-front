import axios from "axios";
import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function Contact() {
	const token = localStorage.getItem("burnt_token");

	const [textarea, setTextarea] = useState("");
	const [loading, setLoading] = useState(false);
	const [msg, setMsg] = useState(null);

	if (!token) return <Navigate replace to="/login" />;

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);
		setMsg(null);

		try {
			const res = await axios.post(
				"/api/contact/",
				{ textarea },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			if (res.status === 201) {
				setMsg({ type: "ok", text: res.data.detail ?? "Mensaje enviado correctamente." });
				setTextarea("");
			}
		} catch (err) {
			setMsg({ type: "err", text: err.response?.data?.detail ?? "Error al enviar el mensaje." });
		}
		setLoading(false);
	}

	return (
		<div className="mx-auto max-w-xl px-4 py-16">
			<div className="mb-10 text-center">
				<p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-burnt-accent">
					Contacto
				</p>
				<h1 className="text-4xl font-bold tracking-tight text-burnt-text">Escríbenos</h1>
				<p className="mt-3 text-sm leading-relaxed text-burnt-muted">
					¿Tienes alguna pregunta, sugerencia o incidencia? Cuéntanoslo.
				</p>
			</div>

			{msg?.type === "ok" ? (
				<div className="rounded-lg border border-burnt-green/30 bg-burnt-card p-8 text-center">
					<p className="mb-2 text-3xl">✓</p>
					<p className="text-lg font-bold text-burnt-green">¡Mensaje enviado!</p>
					<p className="mt-2 text-sm text-burnt-muted">{msg.text}</p>
					<button
						type="button"
						onClick={() => setMsg(null)}
						className="mt-6 rounded-md border border-burnt-border px-5 py-2.5 text-sm text-burnt-muted transition-colors hover:text-burnt-text"
					>
						Enviar otro mensaje
					</button>
				</div>
			) : (
				<form
					onSubmit={handleSubmit}
					className="rounded-lg border border-burnt-border bg-burnt-card p-6"
				>
					<div className="mb-4">
						<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="textarea">
							Mensaje
						</label>
						<textarea
							id="textarea"
							value={textarea}
							onChange={(e) => setTextarea(e.target.value)}
							required
							rows={6}
							placeholder="Describe tu consulta o problema con el máximo detalle posible..."
							className="w-full resize-none rounded-lg border border-burnt-border bg-burnt-panel px-4 py-3 text-sm text-burnt-text placeholder-burnt-faint focus:border-burnt-accent focus:outline-none"
						/>
					</div>

					{msg?.type === "err" && (
						<p className="mb-4 rounded-lg border border-burnt-red/30 bg-burnt-red/10 px-4 py-2.5 text-sm text-burnt-red">
							{msg.text}
						</p>
					)}

					<button
						type="submit"
						disabled={loading || !textarea.trim()}
						className="w-full rounded-md bg-burnt-accent py-3 font-semibold text-white transition-colors hover:bg-burnt-accent-hover disabled:opacity-50"
					>
						{loading ? "Enviando..." : "Enviar mensaje"}
					</button>
				</form>
			)}
		</div>
	);
}
