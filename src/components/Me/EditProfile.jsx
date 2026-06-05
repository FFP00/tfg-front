import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function EditProfile({ customer, token, onUpdate }) {
	const [countries, setCountries] = useState([]);
	const [form, setForm] = useState({
		name: customer.name ?? "",
		email: customer.email ?? "",
		password: "",
		country_code: customer.country?.code ?? "",
	});
	const [loading, setLoading] = useState(false);
	const [msg, setMsg] = useState(null);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		fetch("/api/country/")
			.then((r) => r.json())
			.then(setCountries);
	}, []);

	function handleChange(e) {
		setForm({ ...form, [e.target.id]: e.target.value });
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);
		setMsg(null);

		const body = {};
		if (form.name !== customer.name) body.name = form.name;
		if (form.email !== customer.email) body.email = form.email;
		if (form.password) body.password = form.password;
		if (form.country_code !== (customer.country?.code ?? "")) body.country_code = form.country_code;

		if (Object.keys(body).length === 0) {
			setMsg({ type: "err", text: "No hay cambios que guardar" });
			setLoading(false);
			return;
		}

		const res = await fetch("/api/customer/me", {
			method: "PATCH",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
			body: JSON.stringify(body),
		});
		const data = await res.json();

		if (res.ok) {
			localStorage.setItem("burnt_user", JSON.stringify(data));
			setMsg({ type: "ok", text: "Perfil actualizado correctamente" });
			setForm({ ...form, password: "" });
			onUpdate();
		} else {
			setMsg({ type: "err", text: data.detail ?? "Error al actualizar" });
		}
		setLoading(false);
	}

	return (
		<div className="rounded-lg border border-burnt-border bg-burnt-card">
			<button
				type="button"
				onClick={() => setOpen(!open)}
				className="flex w-full items-center justify-between px-5 py-4 text-left"
			>
				<span className="font-semibold text-burnt-text">Editar perfil</span>
				{open ? (
					<ChevronUp size={16} strokeWidth={1.75} className="text-burnt-muted" />
				) : (
					<ChevronDown size={16} strokeWidth={1.75} className="text-burnt-muted" />
				)}
			</button>

			{open && (
				<form
					onSubmit={handleSubmit}
					className="space-y-4 border-t border-burnt-border px-5 pb-5 pt-4"
				>
					<div>
						<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="name">
							Nombre de usuario
						</label>
						<input
							id="name"
							type="text"
							value={form.name}
							onChange={handleChange}
							className="w-full rounded-lg border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text focus:border-burnt-accent focus:outline-none"
						/>
					</div>
					<div>
						<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="email">
							Email
						</label>
						<input
							id="email"
							type="email"
							value={form.email}
							onChange={handleChange}
							className="w-full rounded-lg border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text focus:border-burnt-accent focus:outline-none"
						/>
					</div>
					<div>
						<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="country_code">
							País
						</label>
						<select
							id="country_code"
							value={form.country_code}
							onChange={handleChange}
							className="w-full rounded-lg border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text focus:border-burnt-accent focus:outline-none"
						>
							<option value="">Sin especificar</option>
							{countries.map((c) => (
								<option key={c.code} value={c.code}>
									{c.native_name} ({c.english_name})
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="password">
							Nueva contraseña{" "}
							<span className="text-burnt-faint">(dejar vacío para no cambiar)</span>
						</label>
						<input
							id="password"
							type="password"
							value={form.password}
							onChange={handleChange}
							autoComplete="new-password"
							placeholder="••••••••"
							className="w-full rounded-lg border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text placeholder-burnt-faint focus:border-burnt-accent focus:outline-none"
						/>
					</div>
					{msg && (
						<p
							className={`rounded-lg px-4 py-2.5 text-sm ${
								msg.type === "ok"
									? "border border-burnt-green/30 bg-burnt-green/10 text-burnt-green"
									: "border border-burnt-red/30 bg-burnt-red/10 text-burnt-red"
							}`}
						>
							{msg.text}
						</p>
					)}
					<button
						type="submit"
						disabled={loading}
						className="rounded-lg bg-burnt-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-burnt-accent-hover disabled:opacity-50"
					>
						{loading ? "Guardando..." : "Guardar cambios"}
					</button>
				</form>
			)}
		</div>
	);
}
