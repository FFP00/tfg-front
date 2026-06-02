import './App.css'

import Input from './components/Input'
import Button from './components/Button'

import { useRef, useState } from 'react'
import { create, all } from 'mathjs';

export default function App() {

  const [text,setText] = useState("");
  const [result,setResult] = useState("");
  const resultRef = useRef(null); 
  const textRef = useRef(null); 
  const math = create(all);

  function handleClick(symbol){
    if(symbol == "="){
      setResult(math.evaluate(resultRef.current.innerText + textRef.current.innerText))
      setText("")
    }else if(symbol == "Clear"){
      setResult("")
      setText("")
    }else{
      setText(prev => prev + symbol)
    }
  }



  return (
    <>
    <div className='.App'>
      <div className='calc-wrapper'>
        
        <Input 
          text={text} 
          result={result}
          resultRef={resultRef}
          textRef={textRef}
        />

        <div className='row'>
          <Button symbol={7} color={"gray"} handleClick={handleClick}/>
          <Button symbol={8} color={"gray"} handleClick={handleClick}/>
          <Button symbol={9} color={"gray"} handleClick={handleClick}/>
          <Button symbol={"/"} color={"orange"} handleClick={handleClick}/>
        </div>
        <div className='row'>
          <Button symbol={4} color={"gray"} handleClick={handleClick}/>
          <Button symbol={5} color={"gray"} handleClick={handleClick}/>
          <Button symbol={6} color={"gray"} handleClick={handleClick}/>
          <Button symbol={"*"} color={"orange"} handleClick={handleClick}/>
        </div>
        <div className='row'>
          <Button symbol={1} color={"gray"} handleClick={handleClick}/>
          <Button symbol={2} color={"gray"} handleClick={handleClick}/>
          <Button symbol={3} color={"gray"} handleClick={handleClick}/>
          <Button symbol={"+"} color={"orange"} handleClick={handleClick}/>
        </div>
        <div className='row'>
          <Button symbol={0} color={"gray"} handleClick={handleClick}/>
          <Button symbol={"."} color={"gray"} handleClick={handleClick}/>
          <Button symbol={"="} color={"gray"} handleClick={handleClick}/>
          <Button symbol={"-"} color={"orange"} handleClick={handleClick}/>
        </div>
        <div className='row'>
          <Button symbol={"Clear"} color={"red"} handleClick={handleClick}/>
        </div>

      </div>
    </div>
    </>
  )
}


