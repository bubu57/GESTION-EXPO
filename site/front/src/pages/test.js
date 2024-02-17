import React, { useRef } from 'react';
import QRCode from 'react-qr-code';
import htmlToImage from 'html-to-image';
import nodemailer from 'nodemailer';

const QRCodeComponent = () => {
  const qrCodeRef = useRef(null);

  const handleSendEmail = async () => {
    // Convertir le composant QR code en image
    const dataUrl = await htmlToImage.toPng(qrCodeRef.current);

    // Configurer le service d'envoi d'email (nodemailer)
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'bunelierpro@gmail.com',
        pass: '@t2B95sT57970'
      }
    });

    // Configurer l'e-mail
    let mailOptions = {
      from: 'bunelierpro@gmail.com',
      to: 'bunelierpro@example.com',
      subject: 'QR Code',
      text: 'Voici votre QR Code',
      html: '<img src="' + dataUrl + '">'
    };

    // Envoyer l'e-mail
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email envoyé: ' + info.response);
      }
    });
  };

  return (
    <div ref={qrCodeRef}>
      <QRCode value="VotreDonnée" />
      <button onClick={handleSendEmail}>Envoyer par e-mail</button>
    </div>
  );
};

export default QRCodeComponent;
