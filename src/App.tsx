import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InvitationPage from './pages/InvitationPage';

// const base = import.meta.env.MODE === 'production' ? '/sb1-5tb6c3gu/' : '/';
const base = "/"

function App() {
  return (
    <BrowserRouter basename={base}>
      <Routes>
        <Route path="/" element={<InvitationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
