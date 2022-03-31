import { Nav, Navbar,Button } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Link, useHistory, Redirect } from 'react-router-dom';
// import Homepage from './components/home/homepage';
import Registration from './components/home/usersLogin/register/registration';
import Login from './components/home/usersLogin/login/login';
import ResetPass from "../src/components/home/usersLogin/resetPassword/resetPass"
import NewPass from './components/home/usersLogin/newPassword/newPassword';
import Header from './components/home/Header';
import EditUser from './components/home/usersLogin/editUser/editUser';
import { useEffect } from 'react';
import Homepage from './components/home/homepage';
import Maps from "./components/home/mapElectionPage/maps"
import ActivateNewUser from './components/home/usersLogin/register/activateNewUser';
import ReactPayPal from './components/home/payment/paymentPaypal';
import WebsiteManagement from './components/home/backOfficePage/websiteManagement';





 

function App() {

  return (
    
    <div>
        <Router>
      <Header/>
      <Switch>
        <Route exact path="/home"><Homepage/></Route>
        <Route exact path="/"><Homepage/></Route>
        <Route exact path="/mapsElection"><Maps/></Route>
        <Route exact path="/editUser" ><EditUser/></Route>
        <Route exact path="/register" ><Registration/></Route>
        <Route exact path="/login"><Login/></Route>  
        <Route exact path="/reset" ><ResetPass/></Route> 
        <Route exact path="/reset-confirm/:token"><NewPass/></Route>  
        <Route exact path="/activate-newUser/:token"><ActivateNewUser/></Route> 
        <Route exact path="/payment" ><ReactPayPal/></Route> 
        <Route exact path="/backOffice" ><WebsiteManagement/></Route> 
      </Switch>



    </Router>




 </div>
  );
}

export default App;
