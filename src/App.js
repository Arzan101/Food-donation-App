import React, { useEffect } from 'react';
import './App.css';
import Header from './Header';
import Home from './Home'
import Checkout from './Checkout'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from './Login';
import { auth } from './firebase';

function App() {
  
  useEffect(() =>{
    //will only run once when app component is loaded.
    auth.onAuthStateChanged(
      authUser => {
        console.log('THE USER IS :', authUser);
     
      if (authUser){
        //user just logged in / user was logged in
      }
      else{
        //user logged out
      }
    })
  }, [])

  
  return (
   <Router>
    <div className="app">
     <Switch>
     <Route path="/Login">
     <Login />
      </Route>
      <Route path="/checkout">
         <Header />
         <Checkout/>
      </Route>

       <Route path="/">
          <Header />
          <Home />
       </Route>

      </Switch>

    </div>
    </Router>
  );
}

export default App;
