// import React, { useRef,useState,useEffect } from 'react'
import { Form, FormControl,Button, Alert,Table } from 'react-bootstrap'

import React, { useState,useEffect,useRef } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import HistoryOfDonations from './historyOfDonations';


export default function ReactPayPal() {

     const [show,setShow]= useState(false)
    const [pay, setPay] = useState(0.1)
     const [success, setSuccess] = useState(false);
     const [ErrorMessage, setErrorMessage] = useState("");
     const [orderID, setOrderID] = useState(false);
     const [donations, setDonations] = useState(null)
     
    const history = useHistory()
 
    useEffect(() => {
      const token = JSON.parse(localStorage.getItem("loginToken"))
      if (!token ) {
        history.push("/login")
      }else{
      axios.get(`http://localhost:3003/users/checkDonationAmount`, { headers: { "Authorization": `Bearer ${token['token']}` } })
      .then(res => {
        let lastElement = res.data.findUser[res.data.findUser.length - 1];
        console.log(lastElement);
          const dateDonations = res.data 
          && res.data.findUser?.map(i=>{
            return{
              donationAmount: i.donationAmount,
              donationDate: i.date,
            }
             })
         setDonations({dateDonations, sumDonationHistory: lastElement.sumDonationHistory.toFixed(2)})
        
      }).catch(function (error) {
          if (error.response) {
              console.log({ data: error.response.data, status: error.response.status, headers: error.response.headers });
          }
      })

      if (success) {
        setTimeout(() => {
          window.location.reload()
        }, 3000);
            setShow(!show)
            axios.post(`http://localhost:3003/users/donationAmount`,{pay},{ headers: { "Authorization": `Bearer ${token['token']}`} } 
            )
            .then(res => {
              console.log(res.data);
            }).catch(function(error){
              if (error) {
                setErrorMessage(error.response.data)
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
        
            }
      })
    }
  }
    console.log(donations);
 
           
    }, [success]
  );
 
 console.log(1, orderID);
 console.log(2, success);
 console.log(3, ErrorMessage);

    
   

 const amount={
   value: pay
   
 }
 // creates a paypal order
 const createOrder = (data, actions) => {
   return actions.order
     .create({
       purchase_units: [
         {
           description: "Sunflower",
           amount: {
            //  currency_code: "EUR",
             value: amount.value
           },
         },
       ],
       // not needed if a shipping address is actually needed
       application_context: {
         shipping_preference: "NO_SHIPPING",
       },
     })
     .then((orderID) => {
       setOrderID(orderID);
       return orderID;
     })
 };

 
 // check Approval
 const onApprove = (data, actions) => {
   return actions.order.capture().then(function (details) {
     const { payer } = details;
     setSuccess(true);
   });
 };
 //capture likely error
 const onError = (data, actions) => {
   setErrorMessage("An Error occured with your payment");
 };

 const changeMount =(e)=>{
   setPay(e.target.value)
   setShow(false)
   setSuccess(false)

 }
 return (
   
    <PayPalScriptProvider
      options={{
        "client-id":"AYmgj7G4zjItqKuG4y26vO2PkNTHAL0QQqZTFtuXfpYja99osNDg19cPa7uDcqDGHA370EMDYNdAG9Ag",
      }}
    >
       {ErrorMessage &&  <Alert style={{textAlign:"center"}}>{ErrorMessage}</Alert> }
        {donations ?(<HistoryOfDonations donations={donations}/>)
             : <Alert style={{textAlign:"center"}}>עדיין לא תרמת לאתר</Alert>}
        
            <div style={{position:"absolute",left:"42.2%",top:"20%"}}>
               <Form.Group className="mb-3" style={{textAlign:"center"}} controlId="formNumber">
              <Form.Label style={{ color: "wheat", fontWeight: "bold" ,fontSize:"35px" }}>סכום התרומה</Form.Label>
           <Form.Control required="true" type="number" placeholder="בחר סכום" value={pay}  onChange={e  => changeMount(e)} />
          </Form.Group>
             
              <Button style={{marginBottom:"15px"}} type="submit" onClick={() => setShow(true)}>
                תרום
              </Button>
              {
                success ? (<Alert style={{color:"green",}}>✔ תרומתך התקבלה</Alert>):null
              }
        {show ? (
          <PayPalButtons
            style={{ layout:"vertical"}}
            createOrder={createOrder}
            onApprove={onApprove}
          />
        ) : null}
      
      </div>
    </PayPalScriptProvider>
  );
 }
 