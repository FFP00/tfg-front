import './css/styles.css'

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import { useState } from 'react'

import app from "./modules/App.module.css";

import Header from './components/Header';
import MovieDetails from "./pages/MovieDetails";
import LandingPage from "./pages/LandingPage";

export default function App() {

  return (
    <>
      <div className={app.title}>

        <BrowserRouter> 
        
          <Header />

          <Routes> 
            <Route path="/" element={<LandingPage />} /> 
            <Route path="/movies" element={<MovieDetails />} /> 
          </Routes> 

        </BrowserRouter>
        
      </div>
    </>
  )
}