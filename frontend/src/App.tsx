import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { HashRouter as Router, Route } from "react-router-dom";
import './App.css';

import Navbar from "./components/navbar.component";
import Home from "./components/home.component";
import Footer from "./components/footer.component";
import RegisterUser from "./components/register-user.component";
import LoginUser from "./components/login-user.component";
import ContactUs from "./components/contact.component";
import ViewInstrument from "./components/view-instrument.component";
import MakeAppointment from "./components/make-appointment.component";
import RepairData from "./components/repair-data.component";
import AccountInfo from "./components/account-info.component";

function App() {
  return (
    <Router>
      <Navbar />
      <br/>
      <Route path="/" exact component={Home} />
      <Route path="/register" exact component={RegisterUser} />
      <Route path="/login" exact component={LoginUser} />
      <Route path="/contact" exact component={ContactUs} />
      <Route path="/view-instrument" exact component={ViewInstrument} />
      <Route path="/appointment" exact component={MakeAppointment} />
      <Route path="/repairs" exact component={RepairData} />
      <Route path="/account-info" exact component={AccountInfo} />
      <Footer />
    </Router>
  );
}

export default App;
