import axios from 'axios'
import { useRef } from 'react';
import  DeleteIcon from '@mui/icons-material/Delete';
import { Form, FormControl,Button, Alert,Table } from 'react-bootstrap'
const token = JSON.parse(localStorage.getItem("loginToken"))

export default function HistoryOfComments({commentByUser}){
    const commentRef = useRef();

    const postDelete=(e)=>{
        
        console.log( e.target.parentElement.__reactProps$h2maovb4d3.children[1].props.children);
const comment = e.target.parentElement.__reactProps$h2maovb4d3.children[1].props.children
        axios.delete(`http://localhost:3003/admin/postDelete/${comment}`,
             { headers: { "Authorization": `Bearer ${token['token']}` } })
                .then(res => {

                    console.log(res);
                }).catch(function (error) {
                    if (error.response) {
                        console.log({ data: error.response.data, 
                            status: error.response.status,
                             headers: error.response.headers });
                    }
                })
    }
     

      return(
    <div  style={{position: 'absolute',right:'0',width:"300px",backgroundColor:"white",textAlign:"center", color: 'cadetblue', fontSize: '18px',fontWeight: 'bold',margin:"5px"}}>
        היסטוריית תגובות
    <Table striped bordered hover size="sm">
    <thead><tr><th>*</th><th>עיר</th><th>תגובה</th></tr></thead>{commentByUser.map((item,i)=>{
        return(
            <tbody key={i}> 
         <tr>
          <td className='btn'  key="delete" icon='true' 
          onClick={(e)=>postDelete(e)}><DeleteIcon/></td>
           <td ref={commentRef}>{item.comment}</td>
           <td>{item.city}</td>
           </tr>
           </tbody>
         
         )})} </Table></div>

      )
        }

