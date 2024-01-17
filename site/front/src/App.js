import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

const App = () => { 
  const [msg, setMsg] = useState('')
  const HandleClick = async () => {
    const data = await window.fetch('api/app');
    const json = await data.json();
    const msg = json.msg

    setMsg(msg)
  }


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={HandleClick}>Bonjour</button>
        <p>{msg}</p>
      </header>
    </div>
  );
}

export default App;
