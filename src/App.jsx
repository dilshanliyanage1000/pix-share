import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginRegistration from './views/LoginRegistration';
import Home from './views/Home';
import CreatePost from './views/CreatePost';
import Post from './views/Post';
import Profile from './views/Profile';

const App = () => {

  return (
    <>
      <Routes>
        <Route exact path="/" element={<LoginRegistration />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/create" element={<CreatePost />} />
        <Route exact path="/post/:postId" element={<Post />} />
        <Route exact path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;