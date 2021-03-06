import React, { Component } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

class App extends Component{
  render(){
    return(
      <Router>
      <div className="App">
        <Navbar />
        <Route  exact path="/" component = { Landing } />
        <Route  exact path="/register" component = { Register } />
        <Route  exact path="/login" component = { Login } />
        <Footer />
        </div>
        </Router>
    );
  }
}
export default App;
