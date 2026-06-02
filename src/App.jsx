import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import GameDetail from "./pages/GameDetail";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
	return (
		<BrowserRouter>
			<div className="flex min-h-screen flex-col bg-burnt-bg text-burnt-text">
				<Header />
				<main className="flex-1">
					<Routes>
						<Route path="*" element={<Navigate replace to="/" />} />
						<Route path="/" element={<Home />} />
						<Route path="/game/:name" element={<GameDetail />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
					</Routes>
				</main>
				<Footer />
			</div>
		</BrowserRouter>
	);
}
