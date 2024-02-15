import React from 'react';
import { Link } from 'react-router-dom';
import Header from './header';
import ButtonCours from './Button-cours.svg';
import ButtonRedFinished from './button-red.svg';


const handleClick = () => {


  };



const Historique = ({ formData, handleChange, handleSubmit }) => {
    return (
        <div>
   <Header>

   </Header>
    <div className='container-histo'>
    
     <h className="titre-histo">Expositions passés</h>
     </div>

    </div>
    );
};

export default Historique;
<button onClick={handleClick}><Link to= "/register_user"><img src={ButtonCours} alt=''></img></Link></button>;
    <button onClick={handleClick}><Link to= "/info-expopasse"><img src={ButtonRedFinished} alt=''></img></Link></button>;