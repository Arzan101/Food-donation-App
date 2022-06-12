import { Card } from '@mui/material';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import CurrencyFormat from 'react-currency-format';
import { useHistory } from 'react-router-dom';
import CheckoutProduct from './Checkoutproduct';
import "./Payment.css"
import { getCartTotal } from './reducer';
import { useStateValue } from './StateProvider';

function Payment() {
    const [{cart,user},dispatch] = useStateValue();

    const stripe= useStripe();
    const elements = useElements();
    const history = useHistory();
    const [error,setError]= useState(null);
    const[disabled, setDisabled]= useState(true);
    const[processing, setProcessing]=useState("");
    const [succeeded, setSucceeded] =useState(false);
    const[clientSecret,SetClientSecret]=useState(true);
     

    useEffect(()=>{
      //generate the special stripe secret which allows to charge a customer
      const getClientSecret= async()=>{
         const response = await axios({
           method: 'post',
           url: `/payment/create?total=${getCartTotal(cart)* 100}`
         });
         SetClientSecret(response.data.clientSecret)
      }
      getClientSecret();
    },[cart])

    const handleSubmit= async (event)=>{
      event.preventDefault();
      setProcessing(true);
      
      const payload = await stripe.confirmCardPayment(clientSecret,{
        payment_method:{
          card: elements.getElement(CardElement)
        }
      }).then( ({paymentIntent}) =>{
        setSucceeded(true);
        setError(null);
        setProcessing(false)

        history.replace('/orders')
      })
    };

    const handleChange =(event)=>{
      setDisabled(event.empty);
      setError(event.error ? event.error.message :"");
    }


  return (
    <div className='payment'>
       <div className='payment--container'>
       {/*delivery address*/}
         <div className='payment--section'>
          <div className='payment--title'>
          <h3>Delivery Address:</h3>
          </div>
          <div className='payment--address'>
            <p>{user?.email} </p>
            <p>flat 302, Hiranandani</p>
            <p>Powai,india</p>
          </div>

         </div>
           {/*cart review*/}
         <div className='payment--section'>
           <div className='payment--title'>
           <h3>Review your item in Cart :</h3>
           </div>  
            <div className='payment--items'>
            {cart.map( item => (
                <CheckoutProduct
                 id = {item.id}
                 title = {item.title}
                 image = {item.image}
                 price = {item.price}
                /> 
               ))}
            </div>

         </div>
           {/*Payment gateway*/}
         <div className='payment--section'>
          <h3>Payment Method :</h3>
           <div className='payment--details'>
            {/*Stripe secret code*/}
            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange}/>
               <div className='payment--priceContainer'>
               <CurrencyFormat 
               renderText = {(value) => (
                <div>
                      <p>Subtotal ({cart.length} items):<strong>{value}</strong> </p>
                      <small className="subtotal--gift">
                          <input type="checkbox" /> This order contains a gift
                      </small>
                </div>
               )}
               decimalScale = {2}
               value = {getCartTotal(cart)}
               displayType = {"text"}
               thousandSeparator = {true}
               prefix = {"₹"}
            />     
            <button disabled = {processing || disabled || succeeded}>
             <span>{processing ? <p>processing</p>: "Buy now"}</span>
            </button>
          </div>
               {/*error*/}
               {error && <div>{error}</div>}

               
            
            </form>
           
           </div>

         </div>

       </div>

    </div>

  )
}

export default Payment