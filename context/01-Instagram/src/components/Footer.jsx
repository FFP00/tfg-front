import { useState } from "react"

export default function Footer(){
    
    const [corazon,setCorazon] = useState(false);
    const [guardado,setGuardado] = useState(false);
    const [contadorCorazon,setContadorCorazon] = useState(0);
    const [contadorGuardado,setContadorGuardado] = useState(0);

    function handleCorazonContador(){
        setCorazon(!corazon);
        setContadorCorazon(prev => prev + 1);
    }

    function handleGuardadoContador(){
        setGuardado(!guardado);
        setContadorGuardado(prev => prev + 1);
    }
    return(
        <div className="footer">
            <div className="footer-icons">
                <span className={!corazon ? "corazon" : "corazon_active"} id="corazon" onClick={() => handleCorazonContador()}></span>
                <span className="burbuja" id="b1"></span>
                <span className="enviar" id="e1"></span>
                <div className="guardar-icon-container">
                    <span className={!guardado ? "guardar" : "guardar_active"} id="guardar" onClick={() => handleGuardadoContador()}></span>
                </div>
            </div>
            <div className="caption-container">
                <h4><span>Likes: {contadorCorazon}</span> Likes</h4>
                <h4><span>Guardados: {contadorGuardado}</span> Likes</h4>
                <div className="caption">
                    <h4>Pedro_Terminator</h4> 
                    <br></br>
                    <span>
                        Hola Estoy muy feliz!!! aprediendo React
                        JS. Mira mi gato.
                    </span>
                </div>
            </div>
        </div>
    )
}