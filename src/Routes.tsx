import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App';
import BattleMain from './components/home/battle_main.js'
import MatchMake from './components/home/match_make.js'
export const RouterConfig:React.VFC =() => {
  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="/battle_main" element={<BattleMain />} />
        <Route path="/match_make" element={<MatchMake />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}
