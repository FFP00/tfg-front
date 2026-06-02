import "./Input.css";

export default function Input({ text, result, resultRef,textRef }){
  return (
    <div className="input-wrapper">
      <div ref={resultRef} className="result">
        <h1>{result}</h1>
      </div>

      <div ref={textRef} className="text">
        <h3>{text}</h3>
      </div>
    </div>
  );
};