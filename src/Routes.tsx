import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App';
import Sample from './Sample';
import BattleMain from './components/home/battle_main.js'

export const RouterConfig:React.VFC =() => {
  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="sample/:id" element={<Sample />} />
        <Route path="/battle_main" element={<BattleMain />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}
