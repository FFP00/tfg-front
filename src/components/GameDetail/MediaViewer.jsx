import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useState } from "react";
import MediaImage from "../ui/MediaImage.jsx";

const STORE_FIELDS = ["store_1", "store_2", "store_3", "store_4", "store_5", "store_6"];
const ALL_MEDIA = [...STORE_FIELDS, "trailer"];

export default function MediaViewer({ encodedName, activeMedia, onSelect, capsule }) {
	const currentIndex = ALL_MEDIA.indexOf(activeMedia);

	function goPrev() {
		const prev = ALL_MEDIA[(currentIndex - 1 + ALL_MEDIA.length) % ALL_MEDIA.length];
		onSelect(prev);
	}

	function goNext() {
		const next = ALL_MEDIA[(currentIndex + 1) % ALL_MEDIA.length];
		onSelect(next);
	}

	return (
		<div className="rounded-lg bg-burnt-panel p-3">
			<div className="mb-3 flex gap-3">
				{capsule && (
					<div className="flex-none self-stretch overflow-hidden rounded-md border border-burnt-border bg-burnt-surface">
						<img
							src={capsule}
							alt="Capsule"
							className="h-full w-auto"
							onError={(e) => {
								e.target.style.display = "none";
							}}
						/>
					</div>
				)}

				<div className="relative aspect-video flex-1 overflow-hidden rounded-md border border-burnt-border bg-burnt-surface">
					{activeMedia === "trailer" ? (
						// biome-ignore lint/a11y/useMediaCaption: trailers no tienen subtítulos
						<video className="h-full w-full" controls autoPlay>
							<source src={`/api/title/${encodedName}/media/trailer`} type="video/mp4" />
						</video>
					) : (
						<MediaImage src={`/api/title/${encodedName}/media/${activeMedia}`} alt="Imagen del juego" />
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
					<ThumbnailButton
						key={field}
						field={field}
						encodedName={encodedName}
						active={activeMedia === field}
						onSelect={onSelect}
					/>
				))}
				<button
					type="button"
					onClick={() => onSelect("trailer")}
					className={`flex h-14 w-24 flex-none items-center justify-center gap-1.5 rounded border-2 text-xs font-medium transition-colors ${
						activeMedia === "trailer"
							? "border-burnt-accent bg-burnt-accent/10 text-burnt-accent"
							: "border-burnt-border bg-burnt-surface text-burnt-muted hover:border-burnt-border-hover hover:text-burnt-text"
					}`}
				>
					<Play size={14} strokeWidth={1.75} />
					Tráiler
				</button>
			</div>
		</div>
	);
}

function ThumbnailButton({ field, encodedName, active, onSelect }) {
	const [hidden, setHidden] = useState(false);
	if (hidden) return null;

	return (
		<button
			type="button"
			onClick={() => onSelect(field)}
			className={`h-14 w-24 flex-none overflow-hidden rounded border-2 transition-colors ${
				active ? "border-burnt-accent" : "border-burnt-border hover:border-burnt-border-hover"
			}`}
		>
			<img
				src={`/api/title/${encodedName}/media/${field}`}
				alt={field}
				loading="lazy"
				className="h-full w-full object-cover"
				onError={() => setHidden(true)}
			/>
		</button>
	);
}
