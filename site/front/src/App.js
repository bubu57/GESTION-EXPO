import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EnregistrementExpo from "./pages/register_expo.js";
import ListesExpos from "./pages/liste_expo.js";
import GenerateurQRCode from "./pages/QRCode-generateur.js";
import Historique from "./pages/historique.js";
import FormEnregistrement from './pages/register_user.js'
import Header from './pages/header.js'
import EmailRestAPI from "./pages/EmailRestAPI.jsx"
import Test from "./pages/test.js"
const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<EnregistrementExpo />} />
                <Route path="/liste_expo" element={<ListesExpos />} />
                <Route path="/qrcode" element={<GenerateurQRCode />} />
                <Route path="/historique" element={<Historique />} />
                <Route path="/register_user" element={<FormEnregistrement />} />
                <Route path="/header" element={<Header />} />
                <Route path="/email" element={<EmailRestAPI />} />
                <Route path="/test" element={<Test />} />
            </Routes>
        </BrowserRouter>
    );
};


export default App;