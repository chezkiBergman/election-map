import { useEffect, useState } from "react";
import axios from "axios"
import Alert from '@mui/material/Alert';
import { useHistory } from "react-router-dom";






export default function DeleteAccount() {
   
    const [deleted, setDeleted] = useState(false)
    const token = JSON.parse(localStorage.getItem("loginToken"))
    const history =useHistory()
        token &&
        axios.delete(`http://localhost:3003/users/deleteAccount`,
        { headers: { "Authorization": `Bearer ${token['token']}` } })
        .then(res => {
            console.log(res.data);
            setDeleted(res.data.msg)
           if (token['permissions'] === 'admin') return
            setTimeout(() => {
            localStorage.removeItem("loginToken")
               history.push('/login')
            }, 3000);
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
