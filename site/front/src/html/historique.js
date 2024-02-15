import React from 'react';
import poly from './poly.png';
import logo from './logo.svg';
import ProfilLabel from './Button.png'
import ButtonReserved from './Button-reserved.svg'
import Elipse from './Ellipse.svg'
import Search from './Search.svg'
import { Link } from 'react-router-dom';
import ButtonRedFinished from'./button-red.svg'
import Close from './Close.svg'
import Header from './header';

const Historique = ({ formData, handleChange, handleSubmit }) => {
    return (

      <div>
        <Header></Header>

        <div>
          
      <div>
      <p class='title-expo-historique'>Expositions passées </p>
      </div>
      <div class="img-profile">
        <button>
          <img src={ProfilLabel} alt='' />
          </button>
          </div>
        
      
        <div className='header-boutton'>
          <p className='heder-boutton-txt'></p>
        </div>
      </div>

      <div className='colonne-container'>
        <div className='colonne col1'>



          <div className='expo'>
            <p className='expo-titre'></p>
            <div className='expo-content'>
              <Link to ="/qrcode">
                <img src={Close}></img>
                <button><img src = {ButtonRedFinished } alt='' class='img-button'></img></button>
              </Link>
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
        <div className='colonne col2'>



          <div className='expo'>
            <p className='expo-titre'></p>
            <div className='expo-content'> <Link to ="/formulaire-enregistrement">
                <button><img src = {ButtonReserved } alt='' class='img-button'></img></button>
              </Link>
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
            <Link to ="/qrcode">
                <button><img src = {ButtonReserved } alt='' class='img-button'></img></button>
              </Link>
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
</div>


          </div>
      
      );
  };
  
  export default Historique;