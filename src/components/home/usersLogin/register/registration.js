
import { useState, useEffect,useRef } from "react";
import { Form, Button, Container, FormControl, FormGroup, Alert } from "react-bootstrap";
import { Redirect, useHistory } from "react-router-dom";
import styles from './registertion.css';
import axios from "axios";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai"




function Registration() {
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [selectedImage, setSelectedImage] = useState("")
  const [emailExsit, setEmailExsit] = useState(false)
  const [registrationComplete, setRegistrationComplete] = useState("")
  const [loginAlready, setLoginAlready] = useState(false)
  const [emailErr, setEmailErr] = useState({});
  const [passwordErr, setPasswordErr] = useState({})
  const [error, setError] = useState("")
  
   const imageInputRef = useRef();





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


  const handleChange = (e) => {
    console.log(selectedImage);
    setSelectedImage(e.target.files[0])
  }



  const handleOnSubmit = (e) => {
    e.preventDefault()

    const token = JSON.parse(localStorage.getItem("loginToken"))

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

    } else {
      token ? (setLoginAlready(true)) :

        axios.post(`http://localhost:3003/users/singUp`, formData)
          .then(res => {
            console.log(res.data);

            setRegistrationComplete(res.data)

          }).catch(function (error) {
            if (error.response) {
              setError(error.response.data.msg)
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);

            }

            setEmailExsit(true)

            console.log(error);
          })

      setEmail('')
      setPassword('')
      setName('')
      setSelectedImage('')
    }
  }
  const onFocus = () => {
    setError("")
    setEmailExsit(false)

  }
  const deselect=()=>{
    console.log(imageInputRef.current.value );
    imageInputRef.current.value = "";
    setSelectedImage("")
    
  }

  return (

    <Container className={styles.container}>
      {
        !registrationComplete ? (

          <Container className='container'>

            <h1 className='h1'
             style={{ margin: '15px', position: "absolute", left: "42%", color: "wheat" }}>הרשמה</h1>

            <Form onSubmit={handleOnSubmit} enctype="multipart/form-data"
             style={{ top: '65%' }} className={styles.form}>
              {selectedImage ? (
                <div style={{ textAlign: 'center', display: "flex", justifyContent: "space-between" }}>
                  <img
                    src={URL.createObjectURL(selectedImage)}

                    style={{ width: '70px', borderRadius: '30px' }}
                    alt="Thumb"
                  />
                  <Button onClick={deselect} 
                  style={{ margin: '5px', color: "wheat", fontWeight: "bold", left: "150px", top: "50px" }}>
                    בטל את הבחירה
                  </Button>
                </div>
              ) : null}
              <FormGroup className="mb-3" controlId="formBasicImage">
                <Form.Label style={{ color: "wheat", fontWeight: "bold" }}>בחר תמונת פרופיל</Form.Label>
                <FormControl required="true" ref={imageInputRef} type='file' name='avatar' placeholder="upload your poto" defultvalue={selectedImage}
               onFocus={() => onFocus()} onChange={e => handleChange(e)} />
              </FormGroup>


              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label style={{ color: "wheat", fontWeight: "bold" }} >שם פרטי ומשפחה</Form.Label>
                <Form.Control required="true" type="name" placeholder="Enter name" onFocus={() => onFocus()} value={name} onChange={e => { setName(e.target.value) }} />

              </Form.Group>


              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label style={{ color: "wheat", fontWeight: "bold" }}>אימייל</Form.Label>
                {emailErr.email && <Alert style={{ height: "20px", display: "flex", alignItems: "center" }} variant="danger">{emailErr.email}</Alert>}
                <Form.Control required="true" type="email" placeholder="Enter email" onFocus={() => onFocus()} value={email} onChange={e => onChangeAndValidMail(e)} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label style={{ color: "wheat", fontWeight: "bold" }}>סיסמה</Form.Label>
                {passwordErr.password && <Alert variant="danger">{passwordErr.password}</Alert>}
                <Form.Control required="true" type={showPassword ? "text" : "password"} placeholder="Password" onFocus={() => onFocus()} value={password} onChange={e => onChangeAndValidPassword(e)} />

                {!showPassword ? <AiFillEye style={{ position: "relative", color: "black", left: "300px", top: "-33px" }} onClick={() => setShowPassword(!showPassword)} />
                  : <AiFillEyeInvisible style={{ position: "relative", color: "black", left: "300px", top: "-33px" }} onClick={() => setShowPassword(!showPassword)} />}
              </Form.Group>

              <Button variant="primary" type="submit" >
                שלח
              </Button>
              {
                emailExsit && (<Alert variant="danger" style={{ margin: "2px", textDecoration: "none", position: "absolute", left: "15%", top: "-23%", width: "250px", textAlign: "center", }}>אימייל זה נמצא בשימוש!</Alert>)
              }
              {
                loginAlready ? (<Alert variant="danger" style={{ margin: "2px", textDecoration: "none", position: "absolute", left: "15%", top: "-23%", width: "250px", textAlign: "center", }}>הינך מחובר כבר למערכת</Alert>)
                  : null
              }

            </Form>
            {
              error ? (<Alert variant="danger" style={{ margin: "2px", textDecoration: "none", position: "absolute", left: "42%", top: "25%" }}>{error}</Alert>) : null
            }

          </Container>

        ) : <Container style={{ position: "absolute", top: "20%" }}> <Alert style={{ margin: "auto", textDecoration: "none", textAlign: "center", }}>{registrationComplete['msg']}</Alert></Container>
        /* <Alert variant="danger" style={{margin:"2px",textDecoration:"none",position: "absolute",left:"15%",top:"-23%",width:"250px",textAlign:"center",}}>בעוד 5 שניות תועבר אל דף התחברות לאתר!</Alert>} */
      }


    </Container>


  )

}

















export default Registration