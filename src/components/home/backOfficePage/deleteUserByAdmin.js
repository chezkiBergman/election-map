import { useEffect, useState } from "react";
import axios from "axios"
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Login from "../usersLogin/login/login";
import {NavDropdown } from "react-bootstrap";
import Alert from '@mui/material/Alert';
import { useHistory } from "react-router-dom";






export default function DeleteAccountByAdmin({userName}) {
    let user = userName[0]

  console.log(user);
    const [deleted, setDeleted] = useState(false)
    const token = JSON.parse(localStorage.getItem("loginToken"))
   
        axios.delete(`http://localhost:3003/admin/deleteAccountByAdmin/${user}`,
        { headers: { "Authorization": `Bearer ${token['token']}` } })
        .then(res => {
            console.log(res.data);
            setDeleted(res.data.msg)
         return
           
        }).catch(function (error) {
            if (error.response) {
                console.log({
                    data: error.response.data,
                    status: error.response.status,
                    headers: error.response.headers
                });
            }
         
        })


   
   
    return (
       
    <>
         {deleted && <Alert style={{position: 'absolute',right: '500px'}}>{deleted}</Alert>}
    </>
    )


}
