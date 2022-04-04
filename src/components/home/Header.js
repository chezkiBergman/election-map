import { Navbar, Nav, NavDropdown, DropdownButton } from "react-bootstrap"
import { useState, useEffect } from "react"
import axios from "axios"
import { BrowserRouter, Link, Redirect, Router, useHistory, useLocation } from "react-router-dom"
import { FaCoins } from "react-icons/fa"
import { MdPayment } from "react-icons/md"
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
    const [showLink, setShowLink] = useState(false)
    const [tokenValid, setTokenValid] = useState("")
    const [state, setState] = useState(0)
    const[linkToBackOfficePage,setLinkToBackOfficePage]=useState(false)
    const token = JSON.parse(localStorage.getItem("loginToken"))
    
    useEffect(() => {
        const tokenFunc = () => {
        
            if (token && state < 2) {
                setTokenValid(token)
                setImage(`http://localhost:3003/uploads/${tokenValid['img']} `)
                setState((v) => v + 1)
                console.log(state);
            }
            tokenValid['permissions']=== 'admin' && setLinkToBackOfficePage(true)
        }
        tokenFunc()

    }, [tokenValid, state])

 
    function checkExpiration() {
       
        token &&
            axios.get(`http://localhost:3003/users/checkExpiresIn`, { headers: { "Authorization": `Bearer ${token['token']}` } })
            .then(res => {
             console.log(res);
            }).catch(function (error) {
                if (error.response) {
                    console.log({ data: error.response.data, status: error.response.status, headers: error.response.headers });
                    localStorage.removeItem("loginToken")
                    setTokenValid(!tokenValid)
                    setImage("")
                    // window.location.reload()
                    location.pathname != "/login" && history.push("/login")
                }

            })
          
    }
  
    function myFunction() {
        setInterval(function () { checkExpiration(); }, 1800000);
    }
    myFunction()


    const logOutFunc = () => {
        localStorage.removeItem("loginToken")
        setTokenValid("")
        setImage("")
        window.location.reload()
        history.push("/login")

    }

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
                            title={<img className="pull-left" style={{ width: "47px", borderRadius: "25px" }} src={image} />} id="navbarScrollingDropdown">
                            <NavDropdown.Item onClick={() => { logOutFunc() }}>התנתק</NavDropdown.Item>
                     { linkToBackOfficePage ?   (<NavDropdown.Item href="/backOffice">ניהול דפי משתמשים</NavDropdown.Item>):null}
                            <NavDropdown.Item href="/editUser">ערוך פרופיל</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/payment">
                                תרומות לאתר
                                <FaCoins style={{ color: "blue", width: "40px" }} />
                                <MdPayment style={{ color: "blue", width: "40px" }} />
                            </NavDropdown.Item>
                            {/* <NavDropdown.Item>:תרמת<br /> */}
                                {/* {donations?.map(i=>{
                                    return(
                                        <div>
                                   <p>{i.donationAmount}ב{i.date}</p>
                                   <p></p>
                                   </div>
                                    )
                                })} */}

                            {/* </NavDropdown.Item> */}
                        </NavDropdown>
                    }


                </Nav >
            </Navbar>
        </div>


    )
}


