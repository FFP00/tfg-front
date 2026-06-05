import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import About from "./components/About";
import Cart from "./components/Cart";
import CommunitySearch from "./components/CommunitySearch";
import Contact from "./components/Contact";
import CustomerProfile from "./components/CustomerProfile";
import Dashboard from "./components/Dashboard";
import Deposit from "./components/Deposit";
import DepositSuccess from "./components/DepositSuccess";
import DeveloperProfile from "./components/DeveloperProfile";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import GameDetail from "./components/GameDetail";
import GameOwned from "./components/GameOwned";
import Header from "./components/Header";
import History from "./components/History";
import Home from "./components/Home";
import Library from "./components/Library";
import Login from "./components/Login";
import Me from "./components/Me";
import Register from "./components/Register";

export default function App() {
	const [cart, setCart] = useState(JSON.parse(localStorage.getItem("burnt_cart") ?? "[]"));

	useEffect(() => {
		async function preload() {
			const [genresOk, countriesOk, currenciesOk] = [
				localStorage.getItem("burnt_genres"),
				localStorage.getItem("burnt_countries"),
				localStorage.getItem("burnt_currencies"),
			];
			const fetches = [];
			if (!genresOk)
				fetches.push(
					fetch("/api/genre/").then((r) =>
						r.ok
							? r.json().then((d) => localStorage.setItem("burnt_genres", JSON.stringify(d)))
							: null,
					),
				);
			if (!countriesOk)
				fetches.push(
					fetch("/api/country/").then((r) =>
						r.ok
							? r.json().then((d) => localStorage.setItem("burnt_countries", JSON.stringify(d)))
							: null,
					),
				);
			if (!currenciesOk)
				fetches.push(
					fetch("/api/currency/").then((r) =>
						r.ok
							? r.json().then((d) => localStorage.setItem("burnt_currencies", JSON.stringify(d)))
							: null,
					),
				);
			await Promise.all(fetches);
		}
		preload();
	}, []);

	function addToCart(game) {
		if (cart.some((item) => item.name === game.name)) return;
		const newCart = [...cart, { name: game.name, price: game.release_price }];
		localStorage.setItem("burnt_cart", JSON.stringify(newCart));
		setCart(newCart);
	}

	function removeFromCart(name) {
		const newCart = cart.filter((item) => item.name !== name);
		localStorage.setItem("burnt_cart", JSON.stringify(newCart));
		setCart(newCart);
	}

	function clearCart() {
		localStorage.removeItem("burnt_cart");
		setCart([]);
	}

	return (
		<BrowserRouter>
			<div className="flex min-h-screen bg-burnt-bg text-burnt-text">
				<Header cartCount={cart.length} />

				<div className="ml-16 flex flex-1 flex-col">
					<main className="flex-1">
						<Routes>
							<Route path="*" element={<Navigate replace to="/" />} />
							<Route path="/" element={<Home cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />} />
							<Route
								path="/game/:name"
								element={<GameDetail cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />}
							/>
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
							<Route path="/me" element={<Me />} />
							<Route path="/me/library" element={<Library />} />
							<Route path="/me/deposit" element={<Deposit />} />
							<Route path="/me/deposit/success" element={<DepositSuccess />} />
							<Route path="/me/history" element={<History />} />
							<Route
								path="/cart"
								element={<Cart cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} />}
							/>
							<Route path="/game/:name/owned" element={<GameOwned />} />
							<Route path="/customer/:name" element={<CustomerProfile />} />
							<Route path="/developer/:name" element={<DeveloperProfile />} />
							<Route path="/dashboard" element={<Dashboard />} />
							<Route path="/about" element={<About />} />
							<Route path="/faq" element={<FAQ />} />
							<Route path="/contact" element={<Contact />} />
							<Route path="/search/community" element={<CommunitySearch />} />
							<Route
								path="/search/customers"
								element={<Navigate replace to="/search/community" />}
							/>
							<Route
								path="/search/developers"
								element={<Navigate replace to="/search/community" />}
							/>
						</Routes>
					</main>
					<Footer />
				</div>
			</div>
		</BrowserRouter>
	);
}
