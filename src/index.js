import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import "../src/components/home/axiosInterceptors"
import axios from 'axios';
const token = JSON.parse(localStorage.getItem("loginToken"))
if (token)  axios.defaults.headers.common['Authorization']  = `Bearer ${token['token']}`

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter> 
    
  <App />
   </BrowserRouter>
</React.StrictMode>,
  
  
  document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
