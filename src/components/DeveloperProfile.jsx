import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProfileHeader from "./DeveloperProfile/ProfileHeader";
import TitlesList from "./DeveloperProfile/TitlesList";

export default function DeveloperProfile() {
	const { name } = useParams();
	const navigate = useNavigate();

	const [developer, setDeveloper] = useState(null);
	const [titles, setTitles] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function load() {
			const [devRes, titlesRes] = await Promise.all([
				fetch(`/api/developer/${name}`),
				fetch(`/api/title/?developer=${encodeURIComponent(name)}`),
			]);
			if (!devRes.ok) {
				navigate("/");
				return;
			}
			setDeveloper(await devRes.json());
			if (titlesRes.ok) setTitles(await titlesRes.json());
			setLoading(false);
		}
		load();
	}, [name, navigate]);

	if (loading) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-2 border-burnt-border border-t-burnt-accent" />
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-7xl px-4 py-8">
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div className="lg:col-span-1">
					<ProfileHeader developer={developer} />
				</div>

				<div className="lg:col-span-2">
					<div className="rounded-lg border border-burnt-border bg-burnt-card p-5">
						<h2 className="mb-5 text-lg font-bold text-burnt-text">
							Títulos publicados{" "}
							<span className="text-sm font-normal text-burnt-muted">({titles.length})</span>
						</h2>
						<TitlesList titles={titles} />
					</div>
				</div>
			</div>
		</div>
	);
}
