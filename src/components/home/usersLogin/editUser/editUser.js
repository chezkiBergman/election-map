
import { useState, useEffect } from "react";
import { Form, Button, Container, FormControl, FormGroup } from "react-bootstrap";
import Alert from "@mui/material/Alert";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai"


export default function EditUser() {
    const history = useHistory()
    const [emailErr, setEmailErr] = useState({});
    const [passwordErr, setPasswordErr] = useState({})
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [name, setName] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [editUserComplete,setEditUserComplete] = useState(false)
    const [msg, setMsg] = useState("")
    const [error,setError]=useState("")
    const token = JSON.parse(localStorage.getItem("loginToken"))

    function validateEmail(value) {

        let errors = {};
        if (value === '') {
          errors.email = 'נדרש כתובת אימייל';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errors.email = 'אימייל לא תקני';
        }
        return errors;
      };
    
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
    
    
    
      function onChangeAndValidPassword(e) {
        const errors = validatePassword(e.target.value)
        setPasswordErr(errors)
        setPassword(e.target.value)
      }
    
      function onChangeAndValidMail(e) {
        const errors = validateEmail(e.target.value)
        setEmailErr(errors)
        setEmail(e.target.value)
      }
    
    useEffect(() => {
        if (!token) {
            history.push("/login")
        }
    }, [])
    const handleOnSubmit = (e) => {

        const formData = new FormData();
        formData.append('name', name)
        formData.append('email', email)
        formData.append('password', password)
        formData.append('avatar', selectedImage)

        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        if (emailErr.email || passwordErr.password) {
            setPasswordErr({})
            setEmailErr({})
            setEmail("")
            setPassword("")
            setName("")
            setSelectedImage("")
           
            return
        }
        axios.put(`users/editUser`, formData,
          )
            .then(res => {
                console.log(res);
                console.log(res.data);
               setEditUserComplete(true) 
               setMsg("החשבון עודכן בהצלחה")
                setTimeout(() => {
                    return history.push("/login")
                }, 3000);

            }).catch(function (error) {
                console.log(error);
                setError(error.response?.data)  
            })
        e.preventDefault()
        setEmail('')
        setPassword('')
        setName('')
        setSelectedImage(null)


    }


    return (

        <Container >
            {msg &&  <Alert variant="filled" severity="success" style={{position:"absolute",textAlign:"center",left:'41.1%',marginTop:"1%"}}>{msg}</Alert>}
            {error  &&<Alert variant="filled" severity="error" style={{position:"absolute",textAlign:"center",left:'41.1%',margiinTop:"1%"}}>{error}</Alert>}
          
            {
                !editUserComplete &&
                    <Container className='container'>
                         
                         <h1 className='h1' style={{ color: "wheat", marginTop: '4%', position: "absolute", left: "507px",backgroundColor:"#0d6efd",borderRadius:"5px",width:"230px" }}>ערוך פרופיל</h1>
                        <Form onSubmit={handleOnSubmit} encType="multipart/form-data" style={{ top: '65%' }}  >
                            {selectedImage ? (
                                <div style={{ textAlign: 'center', display: "flex", justifyContent: "space-between" }}>
                                    <img
                                        src={URL.createObjectURL(selectedImage)}
                                        style={{ width: '80px', borderRadius: '30px' }}
                                        alt="Thumb"
                                    />
                                    <button className="btn btn-outline-primary" onClick={() => (setSelectedImage())} style={{ margin: '5px', color: "wheat", fontWeight: "bold" }}>
                                        בטל את הבחירה
                                    </button>
                                </div>
                            ) : null}
                            <FormGroup className="mb-3" controlId="formBasicImage">
                                <Form.Label style={{ color: "wheat", fontWeight: "bold" }}>בחר תמונת פרופיל</Form.Label>
                                <FormControl type="file" name='avatar' placeholder="upload your poto" defultvalue={selectedImage ? selectedImage : null}onFocus={(e) => setError("")} onChange={e => { setSelectedImage(e.target.files[0]) }} />
                            </FormGroup>



                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label style={{ color: "wheat", fontWeight: "bold" }}>שם פרטי ומשפחה</Form.Label>
                                <Form.Control required={true} type="name" placeholder="Enter name" onFocus={(e) => setError("")} value={name} onChange={e => { setName(e.target.value) }} />
                            </Form.Group>



                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label style={{ color: "wheat", fontWeight: "bold" }}>אימייל</Form.Label>
                                {emailErr.email && <Alert variant="filled" severity="warning">{emailErr.email}</Alert>}
                                <Form.Control type="email" placeholder="Enter email" value={email} onFocus={(e) => setError("")} onChange={e => onChangeAndValidMail(e)} />
                            </Form.Group>
 
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label style={{ color: "wheat", fontWeight: "bold" }}>סיסמה</Form.Label>
                                {passwordErr.password && <Alert  variant="filled" severity="warning">{passwordErr.password}</Alert>}
                                <Form.Control required={true} type={showPassword ? "text" : "password"} placeholder="Password" onFocus={(e) => setError("")} value={password} onChange={e => onChangeAndValidPassword(e)}  />
                                {!showPassword ? 
                                     <AiFillEyeInvisible style={{ position: "relative", color: "black", left: "300px", top: "-33px" }} onClick={() => setShowPassword(!showPassword)} /> :
                                     <AiFillEye style={{ position: "relative", color: "black", left: "300px", top: "-33px" }} onClick={() => setShowPassword(!showPassword)} />}
                            </Form.Group>

                            <Button variant="primary" type="submit" >
                                שלח
                            </Button>

                        </Form>
                    </Container>
}
        </Container>


    )

}












