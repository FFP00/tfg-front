import './css/styles.css'

import { useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';

import Header from './components/Header'
import Main from './components/Main'
import More from './components/More'
import Footer from './components/Footer'
import Nothing from './components/Nothing';

export default function App() {
  const [quesos, setQuesos] = useImmer([]);
  const [filteredQuesos, setFilteredQuesos] = useImmer(null);
  const [visible, setVisible] = useImmer(8);
  const selectRef = useRef();
  const minRef = useRef();
  const maxRef = useRef();
  const list = filteredQuesos ? filteredQuesos : quesos;
  const visibleList = list.slice(0, visible);


  async function fetchQuesos(){
    const data = await fetch("/data/data.json");
    const json = await data.json();
    setQuesos(json);
  }

  function handleFilter() {
    const type = selectRef.current.value;
    const min = minRef.current.value;
    const max = maxRef.current.value;

    function getPrice(q){ 
      return q.price.price - (q.price.price * q.price.discount / 100);
    }

    // FILTRO POR PRECIO
    let result = [...quesos].filter(q => {
      const price = getPrice(q);

      if (!min && !max){
        return true;
      }else if(!min && max){
        return price < max;
      }else if(min && !max){
        return price > min;
      }else{
        return price > min && price < max;
      }

    });

    // FILTRO POR TIPO
    if (type === "low") {
      result = result.filter(q => q.characteristics.content < 25);
    }

    if (type === "medium") {
      result = result.filter(q => 
        q.characteristics.content >= 26 && q.characteristics.content <= 29
      );
    }

    if (type === "high") {
      result = result.filter(q => q.characteristics.content > 30);
    }

    setFilteredQuesos(result);
    setVisible(8);
  }


  function handleDelete(id){
    setQuesos(
      [...quesos].filter( quesos => !(quesos.id == id) )
    )
  }

  useEffect(() => {
    fetchQuesos();
  }, []);

  return (
    <>
      <Header />

      <Main 
        quesos={visibleList}
        handleDelete={handleDelete}
        handleFilter={handleFilter}
        selectRef={selectRef}
        minRef={minRef}
        maxRef={maxRef}
      />

      { visibleList.length == 0 && <Nothing /> }    

      <More 
        visible={visible}
        setVisible={setVisible}
        total={filteredQuesos ? filteredQuesos.length : quesos.length}
      />

      <Footer />
    </>
  )
}







