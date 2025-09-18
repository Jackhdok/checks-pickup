import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/check-in" replace />} />
        <Route path="/check-in" element={<App initialView="public" />} />
        <Route path="/admin" element={<App initialView="admin" />} />
        <Route path="*" element={<Navigate to="/check-in" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

