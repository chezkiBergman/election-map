import { Button, Container,Alert } from "react-bootstrap";
import { useState ,useEffect} from "react";
import axios from 'axios'
import { useParams } from "react-router-dom";

function ActivateNewUser() {
  const { token } = useParams()
    const [activatUser, setActivatUser] = useState(false)

    useEffect(() => {
    function setActivate() {
    
    
            axios.post(`http://localhost:3003/users/setActivateUser`,{token}
         
             ).then(res => {
        
                console.log(res);

            }).catch(function (error) {
                if (error) {
                    console.log(error.response);
                }
              
            })

    }
    setActivate()
}, [])

  return(
  

    <Container style={{position: 'absolute',top:"20%", maxWidth: '1280px'}}>
     
      {/* <h2 style={{color:"wheat"}}>ם</h2> */}

     {/* <div className="container" style={{justifyContent:"space-around",marginTop:"50px"}}> */}
        <Alert variant="info" style={{margin:"auto",textDecoration:"none"}}>
        שמך נקלט במערכת, ברוכים הבאים
      <Alert.Link style={{textDecoration:"none"}} href="/login"> התחבר </Alert.Link>
      </Alert>

        {/* </div>  */}
  </Container>
  )
}
export default ActivateNewUser