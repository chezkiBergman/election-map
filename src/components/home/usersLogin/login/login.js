import { useState } from "react"
import { Form, Button, Container } from 'react-bootstrap';
import Alert from "@mui/material/Alert";
import styles from './login.css'
import axios from "axios";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai"
import { Link, Redirect, useHistory, useLocation } from "react-router-dom";
// import { Login } from "@mui/icons-material";


function Login() {
    const location = useLocation()
    const history = useHistory()
    console.log(location.state);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [alreadyLogin, setAlreadyLogin] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    
    const handleOnSubmit = (e) => {
        const token = JSON.parse(localStorage.getItem("loginToken"))
        console.log(token);
        token ?
            (setAlreadyLogin(true)) :
            axios.post(`users/singIn`, { email, password })
                .then(res => {
                    res.data &&
                    console.log(res.data);
                    console.log(res.data.findUser['permissions']);
                    const tokenExp = {}
                    tokenExp.token = res.data.token
                    tokenExp.img =  `http://localhost:3003/uploads/${res.data.findUser.image}`
                    tokenExp.permissions =res?.data?.findUser.permissions
                    tokenExp.email =res.data.findUser.email
                    localStorage.setItem('loginToken', JSON.stringify(tokenExp))
                    res.data.findUser['permissions'] === "admin" ? ( window.location.replace("/backOffice")):
                   window.location.replace('/mapsElection')
                }).catch(function (error) {
                    console.log(error);
                        setError(error.response.data.msg)
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);

                });

        e.preventDefault()
        setEmail('')
        setPassword('')

    }

    return (
        <Container className='container'>

            <h1 className='h1' style={{ color: "wheat", margin: '15px', position: "absolute", left: "42%" }}>התחברות</h1>
            <Form onSubmit={handleOnSubmit} className={styles.form}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label style={{ color: "wheat", fontWeight: "bold" }}>אימייל</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" onFocus={(e) => setError("")} value={email} onChange={(e) => { setEmail(e.target.value) }} />
                    <Form.Text className="text-muted">
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label style={{ color: "wheat", fontWeight: "bold" }}>סיסמה</Form.Label>
                    <Form.Control required={true} type={showPassword ? "text" : "password"} placeholder="Password" onFocus={(e) => setError("")} value={password} onChange={e => { setPassword(e.target.value) }} />
                    {!showPassword ? <AiFillEye style={{ position: "relative", color: "black", left: "415px", top: "-33px" }} onClick={() => setShowPassword(!showPassword)} /> 
                    : <AiFillEyeInvisible style={{ position: "relative", color: "black", left: "415px", top: "-33px" }} onClick={() => setShowPassword(!showPassword)} />}
                </Form.Group>

                <Button style={{ margin: '2px' }} variant="primary" type="submit" >
                  היכנס
                </Button>
                <Link className={'btn btn-primary'} to={'/register'}>
                    עדיין אין לך חשבון? הירשם
                </Link>
                <Link className={'btn btn-primary'} style={{ margin: '2px' }} to={'/reset'}>
                    שכחת את הסיסמה?
                </Link>
            </Form>
           
            {
                error ? (<Alert variant="filled" severity="error"style={{ margin: "2px", textDecoration: "none", position: "absolute", left: "42.1%", top: "25%" }}>{error}</Alert>) : null
            }
            {
                alreadyLogin && <Alert variant="filled" severity="error"
                style={{ margin: "2px", textDecoration: "none", position: "absolute", left: "35.1%", top: "10%" }}
                >הינך מחובר לאתר, נא התנתק בטרם התחבר שוב</Alert>

            }


        </Container>
    )
}




export default Login