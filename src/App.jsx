import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import About from "./components/About.jsx";
import Cart from "./components/Cart.jsx";
import CommunitySearch from "./components/CommunitySearch.jsx";
import Contact from "./components/Contact.jsx";
import CustomerProfile from "./components/CustomerProfile.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Deposit from "./components/Deposit.jsx";
import DepositSuccess from "./components/DepositSuccess.jsx";
import DeveloperProfile from "./components/DeveloperProfile.jsx";
import FAQ from "./components/FAQ.jsx";
import Footer from "./components/Footer.jsx";
import GameDetail from "./components/GameDetail.jsx";
import GameOwned from "./components/GameOwned.jsx";
import Header from "./components/Header.jsx";
import History from "./components/History.jsx";
import Home from "./components/Home.jsx";
import Library from "./components/Library.jsx";
import Login from "./components/Login.jsx";
import Me from "./components/Me.jsx";
import Register from "./components/Register.jsx";

export default function App() {
	const [cart, setCart] = useState(JSON.parse(localStorage.getItem("burnt_cart") ?? "[]"));

	useEffect(() => {
		async function preload() {
			const fetches = [];
			if (!localStorage.getItem("burnt_genres"))
				fetches.push(
					axios
						.get("/api/genre/")
						.then((r) => localStorage.setItem("burnt_genres", JSON.stringify(r.data)))
						.catch(() => {})
				);
			if (!localStorage.getItem("burnt_countries"))
				fetches.push(
					axios
						.get("/api/country/")
						.then((r) => localStorage.setItem("burnt_countries", JSON.stringify(r.data)))
						.catch(() => {})
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
							<Route
								path="/"
								element={
									<Home
										cart={cart}
										addToCart={addToCart}
										removeFromCart={removeFromCart}
									/>
								}
							/>
							<Route
								path="/shop/:name"
								element={
									<GameDetail
										cart={cart}
										addToCart={addToCart}
										removeFromCart={removeFromCart}
									/>
								}
							/>
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
							<Route path="/profile" element={<Me />} />
							<Route path="/library" element={<Library />} />
							<Route path="/deposit" element={<Deposit />} />
							<Route path="/deposit/success" element={<DepositSuccess />} />
							<Route path="/history" element={<History />} />
							<Route
								path="/cart"
								element={<Cart cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} />}
							/>
							<Route path="/library/:name" element={<GameOwned />} />
							<Route path="/customer/:name" element={<CustomerProfile />} />
							<Route path="/developer/:name" element={<DeveloperProfile />} />
							<Route path="/dashboard" element={<Dashboard />} />
							<Route path="/about" element={<About />} />
							<Route path="/faq" element={<FAQ />} />
							<Route path="/contact" element={<Contact />} />
							<Route path="/community" element={<CommunitySearch />} />
						</Routes>
					</main>
					<Footer />
				</div>
			</div>
		</BrowserRouter>
	);
}
