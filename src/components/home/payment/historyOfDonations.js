import { Table } from 'react-bootstrap'


export default function HistoryOfDonations({donations}){
      console.log(donations);
      return(
    <div  style={{position: 'absolute',backgroundColor: "#c7d4e8",textAlign:"center", color: 'cadetblue', fontSize: '18px',fontWeight: 'bold',margin:"5px"}}>היסטוריית תרומות
    <Table striped bordered hover size="sm">
      <thead><tr><th>*</th><th>סכום</th><th>תאריך</th></tr></thead><tbody>{donations.dateDonations.map((item,i)=>{
        return(
           <tr key={i}>
           <td>*</td>
           <td>{item.donationAmount}$</td>
           <td>{new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }
                                                
                                                ).format(new Date(item.donationDate))}</td>
           </tr>
         )})}<tr><th>סה"כ</th><td rowSpan={3}colSpan={3}>{donations.sumDonationHistory}$</td></tr> </tbody></Table></div>

      )
        }

