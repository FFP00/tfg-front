import { useRef, useState } from "react";

const MEDIA_FIELDS = [
	{ id: "capsule", label: "Capsule (miniatura)", required: true },
	{ id: "header", label: "Header (cabecera)", required: true },
	{ id: "store_1", label: "Screenshot 1", required: true },
	{ id: "store_2", label: "Screenshot 2", required: false },
	{ id: "store_3", label: "Screenshot 3", required: false },
	{ id: "store_4", label: "Screenshot 4", required: false },
	{ id: "store_5", label: "Screenshot 5", required: false },
	{ id: "store_6", label: "Screenshot 6", required: false },
	{ id: "trailer", label: "Trailer (mp4)", required: false },
];

export default function MediaUpload({ title, token, onUploaded }) {
	const [files, setFiles] = useState({});
	const [loading, setLoading] = useState(false);
	const [msg, setMsg] = useState(null);
	const [open, setOpen] = useState(false);
	const refs = useRef({});

	function handleFile(field, file) {
		setFiles((prev) => ({ ...prev, [field]: file }));
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);
		setMsg(null);

		const form = new FormData();
		for (const [field, file] of Object.entries(files)) {
			form.append(field, file);
		}

		const upload = async (method) =>
			fetch(`/api/title/${encodeURIComponent(title.name)}/media`, {
				method,
				headers: { Authorization: `Bearer ${token}` },
				body: form,
			});

		let res = await upload("POST");

		if (res.status === 403) {
			res = await upload("PATCH");
		}

		if (res.ok) {
			setMsg({ type: "ok", text: "Multimedia subida correctamente" });
			setFiles({});
			onUploaded();
		} else {
			const data = await res.json();
			setMsg({ type: "err", text: data.detail ?? "Error al subir multimedia" });
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
				Multimedia
			</button>

			{open && (
				<form
					onSubmit={handleSubmit}
					className="mt-3 space-y-3 rounded-md border border-burnt-border bg-burnt-surface p-4"
				>
					<p className="text-xs text-burnt-muted">
						Capsule, Header y Screenshot 1 son obligatorios la primera vez.
					</p>

					{MEDIA_FIELDS.map((field) => (
						<div key={field.id}>
							<label className="mb-1 block text-xs text-burnt-muted">
								{field.label}
								{field.required && <span className="ml-1 text-burnt-red">*</span>}
							</label>
							<div className="flex items-center gap-2">
								<input
									ref={(el) => {
										refs.current[field.id] = el;
									}}
									type="file"
									accept={field.id === "trailer" ? "video/mp4" : "image/*"}
									className="hidden"
									onChange={(e) => e.target.files[0] && handleFile(field.id, e.target.files[0])}
								/>
								<button
									type="button"
									onClick={() => refs.current[field.id]?.click()}
									className="rounded-lg border border-burnt-border bg-burnt-panel px-3 py-1.5 text-xs text-burnt-muted transition-colors hover:border-burnt-accent/50 hover:text-burnt-text"
								>
									{files[field.id] ? files[field.id].name : "Elegir archivo"}
								</button>
							</div>
						</div>
					))}

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
							{loading ? "Subiendo..." : "Subir"}
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
