
import { BrowserRouter as Router, Switch, Route, Link, useHistory, Redirect } from 'react-router-dom';
import Registration from './components/home/usersLogin/register/registration';
import Login from './components/home/usersLogin/login/login';
import ResetPass from "../src/components/home/usersLogin/resetPassword/resetPass"
import NewPass from './components/home/usersLogin/newPassword/newPassword';
import Header from './components/home/Header';
import EditUser from './components/home/usersLogin/editUser/editUser';
import { useEffect, useState } from 'react';
import Homepage from './components/home/homepage/homepage';
import Maps from "./components/home/mapElectionPage/maps"
import ActivateNewUser from './components/home/usersLogin/register/activateNewUser';
import ReactPayPal from './components/home/payment/paymentPaypal';
import WebsiteManagement from './components/home/backOfficePage/websiteManagement';
import { Alert } from '@mui/material';
import "./App.css"
const token = JSON.parse(localStorage.getItem("loginToken"))





 

function App() {

  const NotFound = () => (
    <div className='alertNotFound'>
      <Alert variant="filled" severity="error" >404 - Not Found!</Alert>
      <Link className='link' to="/">Go Home</Link>
    </div>
  );
  

  return (
    
    <div>
        <Router>
        <Header/>
      <Switch>
     
       
        <Route exact path="/home"><Homepage/></Route>
        <Route exact path="/"><Homepage/></Route>
        <Route exact path="/mapsElection">{token ?<Maps/>:<Redirect to={'/login'}/>}</Route>
        <Route exact path="/editUser" >{token ? <EditUser/>:<Redirect to={'/login'}/>}</Route>
        <Route exact path="/register" ><Registration/></Route>
        <Route exact path="/login"><Login/></Route>  
        <Route exact path="/reset" ><ResetPass/></Route> 
        <Route exact path="/reset-confirm/:token"><NewPass/></Route>  
        <Route exact path="/activate-newUser/:token"><ActivateNewUser/></Route> 
        <Route exact path="/payment" >{token ? <ReactPayPal/>:<Redirect to={'/login'}/>}</Route> 
        <Route exact path="/backOffice">{token ? <WebsiteManagement/>:<Redirect to={'/login'}/>}</Route> 
        <Route exact  path="*" component={NotFound}/>
      </Switch>



    </Router>




 </div>
  );
}

export default App;
