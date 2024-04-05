import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EnregistrementExpo from "./pages/register_expo.js";
import ListesExpos from "./pages/liste_expo.js";
import HistoExpo from "./pages/graph.js";
import FormEnregistrement from './pages/register_user.js'
import Header from './pages/header.js'
import Login from './pages/login.js'
import ProtectedRoute from './pages/protectedroute.js';


const App = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ListesExpos />} />
                <Route path="/historique" element={<HistoExpo />} />
                <Route path="/register_user" element={<FormEnregistrement />} />
                <Route path="/header" element={<Header />} />
                <Route path="/login" element={<Login />} />
                <ProtectedRoute
                    exact
                    path="/register_expo"
                    component={EnregistrementExpo}
                    loggedIn={loggedIn}
                />
            </Routes>
        </BrowserRouter>
    );
};


export default App;