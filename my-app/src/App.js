// import React from 'react';
import React, { Component } from 'react';

import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';

function App() {
  return (
      <Router>
        <Switch>
          <Route exact path="/" component={Login}></Route>
          <Route path="/home" component={Home}></Route>
        </Switch>
      </Router>
  );
}

export default App;

