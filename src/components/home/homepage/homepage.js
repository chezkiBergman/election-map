import { useEffect } from "react";
import { Button, Container,Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";



function Homepage() {

  return(
   

    <div style={{position: 'absolute', textAlign: 'center', width: '1280px',top: '80px'}}>
     
      <h2 style={{color:"wheat"}}>ברוכים הבאים למפת בחירות 2021</h2>

     <div className="container" style={{justifyContent:"space-around",marginTop:"50px"}}>
        <Alert variant="info" style={{margin:"2px",textDecoration:"none"}}>
       ?נרשמת בעבר לאתר 
      <Alert.Link style={{textDecoration:"none"}} href="/login"> התחבר</Alert.Link>
      </Alert>
      <Alert variant="success"style={{margin:"2px"}}>
        אין לך עדיין חשבון? 
      <Alert.Link style={{textDecoration:"none"}} href="/register"> הירשם</Alert.Link>
      </Alert> 
        </div> 
  </div>
  )
}
export default Homepage