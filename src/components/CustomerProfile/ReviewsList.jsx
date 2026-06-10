import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function ReviewsList({ reviews }) {
	if (reviews.length === 0) {
		return <p className="py-4 text-center text-sm text-burnt-muted">Sin reseñas</p>;
	}

	return (
		<div className="space-y-3">
			{reviews.map((r) => (
				<div
					key={`${r.title_name}-${r.created_at}`}
					className="rounded-md border border-burnt-border bg-burnt-panel p-4"
				>
					<div className="mb-2 flex items-start justify-between gap-2">
						{r.title_name && (
							<Link
								to={`/shop/${encodeURIComponent(r.title_name)}`}
								className="text-sm font-semibold text-burnt-accent transition-colors hover:text-burnt-accent-hover"
							>
								{r.title_name}
							</Link>
						)}
						<span
							className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
								r.recommends ? "bg-burnt-green/15 text-burnt-green" : "bg-burnt-red/15 text-burnt-red"
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
					<p className="mb-2 text-sm text-burnt-muted">{r.content}</p>
					<div className="flex items-center justify-between">
						<span className="text-xs text-burnt-faint">
							{new Date(r.created_at).toLocaleDateString("es-ES")}
						</span>
						<span className="flex items-center gap-1 text-xs text-burnt-faint">
							<ThumbsUp size={12} strokeWidth={1.75} />
							{r.votes}
						</span>
					</div>
				</div>
			))}
		</div>
	);
}
