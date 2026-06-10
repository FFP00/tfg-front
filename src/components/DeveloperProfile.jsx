import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProfileHeader from "./DeveloperProfile/ProfileHeader.jsx";
import TitlesList from "./DeveloperProfile/TitlesList.jsx";

export default function DeveloperProfile() {
	const { name } = useParams();
	const navigate = useNavigate();

	const [developer, setDeveloper] = useState(null);
	const [titles, setTitles] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function load() {
			try {
				const [devRes, titlesRes] = await Promise.all([
					axios.get(`/api/developer/${name}`),
					axios.get(`/api/title/?developer=${encodeURIComponent(name)}`).catch(() => ({ data: [] }))
				]);
				setDeveloper(devRes.data);
				setTitles(titlesRes.data);
			} catch {
				navigate("/");
				return;
			}
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
			<div className="grid grid-cols-3 gap-6">
				<div className="col-span-1">
					<ProfileHeader developer={developer} />
				</div>

				<div className="col-span-2">
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
