import './css/styles.css'

import { useEffect, useRef } from "react";
import { 
  BrowserRouter,
  Navigate,
  Route,
  Routes } 
from "react-router-dom";
import axios from "axios";

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

import Index from './components/Index.jsx';
import Treks from './components/Treks.jsx';
import Trek from './components/Trek.jsx';
import Meetings from './components/Meetings.jsx';
import Meeting from './components/Meeting.jsx';
import Places from './components/Places.jsx';
import Place from './components/Place.jsx';

import Information from './components/Information.jsx';
import Contact from './components/Contact.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';


export default function App() {

  return (
    <>
      <BrowserRouter> 
      
        <Header />

          <Routes>

          <Route path="*" element={<Navigate replace to="/"/>}/>
          <Route path="/" element={<Index/>} />
          <Route path="/treks" element={<Treks/>} />
          <Route path="/trek" element={<Trek/>} />
          <Route path="/meetings" element={<Meetings/>} />
          <Route path="/meeting" element={<Meeting/>} />
          <Route path="/places" element={<Places/>} />
          <Route path="/place" element={<Place/>} />
          <Route path="/information" element={<Information/>}/>
          <Route path="/contact" element={<Contact/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          
          { /* <Route path="/excursiones" element={<Excursiones/>} />
           />
          <Route path="/contact" element={<Contact/>} />
          
           */}

          </Routes> 

        <Footer/>

      </BrowserRouter>
    </>
  )
}
