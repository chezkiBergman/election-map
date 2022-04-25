import { Navbar, Nav, NavDropdown } from "react-bootstrap"
import { useState, useEffect } from "react"
import axios from "axios"
import { Link, Redirect, useHistory } from "react-router-dom"
import { FaCoins } from "react-icons/fa"
import { MdPayment } from "react-icons/md"
import DeleteAccount from "./deleteUser/deleteUser"
import { io } from "socket.io-client";
import { Alert } from "@mui/material";

const token = JSON.parse(localStorage.getItem("loginToken"))

// const server = "http://localhost:3003";



const menuLinks = [
    {
        href: "/mapsElection",
        label: 'מפת הבחירות'
    },
    {
        href: '/register',
        label: 'הרשמה'
    },
    {
        href: '/login',
        label: 'התחברות'
    }

]
export default function Header() {

    const [image, setImage] = useState(null)
    const [clicked, setClicked] = useState(false)
    const [tokenValid, setTokenValid] = useState("")
    const [state, setState] = useState(0)
    const [linkToBackOfficePage, setLinkToBackOfficePage] = useState(false)
    const [visitor, setNewVisitor] = useState("")


   const history = useHistory()



    // const socket = io(server);
    // useEffect(() => {

    // console.log(socket);
    // token &&
    // socket.on("message", data => {
    //   setNewVisitor(data);
    //   setTimeout(() => {
    //       setNewVisitor("")
    //   }, 3000);
    // });

    // return () => socket.disconnect("disconnect")

    //   }, []);


    const logOutFunc = async() => {
        try{
         if (token) {
         const logout =await axios.get(`users/logout` )
         console.log(logout);
         setTokenValid("")
         localStorage.clear()
         console.log('remove localStorage')  
         window.location.replace('/login')
         }     
        }catch(error){
          console.log(error);
        }        
               
    }



 


    useEffect(() => {
        const tokenFunc = () => {
            if (token && state < 2) {
                setTokenValid(token)
                setImage(`${tokenValid['img']}`)
                setState((v) => v + 1)
                console.log(state);
            }
            tokenValid['permissions'] === 'admin' && setLinkToBackOfficePage(true)
        }
        tokenFunc()
    }, [tokenValid, state, image])


    // useEffect(() => {
    //         logOutFunc()
        
    // }, [token])






    return (

        <div>

            <Navbar expand="lg" bg="primary" variant="primary">

                <Nav className="mr-auto nav_bar_warpper">

                    {menuLinks.map((data, index) => (

                        <Link
                            to={data.href}
                            key={index}
                            className="links"
                            style={{ color: 'gold', margin: '5px', textDecoration: 'none' }}
                        >
                            {data.label}
                        </Link>
                    ))}
                    {visitor && <Alert severity="info" style={{ position: "absolute", top: "1px", left: "25%" }}>{visitor}</Alert>}
                    {tokenValid &&
                        <NavDropdown drop="start" style={{ position: "absolute", right: "5px", top: "-5px" }}
                            title={<img className="pull-left"
                                style={{ width: "30px", borderRadius: "25px" }} src={image} />} id="navbarScrollingDropdown">
                            <NavDropdown.Item  onClick={logOutFunc}>התנתק</NavDropdown.Item>
                            {linkToBackOfficePage ? (<NavDropdown.Item href="/backOffice">ניהול דפי משתמשים</NavDropdown.Item>) : null}
                            <NavDropdown.Item href="/editUser">ערוך פרופיל</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/payment">
                                תרומות לאתר
                                <FaCoins style={{ color: "blue", width: "40px" }} />
                                <MdPayment style={{ color: "blue", width: "40px" }} />
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => setClicked(true)}>{clicked && <DeleteAccount />}מחק חשבון</NavDropdown.Item>
                        </NavDropdown>
                    }


                </Nav >
            </Navbar>

        </div>


    )
}


