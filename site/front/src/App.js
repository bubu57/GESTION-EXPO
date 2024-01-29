import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EnregistrementExpo from "./pages/enregistrement_expo";


const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<EnregistrementExpo />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;