import { useState, useEffect } from 'react'
import Loading from './components/Loading.jsx'
import ToursList from './components/ToursList.jsx'
import NoTours from './components/NoTours.jsx'

export default function App() {
  // TODO: Set state loading and tours
  const [loading,setLoading] = useState(true);
  const [tours,setTours] = useState([]);
  

  // TODO: Remove Tour by id and set the new state 
  function removeTour(id){
    setTours([...tours].filter( object => !(object.id == id)  ));
  }
  // TODO: Get Tours data from json 
  async function fetchTours(){
    try {
      const response = await fetch("/data/data.json");
      const json = await response.json();
      setTours(json); 
    } catch (error) {
      setLoading(true)
    }
  }

  useEffect(() => {
    fetchTours()
  }, []);

  return (
    <main>
      { 
        !loading ? <Loading /> : ( !(tours.length == 0) ? <ToursList tours={tours} removeTour={removeTour}/> : <NoTours fetchTours={fetchTours}/>) 
      }
    </main>
  )
}