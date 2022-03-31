import { Container, Form, Button } from "react-bootstrap";
import { useState } from "react";
import axios from "axios"
import ConfirmResetPass from "./confirmResetPass"




function ResetPass() {
                                                                                      
    const [email, setEmail] = useState('')
    const [isMsg, setIsMsg] = useState('')
   
    const resetPassword = (e) => {
        e.preventDefault()
        
        axios.post(`http://localhost:3003/users/reset-password `, { email },)

            .then(res => {
                console.log(res);
          
                   setIsMsg(res.data)
                   setEmail('')
             
            }).catch(function (error) {
                console.log(error);
            })
       
      
        
    }


    return (
        <Container>
            {isMsg === '' ? (
//  <h1 className='h1'>reset your password</h1>

 <Form onSubmit={resetPassword}>
     <Form.Group className="mb-3" controlId="formBasicEmail">
         <Form.Label style={{color:"wheat",fontWeight:"bold"}}>אימייל</Form.Label>
         <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
         <Form.Text className="text-muted">
         </Form.Text>
     </Form.Group>
     <Button style={{ margin: '2px' }} variant="primary" type="submit" >
      שלח
     </Button>
 </Form>

            ) : <ConfirmResetPass msg={isMsg}></ConfirmResetPass>}


        </Container>



    )

}


















export default ResetPass