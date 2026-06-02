import './App.css'

import { useEffect, useState, useRef} from 'react';
import axios from 'axios';

import Search from './components/Search';
import Table from './components/Table';


export default function App() {

  const [monedas,setMonedas] = useState([]);
  const [monedasFiltradas,setMonedasFiltradas] = useState(null);
  const inputRef = useRef();

  function handleFilter(){
    setMonedasFiltradas(
      [...monedas].filter(moneda => moneda.name.toLowerCase().includes(inputRef.current.value.toLowerCase()))      
    );
  }

  async function getData(){
    try {
      const res = await axios.get(
        "/data/coins.json"
      );

      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(()=>{
    
    async function fetchData() {
       const data = await getData(); 
       setMonedas(data) 
    }

    fetchData();

  },[])



  return (
    <>
      <div className="container">
        <div className="row">
          <Search handleFilter={handleFilter} inputRef={inputRef}/>
          <Table monedas={monedasFiltradas ? monedasFiltradas : monedas} />
        </div>
      </div>
    </>
  )
}

