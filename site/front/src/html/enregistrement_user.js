import React from 'react';
import DownCircle from './Down-circle.svg'
import ButtonReserved from './Button-reserved.svg'
import Expoimg from './expo.jpg'
import { Link } from 'react-router-dom';
const FormEnregistrement = ({ formData, handleChange, handleSubmit }) => {
    return (
<div className='container'>
    <Header></Header>
    <div className='img'></div>
    <div className='form'>
    <center><p className='title'>Enregistrement exposition</p></center>
    <form onSubmit={handleSubmit}>
        <div className='form-block'>
        <div className='form-name'>
            <p className='label'>Nom exposition</p>
            <p className='label'>Date debut</p>
            <p className='label'>Date fin</p>
            <p className='label'>Quota</p>
            <p className='label'>Genre</p>
            <p className='label'>Adresse</p>
            <p className='label'>Lattitude</p>
            <p className='label'>Longitude</p>
        </div>
        <div className='form-input'>
            <div className='div-input'>
            <input
                className='nom'
                type="text"
                placeholder="Paris exposition"
                name="nom"
                value={formData.nom}
                onChange={handleChange} 
            />
            </div>
            <div className='div-input'>
            <input
                className='date_debut'
                type="text"
                placeholder="21/02/2024"
                name="date_debut"
                value={formData.date_debut}
                onChange={handleChange}
            />
            </div>
            <div className='div-input'>
            <input
                className='date_fin'
                type="text"
                placeholder="22/02/2024"
                name="date_fin"
                value={formData.date_fin}
                onChange={handleChange}
            />
            </div>
            <div className='div-input'>
            <input
                className='quota'
                type="text"
                placeholder="200"
                name="quota"
                value={formData.quota}
                onChange={handleChange}
            />
            </div>
            <div className='div-input'>
            <input
                className='type'
                type="text"
                placeholder="Art"
                name="type"
                value={formData.type}
                onChange={handleChange}
            />
            </div>
            <div className='div-input'>
            <input
                className='lieu'
                type="text"
                placeholder="13 bis rue de paris 54000 paris"
                name="lieu"
                value={formData.lieu}
                onChange={handleChange}
            />
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                    <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                    {suggestion}
                    </li>
                ))}
                </ul>
            )}
            </div>
            <div className='div-input'>
            <input
                className='Lattitude'
                type="text"
                placeholder="48.6896627"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                disabled
            />
            </div>
            <div className='div-input'>
            <input
                className='Longitude'
                type="text"
                placeholder="6.1880792"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                disabled
            />
            </div>
            <p className='coordonnee' >* La lattitude et la longitude seront auto completere</p>
        </div>
        </div>
        <center>
            <button type="submit" className='button-text'>Enregistrer</button>
        </center>
    </form>
    </div>
</div>
);
};

export default FormEnregistrement;