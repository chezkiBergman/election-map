import axios from 'axios'
import { useRef, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import {  Table } from 'react-bootstrap'
import { SettingsPhoneTwoTone } from '@mui/icons-material';
const token = JSON.parse(localStorage.getItem("loginToken"))


export default function HistoryOfComments({ commentByUser, changeComment }) {
 
  console.log(commentByUser);
  const [show, setShow] = useState(true)
 
  const commentRef = useRef();



  let newData;
  const postDelete = (e) => {
   console.log(e.target.parentElement.parentElement.parentElement.children[1]?.textContent);
    const comment = e.target.parentElement.parentElement.parentElement.children[1]?.textContent
console.log(e);
    comment &&
      axios.delete(`admin/postDelete/${comment}`,
      
        ).then(res => {
      
          console.log(res);
          newData = commentByUser.filter(item => item.comment !== comment)
          console.log(newData);
          setShow(false)
          changeComment(newData)
        }).catch(function (error) {
          if (error.response) {
            console.log({
              data: error.response.data,
              status: error.response.status,
              headers: error.response.headers
            });
          }
        })
        
  
  }


  return (
    <>
      {show &&
        <div style={{ position: 'absolute', right: '0', width: "300px", backgroundColor: "white", 
        textAlign: "center", color: 'cadetblue', fontSize: '18px', fontWeight: 'bold', margin: "5px" }}>
          היסטוריית תגובות
          <Table striped bordered hover size="sm">
            <thead><tr><th>*</th><th>עיר</th><th>תגובה</th></tr></thead>{commentByUser?.map((item, i) => {
              return (
                <tbody key={i}>
                  <tr>
                    <td className='btn btn-outline-primary' >
                      <DeleteIcon  onClick={(e) => postDelete(e)} /></td>
                    <td style={{fontSize:"small"}} ref={commentRef}>{item.comment}</td>
                    <td>{item.city}</td>
                  </tr>
                </tbody>

              )
            })} </Table></div>}
    </>
  )
}

