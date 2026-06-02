import { Link, useNavigate } from "react-router-dom";

export default function Header() {
	const token = localStorage.getItem("burnt_token");
	const navigate = useNavigate();

	function handleLogout() {
		localStorage.removeItem("burnt_token");
		localStorage.removeItem("burnt_type");
		navigate("/");
	}

	return (
		<header className="sticky top-0 z-50 border-b border-burnt-border bg-burnt-card">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
				<Link
					to="/"
					className="text-xl font-bold tracking-tight text-burnt-accent transition-colors hover:text-burnt-accent-hover"
				>
					Burnt
				</Link>
				<nav className="flex items-center gap-6">
					<Link to="/" className="text-sm text-burnt-muted transition-colors hover:text-burnt-text">
						Catálogo
					</Link>
					{token ? (
						<button
							type="button"
							onClick={handleLogout}
							className="text-sm text-burnt-muted transition-colors hover:text-burnt-red"
						>
							Cerrar sesión
						</button>
					) : (
						<>
							<Link
								to="/login"
								className="text-sm text-burnt-muted transition-colors hover:text-burnt-text"
							>
								Iniciar sesión
							</Link>
							<Link
								to="/register"
								className="rounded bg-burnt-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-burnt-accent-hover"
							>
								Registrarse
							</Link>
						</>
					)}
				</nav>
			</div>
		</header>
	);
}
