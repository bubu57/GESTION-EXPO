import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EnregistrementExpo from "./pages/enregistrement_expo";
import ListesExpos from "./pages/Listes-expos.js";
import GenerateurQRCode from "./pages/QRCode-generateur.js";
import Historique from "./pages/historique.js";
import FormEnregistrement from './pages/Formulaire-enregistrement.js'

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<EnregistrementExpo />} />
                <Route path="/listes-expositions" element={<ListesExpos />} />
                <Route path="/qrcode" element={<GenerateurQRCode />} />
                <Route path="/historique" element={<Historique />} />
                <Route path="/formulaire-enregistrement" element={<FormEnregistrement />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;