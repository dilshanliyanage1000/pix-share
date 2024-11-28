import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginRegistration from './views/LoginRegistration';
import Home from './views/Home';

const App = () => {

  return (
    <>
      <Routes>
        <Route exact path="/" element={<LoginRegistration />} />
        <Route exact path="/home" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;