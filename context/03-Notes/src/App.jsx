import './App.css'
import { nanoid } from 'nanoid';

import { useEffect, useState } from 'react'
import Header from "./components/Header.jsx"
import Search from "./components/Search.jsx"
import NotesList from "./components/NotesList.jsx"

export default function App() {

  const [notes,setNotes] = useState([]);
  const [notesFiltradas,setNotesFiltradas] = useState(null);
  const [darkMode,setDarkMode] = useState(false);

  function handleToggleDarkMode(){
    setDarkMode(darkMode => !darkMode)
  }

  function handleSearchNote(text){
    if(text){
      setNotesFiltradas([...notes].filter( notas => 
        (notas.text.toLowerCase().includes(text.toLowerCase()))
      ))
    }else{
      setNotesFiltradas(null);
    }
    
  }

  function handleAddNote(noteText){
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const año = hoy.getFullYear();
    const fechaHoy = `${dia}/${mes}/${año}`;

    let notaObjeto = {
      id : nanoid(),
      text : noteText,
      date : fechaHoy
    }

    setNotes(prevNotes => [...prevNotes, notaObjeto])
  }
  
  function handleDeleteNote(id){
    setNotes(
      [...notes].filter( notas => !(notas.id == id) )
    )
  }

  async function fetchNotes(){
    const data = await fetch("/data/notes.json");
    const json = await data.json()
    setNotes(json)
  }

  useEffect(() => {
    const notasLocal = localStorage.getItem("notasLocal");
    if(notasLocal){
      const parsed = JSON.parse(notasLocal);
      (Array.isArray(parsed) && parsed.length > 0) ? setNotes(parsed) : fetchNotes();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("notasLocal",JSON.stringify(notes));
  },[notes]);

  return (
    <>
      <div className={darkMode ? "dark-mode" : ""}>
        <Header 
          handleToggleDarkMode={handleToggleDarkMode}
          darkMode={darkMode}
        />
        <Search 
          handleSearchNote={handleSearchNote}
        />
        <NotesList 
          notes={notesFiltradas ? notesFiltradas :notes } 
          handleAddNote={handleAddNote} 
          handleDeleteNote={handleDeleteNote}
        />
      </div>
    </>
  )
}


