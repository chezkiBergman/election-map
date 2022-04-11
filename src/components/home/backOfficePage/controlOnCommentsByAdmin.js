import axios from 'axios'
import { useRef, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Form, FormControl, Button, Alert, Table } from 'react-bootstrap'
const token = JSON.parse(localStorage.getItem("loginToken"))

export default function HistoryOfComments({ commentByUser, changeComment }) {
  const [comments, setComments] = useState(commentByUser)
  console.log(commentByUser, changeComment);
  const commentRef = useRef();



  let newData;
  const postDelete = (e) => {
    console.log(e.target.parentElement.parentElement.parentElement.children[1].innerText);
    const comment = e.target.parentElement.parentElement.parentElement.children[1].innerText

    comment &&
      axios.delete(`http://localhost:3003/admin/postDelete/${comment}`,
        { headers: { "Authorization": `Bearer ${token['token']}` } })
        .then(res => {
      
          console.log(res);
          newData = comments.filter(item => item.comment !== comment)
          console.log(newData);

          setComments(newData);
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
      {comments &&
        <div style={{ position: 'absolute', right: '0', width: "300px", backgroundColor: "white", textAlign: "center", color: 'cadetblue', fontSize: '18px', fontWeight: 'bold', margin: "5px" }}>
          היסטוריית תגובות
          <Table striped bordered hover size="sm">
            <thead><tr><th>*</th><th>עיר</th><th>תגובה</th></tr></thead>{comments?.map((item, i) => {
              return (
                <tbody key={i}>
                  <tr>
                    <td>
                      <DeleteIcon onClick={(e) => postDelete(e)} /></td>
                    <td ref={commentRef}>{item.comment}</td>
                    <td>{item.city}</td>
                  </tr>
                </tbody>

              )
            })} </Table></div>}
    </>
  )
}

