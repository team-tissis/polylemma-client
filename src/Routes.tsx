import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App';
import Sample from './Sample';

export const RouterConfig:React.VFC =() => {
  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="sample/:id" element={<Sample />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}
