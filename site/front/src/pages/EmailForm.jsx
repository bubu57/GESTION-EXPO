import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const EmailForm = () => {
  const [senderName, setSenderName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState(''); // Ajout du state pour l'adresse e-mail du destinataire
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const serviceId = 'service_0v2mvem';
    const templateId = 'template_qrnfd99';
    const publicKey = 'CWK-4Od19eqgeZfus';

    const templateParams = {
      from_name: senderName,
      to_email: recipientEmail, 
      message: message,
    };

    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        console.log('Email sent successfully!', response);
        setSenderName('');
        setRecipientEmail('');
        setMessage('');
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  }

  return (
    <form onSubmit={handleSubmit} className='emailForm'>
      <input
        type="text"
        placeholder="Votre Nom"
        value={senderName}
        onChange={(e) => setSenderName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email du receveur" 
        value={recipientEmail}
        onChange={(e) => setRecipientEmail(e.target.value)}
      />
      <textarea
        cols="30"
        rows="10"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Envoyez Email</button>
    </form>
  )
}

export default EmailForm;