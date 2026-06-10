import axios from "axios";
import { Check, ChevronLeft, ChevronRight, ImagePlus, Play, RefreshCw, Video } from "lucide-react";
import { useRef, useState } from "react";
import AuthImage from "../ui/AuthImage.jsx";

const STORE_FIELDS = ["store_1", "store_2", "store_3", "store_4", "store_5", "store_6"];
const ALL_MEDIA = [...STORE_FIELDS, "trailer"];

function fileUrl(file) {
	return file ? URL.createObjectURL(file) : null;
}

export default function CreateTitle({ token, genres = [], onCreated, editTitle = null }) {
	const headerRef = useRef(null);
	const capsuleRef = useRef(null);
	const trailerRef = useRef(null);
	const storeRefs = {
		store_1: useRef(null),
		store_2: useRef(null),
		store_3: useRef(null),
		store_4: useRef(null),
		store_5: useRef(null),
		store_6: useRef(null)
	};

	const [form, setForm] = useState(
		editTitle
			? {
					name: editTitle.name,
					release_date: editTitle.release_date,
					release_price: String(editTitle.release_price),
					actual_discount: String(editTitle.actual_discount ?? 0)
				}
			: { name: "", release_date: "", release_price: "", actual_discount: "0" }
	);
	const [selectedGenres, setSelectedGenres] = useState(
		editTitle ? editTitle.genres.map((g) => g.name) : []
	);
	const [files, setFiles] = useState({});
	const [activeSlot, setActiveSlot] = useState("store_1");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [progress, setProgress] = useState(null);
	const [failedSlots, setFailedSlots] = useState(new Set());

	function existingUrl(slot) {
		if (!editTitle || failedSlots.has(slot)) return null;
		return `/api/title/${encodeURIComponent(editTitle.name)}/media/${slot}`;
	}

	function markFailed(slot) {
		setFailedSlots((prev) => new Set([...prev, slot]));
	}

	function handleChange(e) {
		setForm((f) => ({ ...f, [e.target.id]: e.target.value }));
	}

	function setFile(field, file) {
		setFiles((f) => ({ ...f, [field]: file }));
	}

	function toggleGenre(name) {
		setSelectedGenres((p) => (p.includes(name) ? p.filter((g) => g !== name) : [...p, name]));
	}

	function getRef(slot) {
		if (slot === "trailer") return trailerRef;
		return storeRefs[slot];
	}

	function triggerUpload(slot) {
		getRef(slot)?.current?.click();
	}

	const currentIndex = ALL_MEDIA.indexOf(activeSlot);

	function goPrev() {
		setActiveSlot(ALL_MEDIA[(currentIndex - 1 + ALL_MEDIA.length) % ALL_MEDIA.length]);
	}

	function goNext() {
		setActiveSlot(ALL_MEDIA[(currentIndex + 1) % ALL_MEDIA.length]);
	}

	const discount = parseInt(form.actual_discount, 10) || 0;

	async function handleSubmit(e) {
		e.preventDefault();
		if (!editTitle && (!files.capsule || !files.store_1)) {
			setError("La cápsula y el primer screenshot son obligatorios.");
			return;
		}
		setLoading(true);
		setError(null);

		const encoded = encodeURIComponent(editTitle ? editTitle.name : form.name);

		try {
			let titleData;

			if (editTitle) {
				setProgress("Actualizando título...");
				const res = await axios.patch(
					`/api/title/${encoded}`,
					{
						release_date: form.release_date,
						release_price: parseFloat(form.release_price),
						actual_discount: discount,
						genres: selectedGenres
					},
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				titleData = res.data;
			} else {
				setProgress("Creando título...");
				const res = await axios.post(
					"/api/title/",
					{
						name: form.name,
						release_date: form.release_date,
						release_price: form.release_price,
						actual_discount: discount
					},
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				titleData = res.data;

				if (selectedGenres.length > 0) {
					setProgress("Asignando géneros...");
					await axios.patch(
						`/api/title/${encoded}`,
						{ genres: selectedGenres },
						{ headers: { Authorization: `Bearer ${token}` } }
					);
				}
			}

			const mediaEntries = Object.entries(files).filter(([, f]) => f);
			if (mediaEntries.length > 0) {
				setProgress("Subiendo archivos...");
				const fd = new FormData();
				for (const [field, file] of mediaEntries) fd.append(field, file);
				await axios.patch(`/api/title/${encoded}/media`, fd, {
					headers: { Authorization: `Bearer ${token}` }
				});
			}

			setLoading(false);
			setProgress(null);
			setForm({ name: "", release_date: "", release_price: "", actual_discount: "0" });
			setSelectedGenres([]);
			setFiles({});
			setActiveSlot("store_1");
			onCreated(titleData);
		} catch (error) {
			setError(error.response?.data?.detail ?? "Error al procesar el título");
			setLoading(false);
			setProgress(null);
		}
	}

	const hiddenInputs = (
		<div className="hidden">
			<input
				ref={headerRef}
				type="file"
				accept="image/*"
				onChange={(e) => setFile("header", e.target.files[0] ?? null)}
			/>
			<input
				ref={capsuleRef}
				type="file"
				accept="image/*"
				onChange={(e) => setFile("capsule", e.target.files[0] ?? null)}
			/>
			{STORE_FIELDS.map((f) => (
				<input
					key={f}
					ref={storeRefs[f]}
					type="file"
					accept="image/*"
					onChange={(e) => setFile(f, e.target.files[0] ?? null)}
				/>
			))}
			<input
				ref={trailerRef}
				type="file"
				accept="video/mp4"
				onChange={(e) => setFile("trailer", e.target.files[0] ?? null)}
			/>
		</div>
	);

	return (
		<form onSubmit={handleSubmit}>
			{hiddenInputs}

			<div className="mb-6 overflow-hidden rounded-xl border border-burnt-border bg-burnt-card">
				<button
					type="button"
					onClick={() => headerRef.current?.click()}
					className="group relative block aspect-460/215 w-full overflow-hidden bg-burnt-card"
					title="Subir header"
				>
					{files.header ? (
						<img src={fileUrl(files.header)} alt="Header" className="h-full w-full object-cover" />
					) : existingUrl("header") ? (
						<AuthImage src={existingUrl("header")} alt="Header" onError={() => markFailed("header")} />
					) : (
						<div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-burnt-faint transition-colors group-hover:text-burnt-accent/70">
							<ImagePlus size={20} strokeWidth={1.5} />
							<span className="text-xs">Header</span>
						</div>
					)}
				</button>

				<div className="bg-burnt-panel p-3">
					<div className="mb-3 grid gap-3" style={{ gridTemplateColumns: "3fr 8fr" }}>
						<button
							type="button"
							onClick={() => capsuleRef.current?.click()}
							className="group aspect-2/3 w-full overflow-hidden rounded-md border border-burnt-border bg-burnt-surface"
							title="Subir cápsula"
						>
							{files.capsule ? (
								<img src={fileUrl(files.capsule)} alt="Capsule" className="h-full w-full object-cover" />
							) : existingUrl("capsule") ? (
								<AuthImage
									src={existingUrl("capsule")}
									alt="Capsule"
									onError={() => markFailed("capsule")}
								/>
							) : (
								<div className="flex h-full w-full flex-col items-center justify-center gap-1 border-2 border-dashed border-burnt-border/50 text-burnt-faint transition-colors group-hover:border-burnt-accent/50 group-hover:text-burnt-accent/70">
									<ImagePlus size={16} strokeWidth={1.5} />
									<span className="text-xs">Cápsula</span>
								</div>
							)}
						</button>

						<div className="relative aspect-video w-full overflow-hidden rounded-md border border-burnt-border bg-burnt-surface">
							<button
								type="button"
								onClick={() => triggerUpload(activeSlot)}
								className="absolute inset-0 z-0 w-full"
								title={`Subir ${activeSlot === "trailer" ? "trailer" : activeSlot}`}
							/>
							{activeSlot === "trailer" ? (
								files.trailer ? (
									<video
										className="relative z-1 h-full w-full"
										src={fileUrl(files.trailer)}
										controls
										autoPlay
										muted
									/>
								) : existingUrl("trailer") ? (
									<div className="relative z-1 h-full w-full">
										<video className="h-full w-full" src={existingUrl("trailer")} controls muted />
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												triggerUpload("trailer");
											}}
											className="absolute right-2 top-2 z-10 flex items-center gap-1.5 rounded-md border border-white/20 bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm hover:bg-black/80"
										>
											<RefreshCw size={11} strokeWidth={2} />
											Cambiar
										</button>
									</div>
								) : (
									<div className="pointer-events-none absolute inset-0 z-1 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-burnt-border/40 text-burnt-faint">
										<Video size={24} strokeWidth={1.5} />
										<span className="text-sm">Trailer (.mp4)</span>
									</div>
								)
							) : files[activeSlot] ? (
								<img
									src={fileUrl(files[activeSlot])}
									alt={activeSlot}
									className="relative z-1 h-full w-full object-cover"
								/>
							) : existingUrl(activeSlot) ? (
								<div className="relative z-1 h-full w-full">
									<AuthImage
										src={existingUrl(activeSlot)}
										alt={activeSlot}
										onError={() => markFailed(activeSlot)}
									/>
								</div>
							) : (
								<div className="pointer-events-none absolute inset-0 z-1 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-burnt-border/40 text-burnt-faint">
									<ImagePlus size={24} strokeWidth={1.5} />
									<span className="text-sm">{activeSlot.replace("store_", "Store ")}</span>
								</div>
							)}
							<button
								type="button"
								onClick={goPrev}
								className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-burnt-border bg-burnt-bg/80 text-burnt-muted shadow-lg backdrop-blur-sm transition-colors hover:text-burnt-text"
							>
								<ChevronLeft size={18} strokeWidth={1.75} />
							</button>
							<button
								type="button"
								onClick={goNext}
								className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-burnt-border bg-burnt-bg/80 text-burnt-muted shadow-lg backdrop-blur-sm transition-colors hover:text-burnt-text"
							>
								<ChevronRight size={18} strokeWidth={1.75} />
							</button>
						</div>
					</div>

					<div className="flex flex-wrap justify-center gap-1.5">
						{STORE_FIELDS.map((field) => (
							<button
								key={field}
								type="button"
								onClick={() => setActiveSlot(field)}
								className={`h-14 w-24 flex-none overflow-hidden rounded border-2 transition-colors ${
									activeSlot === field
										? "border-burnt-accent"
										: "border-burnt-border hover:border-burnt-border"
								}`}
							>
								{files[field] ? (
									<img src={fileUrl(files[field])} alt={field} className="h-full w-full object-cover" />
								) : existingUrl(field) ? (
									<AuthImage src={existingUrl(field)} alt={field} onError={() => markFailed(field)} />
								) : (
									<div className="flex h-full w-full items-center justify-center bg-burnt-surface text-burnt-faint">
										<ImagePlus size={14} strokeWidth={1.5} />
									</div>
								)}
							</button>
						))}
						<button
							type="button"
							onClick={() => setActiveSlot("trailer")}
							className={`flex h-14 w-24 flex-none items-center justify-center gap-1.5 rounded border-2 text-xs font-medium transition-colors ${
								activeSlot === "trailer"
									? "border-burnt-accent bg-burnt-accent/10 text-burnt-accent"
									: "border-burnt-border bg-burnt-surface text-burnt-muted hover:border-burnt-border"
							}`}
						>
							<Play size={14} strokeWidth={1.75} />
							Tráiler
						</button>
					</div>
				</div>
			</div>

			<div className="space-y-6">
				<div className="rounded-lg border border-burnt-border bg-burnt-card p-5">
					<p className="mb-4 text-xs font-semibold uppercase tracking-widest text-burnt-faint">
						Información básica
					</p>
					<div className="space-y-4">
						<div>
							<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="name">
								Nombre <span className="text-burnt-red">*</span>
							</label>
							<input
								id="name"
								type="text"
								value={form.name}
								onChange={handleChange}
								required
								placeholder="Título del juego"
								readOnly={Boolean(editTitle)}
								className={`w-full rounded-lg border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text placeholder-burnt-faint focus:border-burnt-accent focus:outline-none ${editTitle ? "cursor-default opacity-60" : ""}`}
							/>
						</div>
						<div>
							<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="release_date">
								Fecha de lanzamiento <span className="text-burnt-red">*</span>
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
						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="release_price">
									Precio (USD) <span className="text-burnt-red">*</span>
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
							<div>
								<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="actual_discount">
									Descuento (%)
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
						</div>
					</div>
				</div>

				{genres.length > 0 && (
					<div className="rounded-lg border border-burnt-border bg-burnt-card p-5">
						<div className="mb-4 flex items-center justify-between">
							<p className="text-xs font-semibold uppercase tracking-widest text-burnt-faint">Géneros</p>
							{selectedGenres.length > 0 && (
								<span className="rounded-full bg-burnt-accent/15 px-2 py-0.5 text-xs font-semibold text-burnt-accent">
									{selectedGenres.length} seleccionados
								</span>
							)}
						</div>
						<div className="grid grid-cols-3 gap-2">
							{genres.map((g) => {
								const selected = selectedGenres.includes(g.name);
								return (
									<button
										key={g.name}
										type="button"
										onClick={() => toggleGenre(g.name)}
										className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-all ${
											selected
												? "border-burnt-accent bg-burnt-accent/10 text-burnt-accent shadow-sm shadow-burnt-accent/10"
												: "border-burnt-border bg-burnt-surface text-burnt-muted hover:border-burnt-accent/30 hover:bg-burnt-panel hover:text-burnt-text"
										}`}
									>
										<div
											className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
												selected ? "border-burnt-accent bg-burnt-accent" : "border-burnt-border/60"
											}`}
										>
											{selected && <Check size={10} strokeWidth={3} className="text-white" />}
										</div>
										<span className="truncate">{g.name}</span>
									</button>
								);
							})}
						</div>
					</div>
				)}

				<div className="space-y-4">
					{error && (
						<p className="rounded-lg border border-burnt-red/30 bg-burnt-red/10 px-4 py-2.5 text-sm text-burnt-red">
							{error}
						</p>
					)}
					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-lg bg-burnt-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-burnt-accent-hover disabled:opacity-50"
					>
						{loading ? (progress ?? "Enviando...") : editTitle ? "Actualizar título" : "Publicar título"}
					</button>
					{!editTitle && (
						<p className="text-center text-xs text-burnt-faint">
							Quedará pendiente de aprobación del administrador.
						</p>
					)}
				</div>
			</div>
		</form>
	);
}
