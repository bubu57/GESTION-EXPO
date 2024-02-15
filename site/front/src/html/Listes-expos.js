// EnregistrementExpoForm.js
import React from 'react';
import poly from './poly.png';
import logo from './logo.svg';
import ProfilLabel from './Button.png'
import ButtonReserved from './Button-reserved.svg'
import Elipse from './Ellipse.svg'
import Search from './Search.svg'
import { Link } from 'react-router-dom';


const EnregistrementVisiteur = ({ formData, handleChange, handleSubmit }) => {
  return (
    
    <div>
          <img src={logo} alt='' class='img-logo'/>
        
      <div className='header'>
    

        <p className='text-expo'>Expositions</p>
        <p className = 'text-venir'>à venir</p> 
        <p className='text-enregistrement'>Enregistrement</p>
        <p className='text-historique'>Historique</p>
        <p className='date'>Date</p>
      <div className='date-text-listes-expos'>
        
        <textarea id="zoneTexte" placeholder="Saisissez une date ici..."></textarea>
    </div>

    <p className='heure'>Heure</p>
      <div className='heure-text-listes-expos'>
        
        <textarea id="zoneTexte" placeholder="Saisissez une heure ici..."></textarea>
    </div>
        <Link to ="/historique">
          <div >
        <button>
        <img src = {poly} className='button-histo'></img>
        
        </button>
        </div>
        </Link>
      <div>
      <h>Liste des expositions</h>
      </div>
 
       
        <div className='header-boutton'>
          <p className='heder-boutton-txt'></p>
        </div>
      </div>

      
      <div className='search'>
        <img src={Search}></img>
        <p className='search-txt'></p>

      </div>

      <div className='colonne-container'>
        <div className='colonne col1'>



          <div className='expo'>
            <p className='expo-titre'></p>
            <div className='expo-content'>
           <div className='button-reserved-1'> <Link to ="/formulaire-enregistrement">
                <button><img src = {ButtonReserved } alt=''></img></button>
              </Link></div>
              <div className='expo-label'>
                <p className='expo-label-txt'>Type</p>
                <p class="expo-label-quota"> Quota </p>
                <p class="expo-label-date"> Date </p>
                <p class="expo-label-ville"> Ville </p>
              </div>

              <div className='expo-boutton'>
                <p className='expo-boutton-txt'></p>
              </div> 
            </div>





          </div>
        </div>
        
        <div className='colonne-container'>
        <div className='rectangle'>



          <div className='expo'>
            <p className='expo-titre'></p>
            <div className='expo-content'>
              <div className='button-reserved-2'>
            <Link to ="/formulaire-enregistrement">
                <button><img src = {ButtonReserved } alt=''></img></button>
              </Link>
              </div>
              <div className='expo-label'>
                <p className='expo-label-txt'>Type</p>
                <p class="expo-label-quota"> Quota </p>
                <p class="expo-label-date"> Date </p>
                <p class="expo-label-ville"> Ville </p>
              </div>

              <div className='expo-boutton'>
                <p className='expo-boutton-txt'></p>
              </div> 
            </div>





          </div>
        </div>

        
        </div>

        <div className='colonne-col3'>
        <div className='rectangle'>



          <div className='expo'>
            <p className='expo-titre'></p>
            <div className='expo-content'>
              <div className='button-reserved-2'>
            <Link to ="/formulaire-enregistrement">
                <button><img src = {ButtonReserved } alt=''></img></button>
              </Link>
              </div>
              <div className='expo-label'>
                <p className='expo-label-txt'>Type</p>
                <p class="expo-label-quota"> Quota </p>
                <p class="expo-label-date"> Date </p>
                <p class="expo-label-ville"> Ville </p>
              </div>

              <div className='expo-boutton'>
                <p className='expo-boutton-txt'></p>
              </div> 
            </div>





          </div>
        </div>
        </div>
        
        <div className='colonne-col4'>
        <div className='rectangle'>



          <div className='expo'>
            <p className='expo-titre'></p>
            <div className='expo-content'>
              <div className='button-reserved-2'>
            <Link to ="/formulaire-enregistrement">
                <button><img src = {ButtonReserved } alt=''></img></button>
              </Link>
              </div>
              <div className='expo-label'>
                <p className='expo-label-txt'>Type</p>
                <p class="expo-label-quota"> Quota </p>
                <p class="expo-label-date"> Date </p>
                <p class="expo-label-ville"> Ville </p>
              </div>

              <div className='expo-boutton'>
                <p className='expo-boutton-txt'></p>
              </div> 
            </div>





          </div>
        </div>
        </div>
</div>
<div className='colonne-col5'>
        <div className='rectangle'>



          <div className='expo'>
            <p className='expo-titre'></p>
            <div className='expo-content'>
              <div className='button-reserved-2'>
            <Link to ="/formulaire-enregistrement">
                <button><img src = {ButtonReserved } alt=''></img></button>
              </Link>
              </div>
              <div className='expo-label'>
                <p className='expo-label-txt'>Type</p>
                <p class="expo-label-quota"> Quota </p>
                <p class="expo-label-date"> Date </p>
                <p class="expo-label-ville"> Ville </p>
              </div>

              <div className='expo-boutton'>
                <p className='expo-boutton-txt'></p>
              </div> 
            </div>





          </div>
        </div>
        </div>
        <div className='colonne-col6'>
        <div className='rectangle'>



          <div className='expo'>
            <p className='expo-titre'></p>
            <div className='expo-content'>
              <div className='button-reserved-2'>
            <Link to ="/formulaire-enregistrement">
                <button><img src = {ButtonReserved } alt=''></img></button>
              </Link>
              </div>
              <div className='expo-label'>
                <p className='expo-label-txt'>Type</p>
                <p class="expo-label-quota"> Quota </p>
                <p class="expo-label-date"> Date </p>
                <p class="expo-label-ville"> Ville </p>
              </div>

              <div className='expo-boutton'>
                <p className='expo-boutton-txt'></p>
              </div> 
            </div>





          </div>
        </div>
        </div>
</div>

  
    
    );
};


export default EnregistrementVisiteur;