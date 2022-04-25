import { Container,Alert } from "react-bootstrap"
import { Link } from "react-router-dom";

function confirmResetPass(props) {
console.log(props);

    return(
<Container style={{position:"absolute",top:"20%"}}>
  
    <Alert style={{margin:"auto"}}> בדוק את תיבת<Link style={{textDecoration:"none",padding:"7px"}}
            to='#'
            onClick={(e) => {
                window.location =`https://mail.google.com/`
                e.preventDefault();
            }}
        >
            האימייל
        </Link>
        
        אם התקבלה הודעה על איפוס הסיסמה,
        ההודעה עשויה להישלח עד 5 דקות 
        </Alert>
    
</Container>
    )
}












export default confirmResetPass