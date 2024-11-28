import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginRegistration from './views/LoginRegistration';

const App = () => {

  return (
    <>
      <Routes>
        <Route exact path="/" element={<LoginRegistration />} />
      </Routes>
    </>
  );
}

export default App;