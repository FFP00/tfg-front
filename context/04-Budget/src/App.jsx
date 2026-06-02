import './App.css'

import { useEffect, useState } from 'react'
import { useRef } from 'react'

import Alert from './components/Alert'
import Precio from './components/Precio'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import { nanoid } from 'nanoid'

export default function App() {

  const [charge,setCharge] = useState("")
  const [amount,setAmount] = useState("")
  const [expenses,setExpenses] = useState([])
  const alertRef = useRef(null);
  const precioRef = useRef(null);


  function handleCharge(e){
    setCharge(e.target.value)
  }

  function handleAmount(e){
    setAmount(e.target.value)
  }

  function handleSubmit(e){
    e.preventDefault();
    setExpenses(prev => [...prev,
      {
        id : nanoid(),
        charge : charge,
        amount : amount
      }])
  }


  function handleDelete(id){
    setExpenses([...expenses].filter( expensas => 
      !(expensas.id == id)
    ))
  }

  function clearItems(){
    setExpenses([])
  }

  useEffect(() => {
      alertRef.current.textContent = "No te pases con el precio"
      alertRef.current.className = "alert alert-danger"
    setTimeout(() => {
          if (alertRef.current) {
            alertRef.current.textContent = "Disfruta la experiencia";
            alertRef.current.className = "alert alert-success"
          }
    }, 3000)
  },[])

  useEffect(() => {
    const expensesLocal = localStorage.getItem("expensesLocal");
    if(expensesLocal){
      const parsed = JSON.parse(expensesLocal);
      (Array.isArray(parsed) && parsed.length > 0) ? setExpenses(parsed) : "";
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("expensesLocal",JSON.stringify(expenses));
    precioRef.current.innerText = expenses.reduce((sumatorio, expensa) => sumatorio + Number(expensa.amount), 0)
  },[expenses]);

  return (
    <>
      <Alert
        alertRef={alertRef}
      />
      <div className='App'>
        <ExpenseForm 
          charge={charge}
          amount={amount}
          handleCharge={handleCharge}
          handleAmount={handleAmount}
          handleSubmit={handleSubmit}
        />

        <ExpenseList 
          expenses={expenses}
          handleDelete={handleDelete}
          clearItems={clearItems}
        />

        <Precio
          precioRef={precioRef}
        />
      </div>
    </>
  )
}


