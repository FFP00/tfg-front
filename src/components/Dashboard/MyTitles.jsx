import MediaImage from "../ui/MediaImage";
import EditTitle from "./EditTitle";
import MediaUpload from "./MediaUpload";

export default function MyTitles({ titles, genres, token, onUpdate }) {
	if (titles.length === 0) {
		return (
			<p className="py-8 text-center text-sm text-burnt-muted">
				Todavía no tienes títulos publicados
			</p>
		);
	}

	return (
		<div className="space-y-4">
			{titles.map((title) => {
				const base = parseFloat(title.release_price);
				const discount = title.actual_discount;
				const final = discount ? (base * (1 - discount / 100)).toFixed(2) : base.toFixed(2);

				return (
					<div
						key={title.name}
						className="rounded-md border border-burnt-border bg-burnt-panel p-4"
					>
						<div className="mb-3 flex items-start gap-4">
							<div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg">
								<MediaImage
									src={`/api/title/${encodeURIComponent(title.name)}/media/capsule`}
									alt={title.name}
								/>
							</div>
							<div className="min-w-0 flex-1">
								<div className="mb-1 flex flex-wrap items-center gap-2">
									<span className="font-semibold text-burnt-text">{title.name}</span>
									<span
										className={`rounded-full px-2 py-0.5 text-xs font-medium ${
											title.status
												? "bg-burnt-green/15 text-burnt-green"
												: "bg-burnt-yellow/15 text-burnt-yellow"
										}`}
									>
										{title.status ? "Publicado" : "Pendiente"}
									</span>
								</div>
								<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-burnt-muted">
									<span>
										{discount > 0 && (
											<span className="mr-1 rounded bg-burnt-accent px-1 py-0.5 text-white">
												−{discount}%
											</span>
										)}
										<span className="font-semibold text-burnt-text">${final}</span>
										{discount > 0 && <span className="ml-1 line-through">${base.toFixed(2)}</span>}
									</span>
									<span>{title.release_date}</span>
								</div>
								<div className="mt-1 flex flex-wrap gap-1">
									{title.genres.map((g) => (
										<span
											key={g.name}
											className="rounded-full border border-burnt-border px-2 py-0.5 text-xs text-burnt-faint"
										>
											{g.name}
										</span>
									))}
								</div>
							</div>
						</div>

						<div className="flex gap-2">
							<EditTitle
								title={title}
								genres={genres}
								token={token}
								onUpdated={(updated) => onUpdate(updated)}
							/>
							<MediaUpload title={title} token={token} onUploaded={onUpdate} />
						</div>
					</div>
				);
			})}
		</div>
	);
}
