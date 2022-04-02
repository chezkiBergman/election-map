
import { useState, useEffect } from "react";
import { Form, Button, Container, FormControl, FormGroup, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai"


export default function EditUser() {
    const history = useHistory()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [name, setName] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [registrationComplete, setRegistrationComplete] = useState(false)
    const [loged, setloged] = useState(true)
    const token = JSON.parse(localStorage.getItem("loginToken"))


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
        axios.put(`http://localhost:3003/users/editUser`, formData,
            { headers: { "Authorization": `Bearer ${token['token']}` } })
            .then(res => {
                console.log(res);
                console.log(res.data);
                setRegistrationComplete(true)
                setTimeout(() => {
                    return history.push("/login")
                }, 5000);

            }).catch(function (error) {

                console.log(error);
            })
        e.preventDefault()
        setEmail('')
        setPassword('')
        setName('')
        setSelectedImage(null)


    }


    return (

        <Container >
            {
                !registrationComplete ? (

                    <Container className='container'>

                        <h1 className='h1' style={{ margin: '15px', position: "absolute", left: "42%", color: "wheat" }}>ערוך פרופיל</h1>
                        <Form onSubmit={handleOnSubmit} enctype="multipart/form-data" style={{ top: '65%' }}  >
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
                                <FormControl type="file" name='avatar' placeholder="upload your poto" defultvalue={selectedImage ? selectedImage : null} onChange={e => { setSelectedImage(e.target.files[0]) }} />
                            </FormGroup>



                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label style={{ color: "wheat", fontWeight: "bold" }}>שם פרטי ומשפחה</Form.Label>
                                <Form.Control type="name" placeholder="Enter name" value={name} onChange={e => { setName(e.target.value) }} />
                            </Form.Group>



                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label style={{ color: "wheat", fontWeight: "bold" }}>אימייל</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => { setEmail(e.target.value) }} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label style={{ color: "wheat", fontWeight: "bold" }}>סיסמה</Form.Label>
                                <Form.Control required="true" type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={e => { setPassword(e.target.value) }} />
                                {!showPassword ? 
                                     <AiFillEyeInvisible style={{ position: "relative", color: "black", left: "300px", top: "-33px" }} onClick={() => setShowPassword(!showPassword)} /> :
                                     <AiFillEye style={{ position: "relative", color: "black", left: "300px", top: "-33px" }} onClick={() => setShowPassword(!showPassword)} />}
                            </Form.Group>

                            <Button variant="primary" type="submit" >
                                Submit
                            </Button>

                        </Form>
                    </Container>
                ) : <Alert variant="danger" style={{ margin: "2px", textDecoration: "none", position: "absolute", left: "15%", top: "-23%", width: "250px", textAlign: "center", }}>בעוד 5 שניות תועבר אל דף התחברות לאתר!</Alert>}
        </Container>


    )

}












