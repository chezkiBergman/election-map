import { Button, Container, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from 'axios'
import { useParams } from "react-router-dom";


function ActivateNewUser() {
  const { token } = useParams()
  const[isTokenActivateExpired,setIsTokenActivateExpired]=useState(false)

  useEffect(() => {
    function setActivate() {

      axios.post(`http://localhost:3003/users/setActivateUser`, { token }
      ).then(res => {
        setIsTokenActivateExpired(res.data.msg)
      }).catch(function (error) {
        if (error) {
          console.log(error.response);
          setIsTokenActivateExpired(error.response.data.msg)
        }

      })

    }
    setActivate()
    console.log(isTokenActivateExpired);
  }, [])

  return (


    <Container style={{ position: 'absolute', top: "20%", maxWidth: '1280px' }}>
      <Alert  style={{ margin: "auto", textDecoration: "none" }}>
        {isTokenActivateExpired}
        {isTokenActivateExpired === 'שמך נקלט במערכת, ברוכים הבאים' ?(
        <Alert.Link style={{ textDecoration: "none" }} href="/login"> התחבר </Alert.Link>):
        <Alert.Link variant="filled" severity="error" style={{ textDecoration: "none" }} href="/register"> הירשם </Alert.Link>}

      </Alert>

    
    </Container>
  )
}
export default ActivateNewUser