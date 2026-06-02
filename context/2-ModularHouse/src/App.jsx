import './App.css'

import { useState, useEffect, useRef } from 'react';
import axios from "axios";

import Loading from './components/Loading';
import Search from './components/Search';
import Card from './components/Card'
import Button from './components/Button';

export default function App() {

  const [casas, setCasas] = useState([])
  const [filteredCasas, setFilteredCasas] = useState(null)
  const [loading, setLoading] = useState(true)
  const [load, setLoad] = useState(3)
  const inputRef = useRef();
  const selectRef = useRef();

  function handleFilter(){

    let filtrado = [...casas];

    if(selectRef.current.value){
      filtrado = filtrado.filter(casa => casa.material.toLowerCase().includes(selectRef.current.value.toLowerCase()))
    }    

    if(inputRef.current.value){ 
      filtrado = filtrado.filter(casa => casa.name.toLowerCase().includes(inputRef.current.value.toLowerCase()))
    }

    setFilteredCasas(filtrado);

  }

  function handleLoad(){
    setLoad(prev => prev + 3)
  }

  async function getData(){
    try {
      const res = await axios.get(
        "/data/houses.json"
      );

      return res.data;

    } catch (error) {
      console.error(error);
    }finally{
      
    }
  };

  useEffect(()=>{
    
    async function fetchData() {
       const data = await getData(); 
       setCasas(data); 
    }

    fetchData();   
    setLoading(false)

  },[])

  return (
    <>
      <div className="wrapper">
        {loading ? <Loading /> : 
          <>
            <Search inputRef={inputRef} selectRef={selectRef} handleFilter={handleFilter} />
            <Card casas={filteredCasas ? filteredCasas : casas} load={load}/>
            <Button handleLoad={handleLoad}/>
          </>
        } 
      </div>
    </>
  )
}