import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EnregistrementExpo from "./pages/register_expo.js";
import ListesExpos from "./pages/liste_expo.js";
import HistoExpo from "./pages/historique.js";
import FormEnregistrement from './pages/register_user.js'
import Header from './pages/header.js'
import Login from './pages/login.js'
import EmailRestAPI from "./pages/EmailRestAPI.jsx"
const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ListesExpos />} />
                <Route path="/register_expo" element={<EnregistrementExpo />} />
                <Route path="/historique" element={<HistoExpo />} />
                <Route path="/register_user" element={<FormEnregistrement />} />
                <Route path="/header" element={<Header />} />
                <Route path="/email" element={<EmailRestAPI />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
};


export default App;