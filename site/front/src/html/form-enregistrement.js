import React from 'react';
import DownCircle from './Down-circle.svg'
import ButtonReserved from './Button-reserved.svg'
import Expoimg from './expo.jpg'
import { Link } from 'react-router-dom';
const FormEnregistrement = ({ formData, handleChange, handleSubmit }) => {
    return (
      <div>
      <div>
    
</div>



<div className='form-register'>
<p className='title-form'> Formulaire d'enregistrement </p>
<div className='name'>
<p>Nom</p><div className='Name-text'>
        
        <textarea id="zoneTexte" placeholder="Saisissez votre texte ici..."></textarea>
    </div>
<p className='prenom'> Prénom</p>
<div className='Name-text'>
        
        <textarea id="zoneTexte" placeholder="Saisissez votre texte ici..."></textarea>
    </div>
</div>


<p className='email'>Email</p>
<div className='email-text'>
        
        <textarea id="zoneTexte" placeholder="Saisissez votre texte ici..."></textarea>
    </div>

<p className='date'>Date</p>
<div className='date-text'>
        
        <textarea id="zoneTexte" placeholder="Saisissez votre texte ici..."></textarea>
    </div>

</div>
<div className='button-listes-expos'>
    <p className='text-listes-form'>
    Listes des expositions </p>
    <Link to ='/listes-expositions'>    <button className='button-arrow'>
        
        <img src ={DownCircle}></img>
    </button></Link>

  
</div > <div className='img-register'>
<Link to ='/qrcode'> 
    <img src={ButtonReserved}></img></Link>
</div>

</div>
);
};

export default FormEnregistrement;