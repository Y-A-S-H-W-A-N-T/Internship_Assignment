// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './screens/dashboard'
import Topic from './screens/topic';
import Player from './screens/player'
import axios from 'axios'

const App = () => {

  axios.create({
    baseURL: 'http://localhost:8000'
  })

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/:topic" element={<Topic />} />
        <Route path="/:topic/:id" element={<Player />} />
      </Routes>
    </Router>
  );
};

export default App;