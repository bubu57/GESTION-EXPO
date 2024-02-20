import React, { useState, useRef } from 'react';
import QRCode from "react-qr-code";
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';

const QRCodegenerateurs = () => {
    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        mail: '',
        date_debut: '',
        date_fin: ''
    });
    const qrCodeRef = useRef(null);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    async function convertQRCodeToPdf() {
        try {
            
            const qrCodeImage = await htmlToImage.toPng(qrCodeRef.current);


            const doc = new jsPDF();
            doc.addImage(qrCodeImage, 'PNG', 10, 10, 50, 50); 
            doc.save('qrcode.pdf'); 

            console.log('QR code converted to PDF');
        } catch (error) {
            console.error('Error converting QR code to PDF:', error);
        }
    }

    return (
        <div>
            <div className="input-here">
                <input type="text" name="prenom" placeholder="Prenom" value={formData.prenom} onChange={handleChange} />
                <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} />
                <input type="text" name="mail" placeholder="Mail" value={formData.mail} onChange={handleChange} />
                <input type="date" name="date_debut" value={formData.date_debut} onChange={handleChange} />
                <input type="date" name="date_fin" value={formData.date_fin} onChange={handleChange} />
                <QRCode ref={qrCodeRef} value={`${formData.prenom} ${formData.nom} ${formData.mail} ${formData.date_debut} ${formData.date_fin}`} />
                <button onClick={convertQRCodeToPdf}>Convert to PDF</button>
            </div>
        </div>
    );
};

export default QRCodegenerateurs;
