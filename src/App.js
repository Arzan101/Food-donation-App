//App.js
import React, {useEffect, useState} from 'react'; 
import "./App.css";
import Header from'./Header';
import Home from'./Home';
import Checkout from './Checkout';
import Payment from './Payment';
import { BrowserRouter as Router,Switch, Route } from "react-router-dom";
import Login from './Login';
import { auth } from './firebase';
import { useStateValue } from './StateProvider';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Orders from "./Orders";
import FirstPage from './FirstPage';
import Share from './Share';
import Collect1 from './Collect1';

const promise = loadStripe("pk_test_51KZRkQSHV4CwkIjNz1qcBXbXwvaK1rQEa0o8n9HW8tUb2wQHkOpD6WTdxBCPYn3cOfDRIFrnL0giHZOrnMJfdZfF00S0Uqmqfp");

function App() {
  const [{}, dispatch] = useStateValue();
  
  
    useEffect(() => {
      auth.onAuthStateChanged(
       authUser => {
        console.log('THE USER IS :', authUser);
       
       if(authUser){
          dispatch({
            type: 'SET_USER',
            user: authUser
          })
        
       } 
       else{
           dispatch(
             {
               type: 'SET_USER',
               user: null
             }
           )
       }
      })
    }, [])
  
    return (
      <Router>
        <div className="App">
          <Switch>
          <Route path="/Orders">
              <Header />
              <Orders />
            </Route>
            <Route path="/login">
              <Login/>
            </Route>
            <Route path="/Firstpage">
            <FirstPage/>
          </Route>

          <Route path="/Home">
            <Header/>
            <Home/>
          </Route>

          <Route path="/Collect1">
            <Header/>
            <Collect1/>
          </Route>

          <Route path="/Share">
          <Header/>
          <Share/>
          </Route>
          

              <Route path="/Checkout">
                <Header />
                <Checkout />
              </Route>
              <Route path="/payment">
                <Header />
                <Elements stripe={promise}>
                  <Payment />
                </Elements>
              </Route>
              <Route path="/">
               
                <FirstPage />
              </Route>   
          </Switch>
        </div>
      </Router>
    );
  }
  
  export default App;
