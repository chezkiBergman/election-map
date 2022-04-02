import { Form, FormControl,Button, Alert,Table } from 'react-bootstrap'


export default function HistoryOfDonations({donations}){
      console.log(donations);
      return(
    <div  style={{position: 'absolute',width:"300px",backgroundColor:"white",textAlign:"center", color: 'cadetblue', fontSize: '18px',fontWeight: 'bold',margin:"5px"}}>היסטוריית תרומות
    <Table striped bordered hover size="sm">
      <thead><tr><th>סכום</th><th>תאריך</th></tr></thead><tbody><tr><th>סה"כ</th></tr>{donations.dateDonations.map(item=>{
        return(
         <tr>

           <td>{item.donationAmount}$</td>
           <td>{item.donationDate}</td>
           </tr>
         )})}<td style={{position: 'relative',left: '110px'}}colSpan={3}>{donations.sumDonationHistory}$</td> </tbody></Table></div>

      )
        }

