import React from "react";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const NavRoutes = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default NavRoutes;
