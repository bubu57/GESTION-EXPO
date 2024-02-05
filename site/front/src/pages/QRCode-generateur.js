import QRCode from "react-qr-code";
import React, { useState } from 'react';
import axios from 'axios';


const QRCodegenerateurs = () => {

    const [text, setText] = useState('')
    function handleChange(e){
        setText(e.target.value)
    }

    return (  
    <div>
        <div className="input-here">
            <QRCode value ={text} />
            <input type ="text" value={text} onChange={(e)=>{handleChange(e)}} />
        </div>
    </div>
    );
};

export default QRCodegenerateurs;