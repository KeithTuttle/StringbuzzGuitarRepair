import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { HashRouter as Router, Route } from "react-router-dom";
import './App.css';

import Navbar from "./components/navbar.component";
import Home from "./components/home.component";
import RegisterUser from "./components/register-user.component";
import LoginUser from "./components/login-user.component";
import ContactUs from "./components/contact.component";

function App() {
  return (
    <Router>
      <Navbar />
      <br/>
      <Route path="/" exact component={Home} />
      <Route path="/register" exact component={RegisterUser} />
      <Route path="/login" exact component={LoginUser} />
      <Route path="/contact" exact component={ContactUs} />
    </Router>
  );
}

export default App;
