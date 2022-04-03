import { useState } from "react"
import { Form, Button, Container, Alert } from 'react-bootstrap';
import styles from './login.css'
import axios from "axios";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai"
import { Link, Redirect, useHistory, useLocation } from "react-router-dom";


function Login() {
    const location = useLocation()
    const history = useHistory()
    console.log(location.state);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [moveToMapElectin, setMoveToMapElectin] = useState(false)
    const [alreadyLogin, setAlreadyLogin] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const handleOnSubmit = (e) => {
        const token = JSON.parse(localStorage.getItem("loginToken"))
        token ?
            (setAlreadyLogin(true)) :
            axios.post(`http://localhost:3003/users/singIn`, { email, password })
                .then(res => {

                    console.log(res.data.findUser['permissions']);
                    const tokenExp = {}
                    tokenExp.token = res.data.token
                    tokenExp.img = res.data.findUser.image
                    tokenExp.permissions =res.data.findUser.permissions
                    localStorage.setItem('loginToken', JSON.stringify(tokenExp))
                    res.data.findUser['permissions'] === "admin" ? (history.push("/backOffice")) :
                        setMoveToMapElectin(true)
                    window.location.reload()

                }).catch(function (error) {
                    if (error.response) {
                        setError(error.response.data.msg)
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);

                    }

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
                    <Form.Control required="true" type={showPassword ? "text" : "password"} placeholder="Password" onFocus={(e) => setError("")} value={password} onChange={e => { setPassword(e.target.value) }} />
                    {!showPassword ? <AiFillEye style={{ position: "relative", color: "black", left: "415px", top: "-33px" }} onClick={() => setShowPassword(!showPassword)} /> : <AiFillEyeInvisible style={{ position: "relative", color: "black", left: "415px", top: "-33px" }} onClick={() => setShowPassword(!showPassword)} />}
                </Form.Group>

                <Button style={{ margin: '2px' }} variant="primary" type="submit" >
                    שלח
                </Button>
                <Link className={'btn btn-primary'} to={'/register'}>
                    עדיין אין לך חשבון? הירשם
                </Link>
                <Link className={'btn btn-primary'} style={{ margin: '2px' }} to={'/reset'}>
                    שכחת את הסיסמה?
                </Link>
            </Form>
            {
                moveToMapElectin ? (<Redirect to={"/mapsElection"} />

                ) : null
            }

            {
                error ? (<Alert variant="danger" style={{ margin: "2px", textDecoration: "none", position: "absolute", left: "32.1%", top: "25%" }}>{error}</Alert>) : null
            }
            {
                alreadyLogin && <Alert variant="info" style={{ margin: "2px", textDecoration: "none", position: "absolute", left: "36%", top: "10%" }}>הינך מחובר לאתר, נא התנתק בטרם התחבר שוב</Alert>

            }


        </Container>
    )
}




export default Login