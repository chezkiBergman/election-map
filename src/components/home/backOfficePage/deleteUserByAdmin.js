import { useEffect, useState } from "react";
import axios from "axios"
import Alert from '@mui/material/Alert';
import { useHistory } from "react-router-dom";
const token = JSON.parse(localStorage.getItem("loginToken"))






export default function DeleteAccountByAdmin({userName}) {
    let user = userName[0]

  console.log(user);
    const [deleted, setDeleted] = useState(false)
       token &&
        axios.delete(`admin/deleteAccountByAdmin/${user}` )
        .then(res => {
            console.log(res.data);
            setDeleted(res.data?.msg)
         return
            
        }).catch(function (error) {
            if (error.response) {
                console.log(error.response);
            }
         
        })


   
   
    return (
       
    <>
         {deleted && <Alert style={{position: 'absolute',right: '500px'}}>{deleted}</Alert>}
    </>
    )


}
