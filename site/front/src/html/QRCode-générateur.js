import React from 'react';

import QRCode from "react-qr-code";
import {useState} from "react";


const GenerateurQRCode = ({ formData, handleChange, handleSubmit }) => {
    const [text, setText] = useState('')
    function generateQR(e){
        setText()
    }

    function handleChange(e){
        setText(e.target.value)
    }
    return (  

<div>

    <div className="input-here">
        <QRCode value ={text} />
<p>Entrer le texte </p>
<input type ="text" value={text} onChange={(e)=>{handleChange(e)}} />


    </div>
        </div>
     
     );
};

export default GenerateurQRCode;