import React, { useState, useRef } from 'react';
import QRCode from "react-qr-code";
import * as htmlToImage from 'html-to-image';

const QRCodegenerateurs = () => {
    const [text, setText] = useState('');
    const qrCodeRef = useRef(null);

    function handleChange(e) {
        setText(e.target.value);
    }

    async function convertQRCodeToImage() {
        try {
            // Convertir le QR code en une image
            const qrCodeImage = await htmlToImage.toPng(qrCodeRef.current);
            console.log('QR code converted to image:', qrCodeImage);
            // Ici, vous pouvez enregistrer ou traiter l'image selon vos besoins
        } catch (error) {
            console.error('Error converting QR code to image:', error);
        }
    }

    return (
        <div>
            <div className="input-here">
                <QRCode ref={qrCodeRef} value={text} />
                <input type="text" value={text} onChange={handleChange} />
                <button onClick={convertQRCodeToImage}>Convert to Image</button>
            </div>
        </div>
    );
};

export default QRCodegenerateurs;
