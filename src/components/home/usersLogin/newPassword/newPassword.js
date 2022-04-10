import { Container, Form, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import axios from "axios"
// import ConfirmResetPass from '../confirmReasetPassword/confirmResetPass'
import { useParams, useHistory } from "react-router-dom";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai"

function validatePassword(value) {
    const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
    let errors = {};
    if (value === '') {
        errors.password = 'נדרשת סיסמה';
    } else if (!mediumRegex.test(value)) {
        errors.password = 'סיסמה לא תקנית';
    }
    return errors;
};

function NewPass() {
    const { token } = useParams()
    const [password, setPassword] = useState('')
    const [pass, setPass] = useState('')
    const [isMsg, setIsMsg] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [passwordErr, setPasswordErr] = useState({})
    const [passNotEqual, setPassNotEqual] = useState(false)
    const [error, setError] = useState("")
    const history = useHistory()
    const setNewPassword = (e) => {
        if (passwordErr.password || passNotEqual) {
            setPasswordErr({})
            setPassword("")
            setPass("")
            return
        }else{
            axios.post(`http://localhost:3003/users/newPassword `, { password, token })

                .then(res => {
                    console.log(res.data);

                    setIsMsg(true);

                }).catch(function (error) {
                    console.log(error);
                    setError(error.response.data.msg)
                  
                });
            e.preventDefault()
            setPassword("")
            setPass("")
        }
        
        }
        if (isMsg) {
            setTimeout(() => {
                history.push('/login')
            }, 3000);

        }


        function onChangeAndValidPassword(e) {
            const errors = validatePassword(e.target.value)
            setPasswordErr(errors)
            setPassword(e.target.value)
        }

        function passComparison(e) {
            console.log(e.target.value);
            setPass(e.target.value)
            console.log(pass);
            if (pass.length && password.length) {
                if (e.target.value != password) {
                    setPassNotEqual(true)
                } else if (e.target.value === password) {
                    setPassNotEqual(false)
                }

            }
        }


        return (
            <Container>
                {isMsg === false ? (
                    <Container >
                        <h1 className='h1' style={{ margin: '15px', position: "absolute", left: "42.1%", color: "wheat" }}>איפוס סיסמה</h1>

                        <Form onSubmit={setNewPassword}>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label style={{ color: "wheat", fontWeight: "bold" }}>סיסמה</Form.Label>
                                {passwordErr.password && <Alert variant="danger">{passwordErr.password}</Alert>}
                                <Form.Control required="true" type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={e => { onChangeAndValidPassword(e) }} />
                                {!showPassword ? <AiFillEye style={{ position: "relative", color: "black", left: "185px", top: "-33px" }} onClick={() => setShowPassword(!showPassword)} /> : <AiFillEyeInvisible style={{ position: "relative", color: "black", left: "185px", top: "-33px" }} onClick={() => setShowPassword(!showPassword)} />}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                                <Form.Label style={{ color: "wheat", fontWeight: "bold" }}> אישור סיסמה</Form.Label>
                                {passNotEqual ? <Alert style={{ height: "20px", display: "flex", alignItems: "center" }} variant="danger">סיסמה לא תואמת</Alert> : null}
                                <Form.Control required="true" type={showPassword ? "text" : "password"} placeholder="Password" value={pass} onChange={e => { passComparison(e) }} />
                                {!showPassword ? <AiFillEye style={{ position: "relative", color: "black", left: "185px", top: "-33px" }} onClick={() => setShowPassword(!showPassword)} /> : <AiFillEyeInvisible style={{ position: "relative", color: "black", left: "185px", top: "-33px" }} onClick={() => setShowPassword(!showPassword)} />}
                            </Form.Group>
                            <Button style={{ margin: '2px' }} variant="primary" type="submit" >
                                שלח
                            </Button>
                        </Form>
                        {
                error ? (<Alert variant="danger" style={{ margin: "2px", textDecoration: "none", position: "absolute", left: "42.1%", top: "20%" }}>{error}</Alert>) : null
            }
                    </Container>
                ) : <Container> <h1 className='h1' style={{ position: "absolute", top: "20%", left: "19.6%", color: "wheat" }}>הסיסמה החדשה עודכנה, מועבר להתחברות</h1></Container>

                }

            </Container>



        )

    }
    export default NewPass








