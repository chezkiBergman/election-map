import { Navbar, Nav, NavDropdown, DropdownButton, Button } from "react-bootstrap"
import { useState, useEffect } from "react"
import axios from "axios"
import { BrowserRouter, Link, Redirect, Router, useHistory, useLocation } from "react-router-dom"
import { FaCoins } from "react-icons/fa"
import { MdPayment } from "react-icons/md"
import Login from "./usersLogin/login/login"
import DeleteAccount from "./deleteUser/deleteUser"
import Homepage from "./homepage"
axios.defaults.withCredentials = true

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
    const history = useHistory()
    const location = useLocation()
    const [image, setImage] = useState(null)
    const [clicked, setClicked] = useState(false)
    const [tokenValid, setTokenValid] = useState("")
    const [state, setState] = useState(0)
    const [logOut, setLogOut] = useState(false)
    const [linkToBackOfficePage, setLinkToBackOfficePage] = useState(false)
    const token = JSON.parse(localStorage.getItem("loginToken"))



    const logOutFunc = () => {
        localStorage.removeItem("loginToken")
        clearInterval(checkTokenValid)
        setTokenValid("")
        setImage("")
        history.push('/login')

    }
   
        async function createNewToken() {
           try {
            let newToken = JSON.parse(localStorage.getItem("loginToken"))
          if (newToken){
             const response = await axios.get(`http://localhost:3003/users/createNewToken`, { headers: { "Authorization": `Bearer ${newToken['token']}` } })
             const accessToken = response.data.accessToken
             if (accessToken){
            newToken['token'] = accessToken
            console.log(newToken);
            localStorage.setItem('loginToken',JSON.stringify(newToken))
            return
             }
             return
            }
           } catch (error) {
           logOutFunc()
           }
            
         }
       let  checkTokenValid
         useEffect(()=>{
         checkTokenValid = setInterval(function () {
            createNewToken()
         }, 2 * 60 * 1000)
         },[])
       
        

    useEffect(() => {
        
        const tokenFunc = () => {
            
            if (token && state < 2) {
                setTokenValid(token)
                setImage(`http://localhost:3003/uploads/${tokenValid['img']} `)
                setState((v) => v + 1)
                console.log(state);
            }
            tokenValid['permissions'] === 'admin' && setLinkToBackOfficePage(true)
        }
        tokenFunc()
    }, [tokenValid, state])


     useEffect(() => {
        !token && logOutFunc()
    }, [token])



   

  
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
                    {tokenValid &&
                        <NavDropdown drop="start" style={{ position: "absolute", right: "5px", top: "-5px" }}
                            title={<img className="pull-left" style={{ width: "30px", borderRadius: "25px" }} src={image} />} id="navbarScrollingDropdown">
                            <NavDropdown.Item href="/login" onClick={() => { logOutFunc() }}>התנתק</NavDropdown.Item>
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


