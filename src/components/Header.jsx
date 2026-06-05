import {
	BookOpen,
	ClipboardList,
	CreditCard,
	HelpCircle,
	Home,
	Info,
	LayoutGrid,
	LogIn,
	LogOut,
	Mail,
	ShoppingCart,
	UserPlus,
	Users,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NAV_MAIN = [{ to: "/", Icon: Home, label: "Tienda" }];

const NAV_COMMUNITY = [{ to: "/search/community", Icon: Users, label: "Comunidad" }];

const NAV_INFO_PUBLIC = [
	{ to: "/about", Icon: Info, label: "Nosotros" },
	{ to: "/faq", Icon: HelpCircle, label: "FAQ" },
];

const NAV_INFO_AUTH = [
	{ to: "/contact", Icon: Mail, label: "Contacto" },
];

export default function Header({ cartCount }) {
	const navigate = useNavigate();
	const location = useLocation();

	const token = localStorage.getItem("burnt_token");
	const type = localStorage.getItem("burnt_type");
	const user = JSON.parse(localStorage.getItem("burnt_user") ?? "null");
	const wallet = JSON.parse(localStorage.getItem("burnt_wallet") ?? "null");

	async function handleLogout() {
		if (token && type) {
			await fetch(`/auth/${type}/logout`, {
				method: "POST",
				headers: { Authorization: `Bearer ${token}` },
			}).catch(() => {});
		}
		localStorage.removeItem("burnt_token");
		localStorage.removeItem("burnt_type");
		localStorage.removeItem("burnt_user");
		localStorage.removeItem("burnt_wallet");
		navigate("/");
	}

	function isActive(path) {
		return location.pathname === path;
	}

	const navCustomer = [
		{ to: "/me/library", Icon: BookOpen, label: "Biblioteca" },
		{ to: "/me/history", Icon: ClipboardList, label: "Historial" },
	];

	const navDeveloper = [{ to: "/dashboard", Icon: LayoutGrid, label: "Dashboard" }];

	const extraNav = token ? (type === "customer" ? navCustomer : navDeveloper) : [];

	function navLinkClass(to) {
		const active = isActive(to);
		return `flex h-10 w-full items-center justify-center transition-colors ${
			active
				? "text-burnt-accent bg-burnt-accent/10 border-r-2 border-burnt-accent"
				: "text-burnt-faint hover:text-burnt-text hover:bg-burnt-panel"
		}`;
	}

	function Divider() {
		return <div className="mx-3 my-2 border-t border-burnt-border" />;
	}

	return (
		<aside className="fixed left-0 top-0 z-50 flex h-screen w-16 flex-col border-r border-burnt-border bg-burnt-card">
			{/* Logo */}
			<Link
				to="/"
				className="flex h-14 w-full items-center justify-center border-b border-burnt-border"
				title="Burnt"
			>
				<span className="text-sm font-black tracking-widest text-burnt-accent">B</span>
			</Link>

			{/* Navigation */}
			<nav className="flex flex-1 flex-col overflow-y-auto py-2">
				{NAV_MAIN.map(({ to, Icon, label }) => (
					<Link key={to} to={to} title={label} className={navLinkClass(to)}>
						<Icon size={18} strokeWidth={1.75} />
					</Link>
				))}

				{type !== "developer" && (
					<Link
						to="/cart"
						title={cartCount > 0 ? `Carrito (${cartCount})` : "Carrito"}
						className={`relative flex h-10 w-full items-center justify-center transition-colors ${
							isActive("/cart")
								? "text-burnt-accent bg-burnt-accent/10 border-r-2 border-burnt-accent"
								: "text-burnt-faint hover:text-burnt-text hover:bg-burnt-panel"
						}`}
					>
						<ShoppingCart size={18} strokeWidth={1.75} />
						{cartCount > 0 && (
							<span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-burnt-accent" />
						)}
					</Link>
				)}

				{extraNav.length > 0 && (
					<>
						<Divider />
						{extraNav.map(({ to, Icon, label }) => (
							<Link key={to} to={to} title={label} className={navLinkClass(to)}>
								<Icon size={18} strokeWidth={1.75} />
							</Link>
						))}
					</>
				)}

				<Divider />
				{NAV_COMMUNITY.map(({ to, Icon, label }) => (
					<Link key={to} to={to} title={label} className={navLinkClass(to)}>
						<Icon size={18} strokeWidth={1.75} />
					</Link>
				))}

				<Divider />
				{[...NAV_INFO_PUBLIC, ...(token ? NAV_INFO_AUTH : [])].map(({ to, Icon, label }) => (
					<Link key={to} to={to} title={label} className={navLinkClass(to)}>
						<Icon size={18} strokeWidth={1.75} />
					</Link>
				))}
			</nav>

			{/* Account section */}
			<div className="border-t border-burnt-border py-2">
				{token ? (
					<>
						<Link
							to={type === "customer" ? "/me" : "/dashboard"}
							title={
								type === "customer" && wallet
									? `${user?.name ?? "Cuenta"} · $${parseFloat(wallet.balance).toFixed(2)}`
									: (user?.name ?? "Cuenta")
							}
							className="flex h-10 w-full items-center justify-center transition-colors hover:bg-burnt-panel"
						>
							<div className="flex h-7 w-7 items-center justify-center rounded-full bg-burnt-panel border border-burnt-border text-xs font-semibold text-burnt-text">
								{(user?.name?.[0] ?? "?").toUpperCase()}
							</div>
						</Link>

						{type === "customer" && (
							<Link
								to="/me/deposit"
								title="Recargar saldo"
								className="flex h-10 w-full items-center justify-center text-burnt-faint transition-colors hover:text-burnt-text hover:bg-burnt-panel"
							>
								<CreditCard size={18} strokeWidth={1.75} />
							</Link>
						)}

						<button
							type="button"
							onClick={handleLogout}
							title="Cerrar sesión"
							className="flex h-10 w-full items-center justify-center text-burnt-faint transition-colors hover:text-burnt-red hover:bg-burnt-panel"
						>
							<LogOut size={18} strokeWidth={1.75} />
						</button>
					</>
				) : (
					<>
						<Link
							to="/login"
							title="Iniciar sesión"
							className="flex h-10 w-full items-center justify-center text-burnt-faint transition-colors hover:text-burnt-text hover:bg-burnt-panel"
						>
							<LogIn size={18} strokeWidth={1.75} />
						</Link>
						<Link
							to="/register"
							title="Registrarse"
							className="flex h-10 w-full items-center justify-center text-burnt-accent transition-colors hover:bg-burnt-accent/10"
						>
							<UserPlus size={18} strokeWidth={1.75} />
						</Link>
					</>
				)}
			</div>
		</aside>
	);
}
