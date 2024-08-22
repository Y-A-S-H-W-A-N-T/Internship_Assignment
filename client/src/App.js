// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './screens/dashboard'
import Topic from './screens/topic';
import Player from './screens/player'
import axios from 'axios'
import Login from './screens/login';
import Profile from './screens/profile';

const App = () => {

  axios.create({
    baseURL: 'http://localhost:8000'
  })

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/:topic" element={<Topic />} />
        <Route path="/:topic/:id" element={<Player />} />
      </Routes>
    </Router>
  );
};

export default App;