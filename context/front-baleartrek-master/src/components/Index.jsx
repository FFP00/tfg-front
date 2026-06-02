import { Link } from "react-router-dom"
import axios from "axios";
import { useEffect,useState } from "react";

import Hero from "./Index/Hero"
import SimpleTreks from "./Index/SimpleTreks"

export default function Index(){

    const [treks,setTreks] = useState([])
    console.log(treks)
  async function getData(){
      try {
      const res = await axios.get(
          "http://localhost/api/trek/top"
      );

      return res.data.data;

      } catch (error) {
          console.error(error);
      }
  };

  useEffect(()=>{
      async function fetchData() {
      const data = await getData(); 
      setTreks(data); 
      }

      fetchData();   
  },[])

    return(
        <>
            <Hero />
            <SimpleTreks treks={treks}/>
        </>
    )
}